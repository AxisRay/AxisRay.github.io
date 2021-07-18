---
title: tmux使用笔记
date: 2015-01-28 12:33:42
categories:
- linux
tags:
- tmux
- linux
comment: true
---
# tmux简介
tmux是
一个优秀的终端复用软件，类似GNU Screen，但来自于OpenBSD，采用BSD授权。tmux采用C/S模型构建，包含以下模块Server，Session，Window，Panel
![tmux](/img/tmux.jpg)
<!-- more -->
# 安装使用

``` bash
$ apt-get install tmux
```
终端中键入tmux,首先会启动Server,然后就创建一个Session，这个Session会创建一个Window，仅包含一个Panel。

tmux new -s session
tmux new -s session -d #在后台建立会话
tmux ls #列出会话
tmux attach -t session #进入某个会话

* Server 服务器
第一次键入tmux启动的时候就开启了一个服务器Server，通过这个服务器甚至可以实现终端共享。

* Session 会话
每使用tmux命令启动，便会建立一个会话Session，一个服务器可以保持多个会话连接，同时我们也可以在多个会话之间切换。

* Window 窗口
一个Session可包含多个窗口Window，每个窗口都以标签的形式显示在Session下面的状态栏里

* Panel 面板
每个窗口可以划分多个Panel，实现分屏显示



# 操作说明

Ctrl+b (C-b) 是激活tmux控制台的默认快捷键，以下的控制命令都要先键入Ctrl+b激活控制台。

## 1、系统操作

 __?__ 列出所有快捷键；按q返回
 __d__ 脱离当前会话；这样可以暂时返回Shell界面，输入tmux attach能够重新进入之前的会话
 __D__ 选择要脱离的会话；在同时开启了多个会话时使用
 __s__ 选择并切换会话；在同时开启了多个会话时使用
 __:__ 进入命令行模式；此时可以输入支持的命令，例如kill-server可以关闭服务器
 __[__ 进入复制模式；此时的操作与vi/emacs相同，按q/Esc退出
 __~__ 列出提示信息缓存；其中包含了之前tmux返回的各种提示信息
 __C-z__ 挂起当前会话

## 2、窗口操作

__c__ 创建新窗口
__&__ 关闭当前窗口
__p__ 切换至上一窗口
__n__ 切换至下一窗口
__l__ 在前后两个窗口间互相切换
__w__ 通过窗口列表切换窗口
__,__ 重命名当前窗口；这样便于识别
__.__ 修改当前窗口编号；相当于窗口重新排序
__f__ 在所有窗口中查找指定文本
__数字__ 切换至制定窗口

## 3、面板操作

__”__ 将当前面板平分为上下两块
__%__ 将当前面板平分为左右两块
__x__ 关闭当前面板
__!__ 将当前面板置于新窗口；即新建一个窗口，其中仅包含当前面板
__q__ 显示面板编号
__o__ 在当前窗口中选择下一面板
__{__ 向前置换当前面板
__}__ 向后置换当前面板
__Alt+o__ 逆时针旋转当前窗口的面板
__Alt+方向键__ 以5个单元格为单位移动边缘以调整当前面板大小
__Ctrl+o__ 顺时针旋转当前窗口的面板
__方向键__ 移动光标以选择面板
__Ctrl+方向键__ 以1个单元格为单位移动边缘以调整当前面板大小
__Space__ 在预置的面板布局中循环切换；依次包括even-horizontal、even-vertical、main-horizontal、main-vertical、tiled


