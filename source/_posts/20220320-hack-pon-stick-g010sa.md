---
title: 魔改G-010S-A“猫棒”（PON STICK ONU）原生固件，支持LOID认证（一）
comment: true
typora-root-url: ..\
date: 2022-03-20 13:40:10
categories:
- HACK
tags:
- Reverse
---
# 背景

## 什么是“猫棒”
不知从何时起，突然掀起了一波用`猫棒`替换光猫的研究热潮。    
所谓`猫棒`的学名是`PON STICK ONU`，即是一种SFP光模块（STICK）形态的光网络单元（ONU）或者叫光网络终端（ONT）[1]，用来接入在无源光网络（PON）。说人话就是家里拉宽带，运营商给的光猫。只不过`猫棒`是个SFP光模块形态的“棒子”，而不像一般的光猫是个盒子。从这个角度看“猫棒”这个名字还是很形象的。另外不同于一般的1G/10G网络用的SFP/SFP+光模块只是个`PHY`，“猫棒”里面是有独立的SOC，跑着定制的Linux系统，包含OMCI协议的实现，是一个完完整整的光猫。    
<!-- more -->
## “猫棒”的价值
用“猫棒”主要目的有两个：    
1. 相对于运营商送的光猫，“猫棒”的体积很小。而且是标准的`SFP`接口，可以直接插入到带SFP接口的路由器或者交换机，省去光猫及其电源适配器。    
这对于寸土寸金的家庭弱电箱而言可谓意义非凡，同时也是“垃圾佬”们打造“ALL-IN-ONE（BOOM）”的“梦中情人”。    
2. 随着国家“提速降费”的政策号召，很多人家中已经用上了千兆带宽，且由于运营商会留余量，实际分配的带宽往往超过千兆。虽然主流的GPON网络最大支持2.5Gbps的下行，但是运营商给的光猫却只有千兆口，再加上PPPoE/Ethernet/TCPIP等协议的损耗，实际带宽能跑到940M左右就不错了。花了千兆的钱，却用不上千兆，那当然是不爽的。而有些“猫棒”的SFP口是支持HSGMII的，可以支持2.5Gbps，甚至直接是SFP+，可以支持到万兆，这就解决了千兆带宽的“瓶颈”问题。 

## “猫棒”的来源
目前市场上的“猫棒”主要来源于通信市场上淘汰下来的洋垃圾。据知情大佬透露，早些年这类模块在通信工程领域流行过一段时间，但是由于稳定性不足（我猜主要是散热，这玩意工作起来能达到80-90摄氏度）、本身也没有什么优势，后来就逐步停产了。当前家用千兆内的宽带接入技术中，GPON使用相对广泛，而目前支持GPON的“猫棒”的主要有RealTek和Lantiq两家的方案，支持2.5Gbps速率的就只有Lantiq的方案。    
当前比较受“垃圾佬”们欢迎的“猫棒”型号主要有华为的`MA5671A`、阿尔卡特-朗讯/诺基亚（Alcatel-Lucent/Nokia）`G-010S-A`（由于阿朗被诺基亚收购，所谓诺基亚模块也是指的这款）。
受欢迎的原因一方面是市面存量多、容易买到、价格便宜（50元/个），另一方面都是基于Lantiq的方案，支持2.5Gbps的速率。更重要的是，Lantiq固件是基于开源的Openwrt 14.07定制开发的，相对容易修改。    
目前市面上有多款魔改固件供选择，主要是为了满足不同的运营商场景。因为ONU/OLT这类光猫设备运营商是做了认证绑定的，一般是不允许用户私自替换，魔改的固件主要是为了适配不同地区不同运营商不同的认证要求。

# HACK 

## G-010S-A
我目前有两个“猫棒”，一个是上述提到的比较流行的`G-010S-A`的“猫棒”，另一个是相对较罕见的`G-010S-P`，都是阿尔卡特-朗讯/诺基亚。之所以没有买更主流的华为`MA5671A`，一方面华为模块锁了后台需要拆芯片刷固件，刷好固件的华为的`MA5671A`已经被JS炒到200多块了。相对的阿朗/诺基亚的模块没有锁后台，可以免拆刷固件，特别`G-010S-P`这个型号和华为`MA5671A`是一模一样的，只是市面上非常罕见。另一方面，华为的模块已经有比较多的人研究了，市面上固件选择很多，可玩的空间有限，毕竟，我买模块又不是为了用😀。

