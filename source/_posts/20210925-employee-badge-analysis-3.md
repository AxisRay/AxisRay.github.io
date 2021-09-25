---
title: 【PM3】对公司新工卡的分析记录（三）——数据分析(上)
date: 2021-09-25 13:24:34
categories:
- RFID
tags:
- proxmark3
- JCOP
comment: true
---
# 前情提要
上次说到嗅探工具准备就绪。而在上周，我已经成功的获取并完成了数据的分析。为了分析数据，我这期间啃了几本协议文档，下面就详细回顾下分析过程。

# 嗅探结果
完整的嗅探结果如下所示。
<!-- more -->
```
  131729168 |  131730224 | Rdr |26(7)                                                                    |     | REQA
  131731412 |  131733780 | Tag |04  00                                                                   |     | 
  131748736 |  131751200 | Rdr |93  20                                                                   |     | ANTICOLL
  131752388 |  131758212 | Tag |c1  f0  6a  3e  65                                                       |     | 
  131773664 |  131784192 | Rdr |93  70  c1  f0  6a  3e  65  aa  80                                       |  ok | SELECT_UID
  131785380 |  131788900 | Tag |28  b4  fc                                                               |     | 
  131803088 |  131807856 | Rdr |e0  81  b8  62                                                           |  ok | RATS
  131820036 |  131840900 | Tag |10  78  80  a0  02  20  90  00  00  00  00  00  c1  f0  6a  3e  85  43   |  ok |
  131858480 |  131871248 | Rdr |0a  01  00  a4  00  00  02  3f  00  bf  eb                               |  ok |
  131900900 |  131934436 | Tag |0a  01  6f  15  84  0e  31  50  41  59  2e  53  59  53  2e  44  44  46   |     | 
            |            |     |30  31  a5  03  08  01  01  90  00  b2  6b                               |  ok | 
  131947040 |  131973632 | Rdr |0b  01  00  a4  04  00  0e  4e  43  2e  65  43  61  72  64  2e  44  44   |     |
            |            |     |46  30  31  a7  8b                                                       |  ok |
  132031972 |  132031972 | Tag |0b  01  6f  37  84  0e  4e  43  2e  65  43  61  72  64  2e  44  44  46   |     | 
            |            |     |30  31  a5  25  9f  08  01  02  9f  0c  1e  6e  65  77  63  61  70  65   |     | 
            |            |     |63  00  05  aa  00  00  01  88  0a  10  00  1a  34  00  00  00  00  00   |     | 
            |            |     |00  00  00  f8  6f  90  00  d7  28                                       |  ok | 
  132115200 |  132125664 | Rdr |0a  01  00  b0  95  00  1e  fc  42                                       |  ok |
  132148164 |  132189764 | Tag |0a  01  6e  65  77  63  61  70  65  63  00  05  aa  00  00  01  88  0a   |     | 
            |            |     |10  00  1a  34  00  00  00  00  00  00  00  00  f8  6f  90  00  b7  86   |  ok | 
  132314336 |  132327104 | Rdr |0b  01  00  a4  00  00  02  3f  00  42  a6                               |  ok |
  132353556 |  132387028 | Tag |0b  01  6f  15  84  0e  31  50  41  59  2e  53  59  53  2e  44  44  46   |     | 
            |            |     |30  31  a5  03  08  01  01  90  00  fa  39                               |  ok | 
  132473664 |  132478432 | Rdr |ba  01  37  c8                                                           |  ok |
  132480884 |  132485556 | Tag |ab  01  7e  44                                                           |     | 
  132560176 |  132586832 | Rdr |0a  01  00  a4  04  00  0e  4e  43  2e  65  43  61  72  64  2e  44  44   |     |
            |            |     |46  30  31  cb  bc                                                       |  ok | 
  132645476 |  132645476 | Tag |0a  01  6f  37  84  0e  4e  43  2e  65  43  61  72  64  2e  44  44  46   |     | 
            |            |     |30  31  a5  25  9f  08  01  02  9f  0c  1e  6e  65  77  63  61  70  65   |     | 
            |            |     |63  00  05  aa  00  00  01  88  0a  10  00  1a  34  00  00  00  00  00   |     | 
            |            |     |00  00  00  f8  6f  90  00  6b  5f                                       |  ok | 
  133829600 |  133834304 | Rdr |bb  01  ef  d1                                                           |  ok | 
  133836820 |  133841556 | Tag |aa  01  a6  5d                                                           |     | 
  135185296 |  135190000 | Rdr |bb  01  ef  d1                                                           |  ok | 
  135192516 |  135197252 | Tag |aa  01  a6  5d                                                           |     | 
  136541248 |  136545952 | Rdr |bb  01  ef  d1                                                           |  ok | 
  136548468 |  136553204 | Tag |aa  01  a6  5d                                                           |     | 
  137897200 |  137901904 | Rdr |bb  01  ef  d1                                                           |  ok | 
  137904436 |  137909172 | Tag |aa  01  a6  5d                                                           |     | 
  139253168 |  139257872 | Rdr |bb  01  ef  d1                                                           |  ok | 
  139260388 |  139265124 | Tag |aa  01  a6  5d                                                           |     | 
  140609120 |  140613824 | Rdr |bb  01  ef  d1                                                           |  ok | 
  140616340 |  140621076 | Tag |aa  01  a6  5d                                                           |     | 
  141965072 |  141969776 | Rdr |bb  01  ef  d1                                                           |  ok | 
  141972292 |  141977028 | Tag |aa  01  a6  5d                                                           |     | 
  143321024 |  143325728 | Rdr |bb  01  ef  d1                                                           |  ok | 
  143328244 |  143332980 | Tag |aa  01  a6  5d                                                           |     | 
  143465664 |  143470368 | Rdr |bb  01  ef  d1                                                           |  ok | 
  143472884 |  143476916 | Tag |aa  01  a6  0d                                                           |     | 
```

