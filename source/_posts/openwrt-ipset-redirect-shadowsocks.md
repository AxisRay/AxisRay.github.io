---
title: 在openwrt中利用ipset将特定流量转发到shadowsocks
date: 2014-12-01 22:43:23
categories:
- openwrt
tags: 
- openwrt
- shadowsocks
---
# 一、__前言__
虽然*Chrome*里的*SwitchySharp*插件可以根据规则自动转发特定流量到*Shadowsocks*，但是这种方式局限性还是很大。[北落师门][1]的博文中提供了一种在路由上自动转发特定流量的方法，使得转发过程对于客户端是透明的。我参考他的方法，做了一些改进。
>* 使用gfwlist扩大适用网站范围
>* 使用ss-tunnel解决DNS污染

 大致过程如下
 >* dnsmasq将指定列表中的域名通过ss-tunnel发往未被污染的DNS进行解析，并将结果保存到ipset中
 >* 在iptable中建立规则，将ipset中的IP的TCP流量重定向到ss-redir透明代理
 
<!-- more -->
# 二、__配置Shadowsocks客户端__
我使用的是shadowsocks-libev（包含 ss-{redir,local,tunnel} 三个可执行文件）
>[shadowsocks-libev_1.5.3-1_ar71xx.ipk](http://sourceforge.net/projects/openwrt-dist/files/shadowsocks-libev/1.5.3-5cc562f/ar71xx/)

其他版本可以去sourceforge的[openwrt-dist](http://sourceforge.net/projects/openwrt-dist/files/shadowsocks-libev/1.5.3-5cc562f/ar71xx/shadowsocks-libev-spec_1.5.3-1_ar71xx.ipk/download)下载.
  [1]: http://hong.im/2014/07/08/use-ipset-with-shadowsocks-on-openwrt/ "使用ipset让openwrt上的shadowsocks更智能的重定向流量-北落师门"
  用WinSCP上传到路由器，或者用wget命令直接在路由上下载。然后用opkg安装。
``` bash
$ opkg install shadowsocks-libev*.ipk 
```
 安装完成后编辑shadowsocks的配置文件。
``` bash
$ vim /etc/shadowsocks.json
```
 请按实际情况自行修改
``` 
{
	"server":"198.199.101.201",
	"server_port":10086,
	"local_port":1080,
	"password":"fuckgfw",
	"method":"aes-256-cfb"
} 
```
然后让shadowsocks自动启动
``` bash
$ /etc/init.d/shadowsocks enable
```
修改shadowsocks的启动配置文件
``` bash
$ vim /etc/init.d/shadowsocks
```
修改成如下所示
```bash
#!/bin/sh /etc/rc.common

START=95

SERVICE_USE_PID=1
SERVICE_WRITE_PID=1
SERVICE_DAEMONIZE=1

CONFIG=/etc/shadowsocks.json

start() {
	# Client Mode
	#service_start /usr/bin/ss-local -c $CONFIG

	# Proxy Mode
	service_start /usr/bin/ss-redir -c $CONFIG
	service_start /usr/bin/ss-tunnel -c $CONFIG -l 5353 -L 8.8.8.8:53 -u
}

stop() {
	# Client Mode
	#service_stop /usr/bin/ss-local

	# Proxy Mode
	service_stop /usr/bin/ss-redir
	service_stop /usr/bin/ss-tunnel
}
```
至此，shadowsocks的客户端配置完成
# 三、__配置dnsmasq__
 dnsmasq可以将指定列表中的域名通过ss-tunnel发往未被污染的DNS进行解析，并将结果保存到ipset中。但是OpenWrt默认版本的dnsmasq没有ipset功能，同时也没有安装ipset。
 不过Openwrt源中提供了完整版本的dnsmasq即dnsmasq-full。因此我们可以执行以下命令卸载精简版并安装完整版本的dnsmasq和ipset。
 
``` bash
 $ opkg update
 $ opkg remove dnsmasq
 $ opkg install dnsmasq-full
 $ opkg install ipset
```
 安装ipset的时候可能会报类似下面的错误
``` bash
kmod: failed to insert /lib/modules/3.10.44/ip_set.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_bitmap_ip.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_bitmap_ipmac.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_bitmap_port.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_hash_ip.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_hash_ipport.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_hash_ipportip.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_hash_ipportnet.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_hash_net.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_hash_netiface.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_hash_netport.ko
kmod: failed to insert /lib/modules/3.10.44/ip_set_list_set.ko
kmod: failed to insert /lib/modules/3.10.44/xt_set.ko
```
不用担心，因为ipset安装后需要重启才能正常工作，我们暂时先不重启，继续配置。
打开dnsmasq的配置文件
``` bash
$ vim  /etc/dnsmasq.conf
```
在最后面加入
```bash
conf-dir=/etc/dnsmasq.d
```
在/etc目录下新建一个目录dnsmasq.d
``` bash
$ mkdir /etc/dnsmasq.d
```
在这个目录下，我们要存放规则文件，将特定域名发往ss-tunnel。我采用的是gfwlist提供的规则，但是需要转换成dnsmasq认可的配置文件。我提供了一份转换好的配置文件，大家可以直接下载到dnsmasq.d目录下。
``` bash
$ cd /etc/dnsmasq.d
$ wget http://axisray.me/share/gfwdomains.conf
```
关于这份配置文件需要说明的是，dnsmasq会把列表中的域名发往__127.0.0.1:5353__解析，并将结果保存在名为__gfwipset__的ipset中。如果你配置的ss-tunel和ipset和我不一样的话，就需要手动处理该配置文件，或者根据下面的说明自行生成合适的配置文件。
# 四、__ipset配置__
我们需要创建一个ipset，并在iptable中添加一条规则，重定向ipset中ip的流量到shadowsocks(ss-redir在1080端口监听)。
``` bash
ipset -N gfwipset iphash
iptables -t nat -A PREROUTING -p tcp -m set --match-set gfwipset dst -j REDIRECT --to-port 1080
```
值得注意的是，这两条命令重启后就会失效，所以我们需要添加到/etc/rc.local中去
``` bash
$ vim /etc/rc.local
```
修改成下面所示
``` bash
# Put your custom commands here that should be executed once
# the system init finished. By default this file does nothing.

ipset -N gfwipset iphash
iptables -t nat -A PREROUTING -p tcp -m set --match-set gfwipset dst -j REDIRECT --to-port 1080

exit 0

```
至此，所有配置均已完成，重启路由即可
``` bash
$ reboot
```
# 五、__关于gfwlist转换成dnsmasq的配置文件__
这是我从网上找到的一个Python的脚本
``` python gfwlist.py http://axisray.me/share/gfwlist.py
# Modified from http://autoddvpn.googlecode.com/svn/trunk/grace.d/gfwListgen.py
#!/usr/bin/env python

from os.path import expanduser
import urllib
import base64
import string

gfwlist = 'http://autoproxy-gfwlist.googlecode.com/svn/trunk/gfwlist.txt'
# some sites can be visited via https or is already in known list
oklist = ['flickr.com','amazon.com','twimg.com']
print ("fetching gfwList ...")
d = urllib.urlopen(gfwlist).read()
print("gfwList fetched")
data = base64.b64decode(d)
lines = string.split(data, "\n")

gfwlistfile = open('./gfwlist.txt', 'wa')
for l in lines:
	gfwlistfile.write(l+'\n')
gfwlistfile.close()

newlist = []

for l in lines:
	if len(l) == 0:
	        continue
	if l[0] == "!":
	        continue
	if l[0] == "@":
	        continue
	if l[0] == "[":
	        continue
	l = string.replace(l, "||","").lstrip(".")
	l = string.replace(l, "|https://","")
	l = string.replace(l, "|http://","")
	# strip everything from "/" to the end
	if l.find("/") != -1:
	        l = l[0:l.find("/")]
	if l.find("%2F") != -1:
	        continue
	if l.find("*") != -1:
	        continue
	if l.find(".") == -1:
	        continue
	if l in oklist:
	        continue
	newlist.append(l)

newlist = list(set(newlist))
newlist.sort()

# generate dnsmasq configuration
gfwdn = open('./gfwdomains.conf', 'wa')

for l in newlist:
        gfwdn.write('server=/'+l+'/127.0.0.1#5353\n')#ss-tunel
        gfwdn.write('ipset=/'+l+'/gfwipset\n')#ipset

gfwdn.close()
```