目前适配G-010S-A的固件主要有两类：一类是原厂原生固件，另一类是各类第三方魔改/移植类的固件。这两者有个核心的不同，那就是大部分第三方固件的OMCI协议栈实现，用的是从别处移植的Lantiq官方SDK中的omcid或者是在此基础上的修改版，用来支持各类认证方式。但是原厂固件中用的是阿朗/诺基亚自己的ocmiMgr，至于两者有什么不同，我目前还不清楚，但是这次我研究的目标就是这个原厂固件中的ocmiMgr，看是否有改造的空间，适配我本地的ISP，以便替代光猫。

## LOID认证
在Github上，[hwti](https://github.com/hwti)收集和研究了`G-010S-A`不同版本的原厂固件，并开辟了一个[Git仓库](https://github.com/hwti/G-010S-A)。广东地区电信普遍用的是LOID认证，关于G-010S-A的LOID认证配置我咨询了他，答复如下。
>For the LOID, I see code to read `LOID` and `LOIDPassword` from ri/scfg in `libdataModel.so` which is called by `parser` and `omciMgr`, but the driver doesn't have them in its list (this is a binary format in the "ri" mtd).
So the code seems to be present, but with no way to give it the values (unless patching either `libdataModel.so` or `scfg.ko`, but it wouldn't be easy).

大意是说，从原厂的固件逆向可以看得到，固件本身是支持LOID和LOIDPassword的，会尝试从ri分区读取加载相关的配置，但是遗憾的是没有设置的地方，除非可以修改驱动，将参数传入进去。


## 追本溯源

既然固件会去读取ri分区，那我直接把配置写入到ri分区不就好了？但是ri分区内容是二进制格式（Binary Format），而我不清楚其格式和定义，也没有源代码可供分析，这时候只能祭出逆向大法。这里使用开源的`Ghidra`静态分析工具。    

### libdataModel.so

根据`hwti`的提示，相关的函数在`libdataModel.so`中。如下图所示，它是通过调用`scfg_get这个`函数去获取和加载`LOID`和`LOIDPassword`。

![libdataModel.so](/img/20220320-hack-pon-stick-g010sa/image-20220320215324913.png)

### libscfg.so

而`scfg_get`在`libscfg.so`这是个用户空间的工具库中被定义和实现。其内部又通过`ioctl`访问虚拟设备`scfg`。

![libscfg.so](/img/20220320-hack-pon-stick-g010sa/image-20220320220123986.png)

除了`scfg_get`，在这个`libscfg.so`工具库中，还暴露了诸如`scfg_dump`、`scfg_set`等函数。特别是`scfg_dump`，典型的调试专用，那意味着应该有基于`libscfg.so`实现的调试工具。

### scfgtool

经过关键词检索，果然在`/usr/exe/`目录下提供了一个`scfgtool`的调试工具。同时这个工具被`ritool`链接（`/sbin/ritool -> /usr/exe/scfgtool`）。

```
ONTUSER@SFP:/sbin# ritool -h
Usage:
    scfgtool [OPTIONS] ....

OPTIONS
    -h, help
            Output a small usage guide
    get
            get specified scfg value
    set
            set specified scfg value
    dump
            dump all scfg value
```

这个工具提供了`set`方法，那我是不是可以直接`ritool set LOID xxxxxxx`就可以搞定了？Naive！测试结果如下：

```
ONTUSER@SFP:/sbin# ritool set LOID 7554196032
Set scfg descrip=LOID value=7554196032 failed.
```

同时在内核日志中有如下输出

```
[ 1527.488000] [K_SCFG] scfg_drv_ioctl: set scfg[LOID] from userspace
[ 1527.488000] item not exist, please check your input LOID
```

这意味着，`scfg`中并没有实现`LOID`和`LOIDPassword`这两个key，也就不能给他赋值。看来此路不通，那要继续看`scfg`这个虚拟设备在内核中如何实现的。

# 未完待续

# 参考资料

- [1] [what-is-the-difference-between-ont-onu](https://us.hitrontech.com/learn/what-is-the-difference-between-ont-onu/ )