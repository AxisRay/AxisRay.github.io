---
title: 【PM3】重置小米空气净化器滤芯
date: 2021-08-21 09:07:45
categories:
- RFID
tags:
- proxmark3
comment: true
---
# 背景
家里小米空气净化器的滤芯又到期了，然而深圳这边空气质量平时就不错，应该还可以用很久。但是恼人的过期提示令我非常不爽，得想办法干掉这个提示。

根据网上的资料，小米空气净化器2S是依赖滤芯底部的RFID标签计算滤芯寿命的，正好手头有一块RFID的利器-Proxmark3。尝试下能否读取和修改RFID标签中的数据，来实现滤芯寿命的重置。
![滤芯底部的标签](/img/2021-08-21-12-50-41.png)

# 识别标签类型
<!-- more -->
尝试使用`hf search`看下是什么类型的标签。
```
[fpc] pm3 --> hf search
 🕕  Searching for ISO14443-A tag...
[+]  UID: 53 5C 4D EE 02 1F 00
[+] ATQA: 00 44
[+]  SAK: 00 [2]
[+] MANUFACTURER: Shanghai Feiju Microelectronics Co. Ltd. China
[+] TYPE: NTAG 213 144bytes (NT2H1311G0DU)
[+]    MIFARE Ultralight/C/NTAG Compatible
[=] proprietary non iso14443-4 card found, RATS not supported
[?] Hint: try `hf mfu info`


[+] Valid ISO 14443-A tag found
```

如结果所示，这是个NTAG标签，然后按提示执行`hf mfu info`看下进一步的信息
```
[fpc] pm3 --> hf mfu info

[=] --- Tag Information --------------------------
[=] -------------------------------------------------------------
[+]       TYPE: NTAG 213 144bytes (NT2H1311G0DU)
[+]        UID: 53 5C 4D EE 02 1F 00
[+]     UID[0]: 53, Shanghai Feiju Microelectronics Co. Ltd. China
[+]       BCC0: CA (ok)
[+]       BCC1: F3 (ok)
[+]   Internal: 48 (default)
[+]       Lock: 00 00  - 00
[+] OneTimePad: E1 10 12 00  - @B0

[=] --- NDEF Message
[+] Capability Container: E1 10 12 00
[+]   E1: NDEF Magic Number
[+]   10: version 0.1 supported by tag
[+]        : Read access granted without any security / Write access granted without any security
[+]   12: Physical Memory Size: 144 bytes
[+]   12: NDEF Memory Size: 144 bytes
[+]   Additional feature information
[+]   00
[+]   00000000
[+]   xxx      - 00: RFU (ok)
[+]      x     - 00: don't support special frame
[+]       x    - 00: don't support lock block
[+]        xx  - 00: RFU (ok)
[+]          x - 00: IC don't support multiple block reads

[=] --- Tag Counter
[=]        [02]: 00 00 00
[+]             - 00 tearing ( fail )

[=] --- Tag Signature
[=]     Elliptic curve parameters: NID_secp128r1
[=]              TAG IC Signature: 0000000000000000000000000000000000000000000000000000000000000000
[+]        Signature verification ( fail )

[=] --- Tag Version
[=]        Raw bytes: 00 53 04 02 01 00 0F 03
[=]        Vendor ID: 53, Shanghai Feiju Microelectronics Co. Ltd. China
[=]     Product type: 04, NTAG
[=]  Product subtype: 02, 50pF
[=]    Major version: 01
[=]    Minor version: 00
[=]             Size: 0F, (256 <-> 128 bytes)
[=]    Protocol type: 03, ISO14443-3 Compliant
[?] Hint: try `hf mfu pwdgen -r` to get see known pwd gen algo suggestions
[=] ------------------------ Fingerprint -----------------------
[=] Reading tag memory...
[#] Cmd Error: 00
[#] Read block 4 error
[=] ------------------------------------------------------------
```
这个不是NXP官方产的NTAG，应该是国内一家叫做上海飞聚生产的NTAG兼容标签。

从输出结果可以看到，这个标签是有密码的，提示执行`hf mfu pwdgen -r`计算密码。但是我们不用这么麻烦，既然有PM3这种神器，可以直接通过sniff嗅探出NTAG密码。另外实际上我也测试过了，计算出来的密码都不对的。

# 嗅探标签密码
ok，话不多说，执行`hf 14a sniff`进入嗅探模式。不过由于标签在滤芯底部，没有空间把PM3塞进去，直接放在滤芯的桶里就好了，这个距离也是够的。然后把滤芯放回净化器并启动。为了保证效果，可以多试几次。
> 注意，嗅探完成必须要通过按钮终止嗅探，否则PM3会卡死。给开发者提过这个问题，但是答复说是设计如此，是个Feature。

