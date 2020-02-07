---
title: 解决jenkins没有权限调用Docker的问题
date: 2017-06-17 22:23:33
categories:
- linux
tags:
- docker
- linux
- jenkins
---
jenkins在构建步骤中调用docker提示如下错误。
> dial unix /var/run/docker.sock: permission denied. Are you trying to connect to a TLS-enabled daemon without TLS?

<!-- more -->
明显这是因为权限问题导致，参考[stackoverflow](https://stackoverflow.com/questions/40877705/var-run-docker-sock-permission-denied-while-running-docker-within-python-cgi-s)上的解决方案，将Jenkins用户添加到docker组中，重启docker服务即可。
``` bash
sudo usermod -a -G docker $username
```
但是或许是由于docker或者系统版本比较老，没有所谓的docker组，只有dockerroot组。将jenkins添加到dockerroot组后仍然提示权限不足。直接让jenkins以root身份运行也不安全，于是考虑使用sudo曲线救国。  
* 编辑sudoers文件
``` bash
visudo
```
* 添加命令别名
```
## Docker
Cmnd_Alias DOCKER = /usr/bin/docker

```
* 给jenkins以sudo权限
``` bash
jenkins ALL=(ALL)       NOPASSWD:DOCKER
```
* :wq保存退出，调整jenkins构建步骤，增加sudo  
```
16:09:36 Sending build context to Docker daemon   148 kB
16:09:36 Sending build context to Docker daemon 
16:09:36 Step 0 : FROM microsoft/dotnet
16:09:36  ---> 2c9e30c8fccd
16:09:36 Step 1 : WORKDIR /app
16:09:36  ---> Running in 3c50062d5f6d
16:09:40  ---> 3d22684a6579
```
至此问题解决，不过这样还是后有些安全隐患，后续再考虑优化吧。