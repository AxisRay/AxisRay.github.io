title: Bash变量操作实验-变量的测试和内容替换
date: 2015-01-29 10:15:21
categories:
- Linux
tags:
- bash
- linux
---
# 前言
某些时候，我们在给变量赋值之前要对__某个__变量进行__判断__,根据结果来决定我们下一步的赋值操作。
# 实验准备
``` bash
$ var_value="test"
$ var_empty=""
$ unset var_null
$ result="hello"
```
先创建4个变量（实际上是3个，因为var_null不存在）。
var_value值为test
var_empty值为空字符
var_null不存在，用unset确保它不存在
result用来保存结果，先赋个初值hello
<!-- more -->
## 实验1、“-”操作符
``` bash
$ echo $result
hello
$ result=${var_value-default}
$ echo $result
test
$ result=${var_empty-default}
$ echo $result

$ result=${var_null-default}
$ echo $result
default
```
因为$var_value存在，所以$result的值被替换成$var_value的值，即test
虽然$var_value为空字符，但也视为变量存在，因此$result的值被替换为$var_empty的值，即空字符
因为$var_null不存在，所以$result的值被替换为默认值default

要把空字符也视为变量不存在，则需要":"操作符
>__Tips__
>需要注意的是，绝大多数情况下，Bash并不区分空变量和空字符变量,但是此处会做区分。而“：”操作符会取消他们之间的差异。
>[__详情可点击这里查看__](http://stackoverflow.com/questions/12262696/using-unset-vs-setting-a-variable-to-empty)

``` bash
$ echo $result
hello
$ result=${var_empty:-default}
$ echo $result
default
```
## 实验2、“+”操作符
“+”基本上和“-”是完全相反的，而“：”则会和刚才一样把空字符变量和空变量一视同仁
``` bash
$ echo $result
hello
$ result=${var_value+default}
$ echo $result
default
$ result=${var_empty+default}
$ echo $result
default
$ result=${var_null+default}
$ echo $result

$ result=${var_empty:+default}
$ echo $result

```
## 实验3、“=”操作符
“=”操作符的规则基本和“-”一致，但是替换时会把两个变量一同替换。而“：”操作符会把空字符变量和空变量一视同仁。
``` bash
$ echo $result
hello
$ result=${var_value=default}
$ echo $result
test
$ echo $var_value
test
$ result=${var_empty=default}
$ echo $result

$ echo $var_value

$ result=${var_null=default}
$ echo $result
default
$ echo $var_null
default
$ result=${var_empty:+default}
$ echo $result

```
## 实验4、“?”操作符
“?”操作符与“-”的差异是，当被检查的变量为空时，会将默认字符送入标准错误流，而不是赋值给变量。
``` bash
$ echo $result
hello
$ result=${var_value?default}
$ echo $result
hello
$ result=${var_empty?default}
$ echo $result

$ result=${var_null?default}
bash: var_null: default
$ echo $result

$ result=${var_empty:?default}
bash: var_null: default
$ echo $result

```
