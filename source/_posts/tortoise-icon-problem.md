---
title: 解决TortoiseSVN/Git覆盖图标失效的问题
date: 2014-12-09 20:38:23
categories:
- git
tags:
- git
- tortoise
comment: true
---
最近发现TortoiseGit的覆盖图标不见了，从版本库里clone下来的源码没有了已同步，已修改之类的图标提示。下面给出解决办法：（感谢[woyaowenzi](http://blog.csdn.net/woyaowenzi/article/details/7538053)）
<!-- more -->
Windows最多允许15个覆盖图标，系统占用了约4个，用户可用的只有11个左右。
TortoiseSVN或者TortoiseGit标准会占用7个覆盖图标，分别为：
_普通图标、已修改图标、冲突指示图标、已删除图标、新增文件图标、忽略图标、未版本化图标_
而每个网盘类的客户端又会占用3个左右。
![tortoise-icon](/img/tortoise-icon.gif)
所有应用程序的覆盖图标都需要在注册表
```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\ShellIconOverlayIdentifiers
```

下面增加一个项目，当需要显示覆盖图标时，Windows会按照项目名称的字母顺利依次查询在这些项目里所指示的接口，以检测是否有覆盖图标，_当检测到11个有效的接口后，Windows就会自动停止继续向下检测，这样，后来的覆盖图标就不会显示了。_

__解决方法__：把其他网盘类的覆盖图标注册表项删除，让TortoiseSVN/Git的注册表项提前