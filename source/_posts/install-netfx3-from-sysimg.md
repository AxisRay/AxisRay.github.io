---
title: 从光盘或镜像中安装.NetFramework
date: 2014-12-05 11:55:12
categories:
- windows
tags:
- dotnet
comment: true
---
windows8预装了.Net Framework4.0，但是4.0并不会向下兼容使用更早.Net版本编写的程序。当我们运行一个使用更早版本编写的.Net程序时，Windows会自动帮我们下载并安装.Net Framework3.5。但是当遇到没有网络或者网速比较慢的时候就比较难受了。所以我们可以选择从Windows8光盘或者镜像安装.
假设光盘或光盘镜像的盘符为X，在命令提示符中输入
```
DISM /Online /Enable-Feature /FeatureName:NetFx3 /All /LimitAccess /Source:X:\sources\sxs
```
![NetFx3](/img/NetFx3.gif)