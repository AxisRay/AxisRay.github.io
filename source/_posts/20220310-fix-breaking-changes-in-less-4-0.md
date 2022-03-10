---
title: 修复less升级到4.0+版本导致的页面异常
date: 2022-03-10 23:01:07
categories:
- web
tags:
- js
comment: true
---
# 背景
顺shou手jian升级了下博客的`Hexo`版本和依赖的npm包，重新渲染了一遍博客发现页面元素都错位了。看来是某个依赖包有breaking-changes。
```
PS > npm-check-updates -u
Upgrading C:\Users\rayle\OneDrive\桌面\AxisRay.github.io\package.json
[====================] 16/16 100%

 hexo                         ^5.4.0  →  ^6.0.0
 hexo-generator-json-content  ^4.1.6  →  ^4.2.3
 hexo-renderer-ejs            ^1.0.0  →  ^2.0.0
 hexo-renderer-less           ^2.0.2  →  ^4.0.0
 hexo-renderer-marked         ^4.1.0  →  ^5.0.0
 hexo-renderer-stylus         ^2.0.0  →  ^2.0.1
 hexo-server                  ^2.0.0  →  ^3.0.0

Run npm install to install new versions.
```
<!-- more -->
# 定位
经过简单的检索，应该是`hexo-renderer-less-4.0.0`，这个npm包引入的问题。其[更新说明](https://github.com/hexojs/hexo-renderer-less/releases/tag/4.0.0)中提示`less`更新到了4.1.2版本，而在`less`的4.0版本的[更新说明]((https://github.com/less/less.js/releases/tag/v4.0.0))中提示引入了两个会破坏向前兼容的两个特性。    
第一个特性：
> **Parentheses required for mixin calls**    
> This aligns it with syntax for calling detached rulesets.

这个检查了下，模板中并没有关于`mixin`的引用，可以排除

第二个特性：
> **Parens-division now the default math setting**  
> Parentheses are required (by default) around division-like expressions, to force math evaluation.

看来是这个特性导致的了。根据其[说明](https://lesscss.org/usage/#less-options-math)，对于数学计算（`math`），默认选项从`always`变成了`parens-division`。    
具体变化就是，在`less`中进行除法计算，不能单纯的使用斜杠（`/`），而是必须使用圆括号括起来，例如`(2px / 2)`，或者使用`./`,例如`2px ./ 2`。但是需要注意的是`./`也过时（`deprecated`）了，即可能在未来的版本中移除，还是不要用的好。

# 修复
知道了问题原因，剩下的就是怎么修复了。根据说明，我们有两种选择，要么把所有的除法运算全部按要求改过来，要么把`math`的选项从默认的`parens-division`改回`always`。考虑到模板里面除法计算的地方比较多，我决定还是用采用后者办法。    
根据`hexo-renderer-less`的[说明文档](https://github.com/hexojs/hexo-renderer-less)，可以在模板中的配置文件`_config.yml`中设置`less`的渲染/编译选项。    
这里按下列方式在模板的配置文件`_config.yml`中增加相关的选项，问题即可解决。
```yaml
...
# Less
less:
  options:
    # fix breaking changes in less 4.0+
    # https://github.com/less/less.js/releases/tag/v4.0.0
    math: always
...
```

