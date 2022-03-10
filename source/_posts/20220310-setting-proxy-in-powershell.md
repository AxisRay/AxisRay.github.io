---
title: 如何PowerShell会话中设置代理
categories:
- windows
comment: true
typora-root-url: ..\
date: 2022-03-10 21:10:43
tags:
- powershell
---
# 背景
由于众所周知的原因，github的访问一直不太顺畅。
```
PS [GIT_REPO]> git push
fatal: unable to access 'https://github.com/AxisRay/AxisRay.github.io.git/': Failed to connect to github.com port 443 after 21141 ms: Timed out
```
在Bash中，我们可以通过如下命令来为`HTTPS`和`HTTP`设置代理。
```bash
export HTTP_PROXY=http://127.0.0.1:1080
export HTTPS_PROXY=http://127.0.0.1:1080
```
而在Windows下，PowerShell会话中也有类似的设置方式。
# 设置方法
```ps
$env:HTTP_PROXY = "http://127.0.0.1:1080"
$env:HTTPS_PROXY = "http://127.0.0.1:1080"
```
Boom！
```
PS [GIT_REPO]> git push
Enumerating objects: 23, done.
Counting objects: 100% (23/23), done.
Delta compression using up to 8 threads
Compressing objects: 100% (11/11), done.
Writing objects: 100% (14/14), 8.09 KiB | 1.62 MiB/s, done.
Total 14 (delta 7), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (7/7), completed with 5 local objects.
To https://github.com/AxisRay/AxisRay.github.io.git
   b582b44..90e06b5  source -> source
```