![放在滤芯桶底部](/img/2021-08-21-12-52-34.png)
```
[fpc] pm3 --> hf 14a sniff

[#] Starting to sniff. Press PM3 Button to stop.
[#] trace len = 606
```
可以看到已经嗅探到数据了，执行`trace list -t 14a`看下嗅探的结果
```
[fpc] pm3 --> hf 14a sniff

[#] Starting to sniff. Press PM3 Button to stop.
[#] trace len = 606
[fpc] pm3 --> trace list -t 14a
[=] downloading tracelog data from device
[+] Recorded activity (trace len = 606 bytes)
[=] start = start of start frame end = end of frame. src = source of transfer
[=] ISO14443A - all times are in carrier periods (1/13.56MHz)

      Start |        End | Src | Data (! denotes parity error)                                           | CRC | Annotation
------------+------------+-----+-------------------------------------------------------------------------+-----+--------------------
          0 |       1056 | Rdr |26(7)                                                                    |     | REQA
     419248 |     421712 | Rdr |93  20                                                                   |     | ANTICOLL
     838544 |     849072 | Rdr |93  70  88  53  5c  4d  ca  3a  40                                       |  ok | SELECT_UID
    1284848 |    1287312 | Rdr |95  20                                                                   |     | ANTICOLL-2
    1704144 |    1714672 | Rdr |95  70  ee  02  1f  00  f3  3f  f8                                       |  ok | SELECT_UID-2
    2109856 |    2118080 | Rdr |1b  bc  77  b6  ed  da  5b                                               |  ok | PWD-AUTH KEY: 0xbc77b6ed
    2515568 |    2520272 | Rdr |30  04  26  ee                                                           |  ok | READBLOCK(4)
    2521520 |    2538512 | Rdr |ff! ff! b7! b4! ff! ff! ce! cc! ff! de! fc! fa! ff! f9! 2b!              | !crc|
    2934816 |    2939520 | Rdr |30  05  af  ff                                                           |  ok | READBLOCK(5)
    3354032 |    3358800 | Rdr |30  06  34  cd                                                           |  ok | READBLOCK(6)
.... 省略部分
    3773328 |    3778096 | Rdr |30  07  bd  dc                                                           |  ok | READBLOCK(7)
    4192560 |    4197264 | Rdr |30  08  4a  24                                                           |  ok | READBLOCK(8)
```
啊哈哈，已经可以看到密码了，即`0xbc77b6ed`。同时我们也可以注意到，块（BLOCK）4、5、6、7、8被读取过。

# DUMP标签
下一步先把这几个BLOCK或者将整个标签的数据dump下来。这里我们直接用刚才的密码，执行`hf mfu dump -k bc77b6ed`把整个标签dump下来。
```
[fpc] pm3 --> hf mfu dump -k bc77b6ed
[+] TYPE: NTAG 213 144bytes (NT2H1311G0DU)
[+] Reading tag memory...
[=] MFU dump file information
[=] -------------------------------------------------------------
[=]       Version | 00 53 04 02 01 00 0F 03
[=]         TBD 0 | 00 00
[=]         TBD 1 | 00
[=]     Signature | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
[=]     Counter 0 | 00 00 00
[=]     Tearing 0 | 00
[=]     Counter 1 | 00 00 00
[=]     Tearing 1 | 00
[=]     Counter 2 | 00 00 00
[=]     Tearing 2 | 00
[=] Max data page | 43 (176 bytes)
[=]   Header size | 56
[=] -------------------------------------------------------------
[=] block#   | data        |lck| ascii
[=] ---------+-------------+---+------
[=]   0/0x00 | 53 5C 4D CA |   | S\M.
[=]   1/0x01 | EE 02 1F 00 |   | ....
[=]   2/0x02 | F3 48 00 00 |   | .H..
[=]   3/0x03 | E1 10 12 00 | 0 | ....
[=]   4/0x04 | 00 00 48 4B | 0 | ..HK
[=]   5/0x05 | 00 00 31 33 | 0 | ..13
[=]   6/0x06 | 00 21 03 05 | 0 | .!..
[=]   7/0x07 | 00 06 14 77 | 0 | ...w
[=]   8/0x08 | D6 DD 09 00 | 0 | ....
.... 省略没数据的部分
[=]  40/0x28 | 00 00 00 BD | 0 | ....
[=]  41/0x29 | 04 00 00 04 | 0 | ....
[=]  42/0x2A | C0 05 00 00 | 0 | ....
[=]  43/0x2B | 00 00 00 00 | 0 | ....
[=]  44/0x2C | 00 00 00 00 | 0 | ....
[=] ---------------------------------
[=] Using UID as filename
[+] saved 236 bytes to binary file hf-mfu-535C4DEE021F00-dump.bin
[+] saved to json file hf-mfu-535C4DEE021F00-dump.json
```
dump成功，下一步就简单了， 有几种方式：

1. 把滤芯放回去继续使用。然后用到期后再将这几个BLOCK刷回去，即可把滤芯恢复到保存的时候的状态。
2. 将滤芯回去使用一段时间后，再dump一次，观察哪些BLOCK发生了变化，分析规律或者找个新滤芯对比下。知道算法之后就可以直接将滤芯寿命修改为指定的值了

# 重置滤芯寿命
实际上这里只要把BLOCK 8清空掉就可以重置滤芯。执行`hf mfu wrbl -b 8 -d 00000000 -k bc77b6ed`清除BLOCK 8的数据。
```
[fpc] pm3 --> hf mfu wrbl -b 8 -d 00000000 -k bc77b6ed
[=] Block: 8 (0x08) [ 00 00 00 00 ]
[=] Using pwd BC 77 B6 ED
[+] isOk:01
```
清除完成功，可以把滤芯放回去看下效果。
![100%寿命](/img/2021-08-21-12-49-25.png)
搞定！

