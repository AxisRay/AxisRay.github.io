---
title: 解决ubuntu下phpmyadmin缺少mcrypt扩展的错误
date: 2014-12-06 21:08:46
categories:
- linux
tags:
- ubuntu
- phpmyadmin
---
在ubuntu用apt-get安装phpmyadmin后，总会出现如下错误
![php-mod-mcrypt](/img/php-mcrypt.gif)
解决方法很简单，使用如下命令启用mcrypt组件
``` bash
$ php5enmod mcrypt
```