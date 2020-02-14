---
title: Git如何合入上游仓库的分支
date: 2020-02-06 20:03:45
categories:
- git
tags:
- git
---
# 背景
github上的开源项目有时无法完全满足自己需要，或者项目本身存在BUG，但是等不到开发者去修复。这时候我们往往会选择fork，然后自行修改或使用。但是一段时间后，原项目开发者可能会更新项目，追加新的功能或者修复已知BUG。这时，为了避免与上游脱节，我们需要将上游仓库合入到我们fork的仓库中。
<!-- more -->
# 操作步骤
这里以本blog的主题（theme）为例，我fork了原作者的仓库，并在其基础上做了些个性化的改动，这些改动作者肯定不会合入的。但是近期原作者做了一些更新，加入的新的功能，因此我要将最新的版本合入到我自己的仓库中。详细操作步骤如下：



## 将要自己的仓库克隆（clone）到本地
```
git clone https://github.com/AxisRay/hexo-theme-material-flow.git
```
## 添加要合入的上游仓库
```
git remote add upstream https://github.com/stkevintan/hexo-theme-material-flow.git
```
## 拉取（pull）上游仓库
```
git fetch upstream
```
## 创建并切换到新的本地分支（branch），并将其连接到上游仓库要合入的分支
```
git checkout -b upm upstream/master
```
## 切换到自己仓库要合入的分支，并将上述新分支合入
```
git checkout master
git merge upm
```
## 最后将自己仓库更新（push）上去即可
```
git push origin master
```