# 嗅探分析
实际上我嗅探了两次，两次结果完全一致。这已经说明存在一个致命的问题，即没有随机数的存在，这意味着可以用重放的方式骗过门禁。

下面我们继续分析下交互的内容。
# ISO/IEC 14443 - 3
第一部分是常规的ISO/IEC 14443-3 TypeA的激活、选卡的过程
```
  131729168 |  131730224 | Rdr |26(7)                                                                    |     | REQA
  131731412 |  131733780 | Tag |04  00                                                                   |     | 
  131748736 |  131751200 | Rdr |93  20                                                                   |     | ANTICOLL
  131752388 |  131758212 | Tag |c1  f0  6a  3e  65                                                       |     | 
  131773664 |  131784192 | Rdr |93  70  c1  f0  6a  3e  65  aa  80                                       |  ok | SELECT_UID
  131785380 |  131788900 | Tag |28  b4  fc                                                               |     | 
```
读卡器发出REQA（0x26）指令，Tag返回ATQA（0x0004）。
> 根据ISO/IEC 14443协议规范，传输的时候是低位在前。如下表，实际传输时从b1到b16，所以嗅探结果为0400。而实际上的ATQA的值是0004。

<table border="1" >
    <tr>
        <td colspan="8">MSB</td>
        <td colspan="8" align="right" >LSB</td>
    <tr>
    <tr>
        <td>b16</td>
        <td>b15</td>
        <td>b14</td>
        <td>b13</td>
        <td>b12</td>
        <td>b11</td>
        <td>b10</td>
        <td>b9</td>
        <td>b8</td>
        <td>b7</td>
        <td>b6</td>
        <td>b5</td>
        <td>b4</td>
        <td>b3</td>
        <td>b2</td>
        <td>b1</td>
    <tr>
    <tr>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>1</td>
        <td>0</td>
        <td>0</td>
    </tr>
    <tr>
        <td colspan="4" align="center">Each bit RFU</td>
        <td colspan="4" align="center">Proprietary coding</td>
        <td colspan="2" align="center">UID size</td>
        <td colspan="1" align="center">RFU</td>
        <td colspan="5" align="center">Bit frame anticollision</td>
    <tr>
</table>

根据ISO/IEC 14443-3中关于ATQA的格式定义（如上所示），可以得到UID大小类型为0x00，根据对照表（[NXP的文档](https://www.nxp.com/docs/en/application-note/AN10833.pdf)中也有说明），UID长度为4Bytes（含1Byte的BCC校验码）。

而Bit frame anticollision字段，任意一位为1即说明支持防冲突帧，不同的卡这里可能会不同。但是根据NXP的文档，不建议用ATQA来区分卡片类型。因为这里存在冲突风险，当多张卡同时进入读卡器范围时，由于位冲突会导致识别错误。

下一步，读卡器继续发出ANTICOLLISION（0x9320）指令，进入防冲突循环。

<table border="1">
    <tr>
        <td>SEL</td>
        <td>NVB</td>
    <tr>
    <tr>
        <td>93</td>
        <td>20</td>
</table>

0x93代表SEL（LECT）命令（Select cascade level 1），0x20代表NVB（Number of Valid Bits)，即有效位数。其高八位是有效Byte，即总位数除以8的商；低八位是有效Bit，即总位数除以8的模。

这里的总位数是包括SEL和NVB自身，再加上后面的UID的位数。实际上这个命令完整应该是由SEL+NVB+UID1...UIDn+（BCC）组成。但对于读卡器，由于此时还不知道范围内有多少卡片，卡片的UID是多少。所以有效位数后面没有UID，其值只包含SEL和NVB，即NVB=20。意味着所有的卡片都要报上自己的UID。由于我们只有一张卡片，不存在冲突问题。所以卡片直接回复自己的完整UID。

防冲突是标准中最精髓的部分，这里在ISO/IEC 14443标准中有详细解释，不再赘述。

<table border="1">
    <tr>
        <td>SEL</td>
        <td>NVB</td>
        <td colspan="4" align="center">UID</td>
        <td>BCC</td>
        <td colspan="2" align="center">CRC</td>
    <tr>
    <tr>
        <td>93</td>
        <td>70</td>
        <td>C1</td>
        <td>F0</td>
        <td>6A</td>
        <td>3E</td>
        <td>65</td>
        <td>AA</td>
        <td>80</td>
</table>
读卡器获取到没有冲突的完整UID后，便发出SEL命令（0x93）选中这张卡片。此时命令包含
1Byte的SEL、1Byte的NVB、4Bytes的UID再加上1Byte的BCC，共计7Bytes余0Bit。所以NVB为0x70。后面跟上UID和BCC,最后是CRC，组成完整的SELECT命令


<table border="1">
    <tr>
        <td>SAK</td>
        <td colspan="2" align="center">CRC</td>
    <tr>
    <tr>
        <td>28</td>
        <td>B4</td>
        <td>FC</td>
</table>

卡片匹配到自己的UID之后，便以SAK（0x28）应答，查阅标准可知UID已经完整，且此卡支持ISO/IEC 14443-4标准。从[NXP的文档](https://www.nxp.com/docs/en/application-note/AN10833.pdf) 可以查阅到SAK=28(b6=1)是SmartMX with MIFAREClassic 1 K类型的卡片。

至此，ISO/IEC 14443-3部分已经完成。从SAK可以看到卡片是支持ISO/IEC 14443-4协议的，下一篇将开始分析-4协议交互部分。

