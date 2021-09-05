---
title: 【PM3】对公司新工卡的分析记录（二）——嗅探准备
date: 2021-09-05 13:24:34
categories:
- RFID
tags:
- proxmark3
- JCOP
---
# 背景
上一篇说到公司换上了“新开普”工卡系统，新的工卡是一种CPU卡。其MIFAREClassic部分成功DUMP出来，但是没有有价值的信息，分析之路暂告一段落。

这次尝试使用PM3强大的Sniff（嗅探）功能，抓取和门禁的交互，看是否能够获取到有价值的信息。
# 嗅探
在之前[重置小米空气净化器滤芯寿命](https://raycn.pub/2021/08/21/reset-xiaomi-air-purifier-filters/)那一篇中，已经初步领略到了嗅探功能的强大。这一次虽然还是嗅探，但是我们打算换一种方式使用。

PM3是要连接电脑使用的。想象一下，如果我们抱着电脑，拿着一个奇怪的小装置，在门禁旁边进行可疑的操作，一定会被警察叔叔当成可疑份子抓起来。所以要嗅探门禁，必须采取一种更加便捷、隐蔽的方式进行。

# 工具准备
<!--more-->
## Standalone模式
PM3提供了一种名为[Standalone](https://github.com/RfidResearchGroup/proxmark3/wiki/Standalone-mode)的模式，可以让PM3在不连接电脑（客户端）的状态下运行一些特制的功能模块，并使用PM3上面唯一的按钮进行交互，通过指示灯来显示状态。

脱离了电脑，同时也就没有了电源。Standalone模式必须有独立的供电才行（废话），可以使用充电宝或者官方的BlueShark模块来供电。

## HF_14ASNIFF
这里我们适用一个名为`HF_14ASNIFF`的模块（由[Michael Farrell](https://github.com/micolous)提供）。正如其名，这个模块实现脱机嗅探，并保存在PM3的Flash中（仅RDV4版本支持）。这个模块可以让我们实现便捷、隐蔽的嗅探。

## 固件更新
PM3的固件只能包含一种嗅探功能。因此，需要重新编译包含此嗅探模块的固件。

执行下列命令，拉取最新的主线代码，并创建我们自定义的编译配置文件。
```
$ git clone https://github.com/RfidResearchGroup/proxmark3.git
$ cd proxmark3/
$ cp Makefile.platform.sample Makefile.platform
```
编辑我们创建好的`Makefile.platform`。按下面所示,添加一行`STANDALONE=HF_14ASNIFF`。

如果你有BlueShark模块可以像我一样去掉`PLATFORM_EXTRAS=BTADDON`前面的＃号，
```
# If you want to use it, copy this file as Makefile.platform and adjust it to your needs
# Run 'make PLATFORM=' to get an exhaustive list of possible parameters for this file.

PLATFORM=PM3RDV4
#PLATFORM=PM3GENERIC
# If you want more than one PLATFORM_EXTRAS option, separate them by spaces:
PLATFORM_EXTRAS=BTADDON
#STANDALONE=LF_SAMYRUN
STANDALONE=HF_14ASNIFF
```

执行下列命令，编译并刷入固件。
```
$ make clean && make all -j
$ sudo ./pm3-flash-fullimage
```
如果没有什么错误提示，我们就可以进入下一步验证环节

## 嗅探测试
PM3有A、B、C、D四个指示灯和一组电源灯，如下图所示：

![指示灯](/img/2021-09-05-12-17-55.png)

拨动开关开机，然后长按按钮直至进入Standalone模式。此时A、B、C、D四个指示灯依次闪烁。最后A常亮。代表已经成功进入Standalone模式。

<center>
<table><tr>
<td><img src="/img/1-power_on.gif" style="right: 10px;"></td>
<td><img src="/img/2-standalone.gif" ></td>
</tr></table>
</center>

将PM3和卡片放在一起，靠近读卡器。此时，指示灯B、C交替闪烁，说明已经嗅探到卡片与读卡器的通信数据。

然后短按按钮，保存嗅探数据并退出Standalone模式。此时，指示灯A闪烁三次并熄灭。

<center>
<table><tr>
<td><img src="/img/3-sniff.gif" style="right: 10px;"></td>
<td><img src="/img/4-save.gif" ></td>
</tr></table>
</center>

至此嗅探数据已经保存到了Flash，后续掉电也不会丢失。

## 获取嗅探数据
下面我们读取嗅探到的数据。将PM3连接到PC，并打开客户端。
执行`mem spiffs tree`,便可以看到保存在Flash中的嗅探数据。
```
[usb] pm3 --> mem spiffs tree
[=] --- Flash Memory tree (SPIFFS) -----------------

[#] [0008]       10252 B |-- hf_14asniff.trace
```

执行`mem spiffs dump -s hf_14asniff.trace`下载到本地。
```
[usb] pm3 --> mem spiffs dump -s hf_14asniff.trace
[=] downloading 10252 bytes from `hf_14asniff.trace` (spiffs)
[+] saved 10252 bytes to binary file hf_14asniff.trace
```

执行`trace load -f hf_14asniff.trace`，加载嗅探数据。
```
[usb] pm3 --> trace load -f hf_14asniff.trace
[+] loaded 10252 bytes from binary file hf_14asniff.trace
[+] Recorded Activity (TraceLen = 10252 bytes)
```

执行`trace list -t 14a -1`，便可以查看如下所示的嗅探结果。
```
[usb] pm3 --> trace list -t 14a -1
[+] Recorded activity (trace len = 10252 bytes)
[=] start = start of start frame end = end of frame. src = source of transfer
[=] ISO14443A - all times are in carrier periods (1/13.56MHz)

      Start |        End | Src | Data (! denotes parity error)                                           | CRC | Annotation
------------+------------+-----+-------------------------------------------------------------------------+-----+--------------------
          0 |        992 | Rdr |52(7)                                                                    |     | WUPA
      79744 |      80736 | Rdr |52(7)                                                                    |     | WUPA
...省略
  775064448 |  775065504 | Rdr |26(7)                                                                    |     | REQA
  775066676 |  775069044 | Tag |04  00                                                                   |     |
  775095920 |  775098384 | Rdr |93  20                                                                   |     | ANTICOLL
  775099556 |  775105380 | Tag |c1  f0  6a  3e  65                                                       |     |
  775133776 |  775144304 | Rdr |93  70  c1  f0  6a  3e  65  aa  80                                       |  ok | SELECT_UID
  775145492 |  775149012 | Tag |28  b4  fc                                                               |     |
  775172288 |  775177056 | Rdr |e0  81  b8  62                                                           |  ok | RATS
  775189252 |  775210116 | Tag |10  78  80  a0  02  20  90  00  00  00  00  00  c1  f0  6a  3e  85  43   |  ok |
  775242416 |  775255184 | Rdr |0a  01  00  a4  00  00  02  3f  00  bf  eb                               |  ok |
  775284852 |  775318388 | Tag |0a  01  6f  15  84  0e  31  50  41  59  2e  53  59  53  2e  44  44  46   |     |
            |            |     |30  31  a5  03  08  01  01  90  00  b2  6b                               |  ok |
  775347872 |  775374464 | Rdr |0b  01  00  a4  04  00  0e  4e  43  2e  65  43  61  72  64  2e  44  44   |     |
            |            |     |46  30  31  a7  8b                                                       |  ok |
  775432804 |  775432804 | Tag |0b  01  6f  37  84  0e  4e  43  2e  65  43  61  72  64  2e  44  44  46   |     |
            |            |     |30  31  a5  25  9f  08  01  02  9f  0c  1e  6e  65  77  63  61  70  65   |     |
            |            |     |63  00  05  aa  00  00  01  88  0a  10  00  1a  34  00  00  00  00  00   |     |
            |            |     |00  00  00  f8  6f  90  00  d7  28                                       |  ok |
  775539856 |  775550320 | Rdr |0a  01  00  b0  95  00  1e  fc  42                                       |  ok |
  775572820 |  775614420 | Tag |0a  01  6e  65  77  63  61  70  65  63  00  05  aa  00  00  01  88  0a   |     |
            |            |     |10  00  1a  34  00  00  00  00  00  00  00  00  f8  6f  90  00  b7  86   |  ok |
...省略
```
需要注意的是，嗅探不是100%可靠稳定的，有时候嗅探数据并不完整或者有错误，需要我们多试几次。
# 万事俱备
至此，已经可以嗅探并查看读卡器与卡片的交互数据，所有的准备工作已经完成。下一篇，将抓取与门禁的数据，并继续工卡的分析。