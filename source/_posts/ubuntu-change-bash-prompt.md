---
title: Ubuntu下修改Bash的提示符
date: 2015-01-27 22:23:33
categories:
- linux
tags:
- prompt
- linux
- bash
---
Bash的提示符设置保存在$PS1这个变量中，通过echo命令可以查看当前设置
``` bash
ray@Ray-Laptop:~$ echo $PS1
${debian_chroot:+($debian_chroot)}\u@\h:\w\$ 
```
<!-- more -->
默认的一些特殊符号所代表的含义：
__\d__ ：代表日期，格式为weekday month date，例如："Mon Aug 1"
__\H__ ：完整的主机名称。例如：我的机器名称为：Ray-Laptop.local，则这个名称就是Ray-Laptop.local
__\h__ ：仅取主机的第一个名字，如上例，则为Ray-Laptop，local则被省略
__\t__ ：显示时间为24小时格式，如：HH：MM：SS
__\T__ ：显示时间为12小时格式
__\A__ ：显示时间为24小时格式：HH：MM
__\u__ ：当前用户的账号名称
__\v__ ：BASH的版本信息
__\w__ ：完整的工作目录名称。家目录会以 ~代替
__\W__ ：利用basename取得工作目录名称，所以只会列出最后一个目录
__\\#__ ：下达的第几个命令
__\$__ ：提示字符，如果是root时，提示符为：# ，普通用户则为：$

我们可以通过修改提示符方法解决进入较深目录时，提示符过长的问题：

``` bash
PS1=${debian_chroot:+($debian_chroot)}\u@\h:\W\$ 
```

即将原来的\w替换为\W，但是该方法仅在本次会话有效。我们可通过修改用户根目录～下的.bashrc文件，达到长期有效的目的。

修改前：
![prompt-too-long](/img/prompt-too-long.png)
修改后：
![prompt-proper](/img/prompt-proper.png)


