---
title: linux文件及目录权限笔记
date: 2015-01-04 14:44:36
categories:
- linux
tags:
- bash
- linux
---
# 文件权限
权限分三种，读（r）写（w）可执行（x）。“r--”、“rw-”、“rwx”这三种权限组合没什么好说的。“r--”只读，“rw-”可读可写，“rwx”可读可写可执行，下面介绍几种比较另类权限组合。
<!-- more -->
## __-w-、-wx：__
只写权限，只能写入不能读取。
```bash
-rw-rw--w- 1 root root    5 Jan  4 12:00 testfile
/tmp$ cat testfile
cat: testfile: Permission denied
/tmp$ echo "write-test">testfile
/tmp$ su root
Password: 
root@axisray:/tmp# cat testfile 
write-test
```

## __--x、-wx：__
虽然有执行权限，但是由于没有读权限，连文件内容都不知道谈何执行呢？
```bash
-rw-rw---x  1 root root   26 Jan  4 12:53 testfile*
/tmp$ ./testfile 
/bin/bash: ./testfile: Permission denied
/tmp$ su root
Password: 
root@axisray:/tmp# chmod o=rx testfile
root@axisray:/tmp$ ll | grep testfile
-rw-rw-r-x  1 root root   26 Jan  4 12:53 testfile*
root@axisray:/tmp# su ray
/tmp$ ./testfile 
hello!
```

# 目录权限
目录权限的关键在于可执行权限（x），下面逐个说明

## r--、rw-、-w-：
无可执行
drwxr-xr-- 4 root root 4096 Jan  4 11:53 test/

cd命令需要可执行（x）权限，因此无法通过cd命令切换到该目录下
```bash
/tmp$ cd test/
bash: cd: test/: Permission denied
```

子目录也是不可切换的，即便对子目录有完整权限
```bash
/tmp$ cd test/test-dir1/
bash: cd: test/test-dir1/: Permission denied
```

同样对于cat命令，由于缺少可执行（x）权限，该目录下的文件也是不可读的。
```bash
/tmp$ cat test/test-file2
cat: test/test-file2: Permission denied
```

cp命令也是不可以的
```bash
/tmp$ cp test/test-file2 ./
cp: cannot stat ‘test/test-file2’: Permission denied
```

若该目录权限为rw-或-w-即有写入权限，由于缺少可执行（x）权限，也无法用mkdir等命令创建文件或目录
```bash
/tmp$ mkdir test/testdir
mkdir: cannot create directory ‘test/testdir’: Permission denied
/tmp$ cp testfile ./test/
cp: cannot stat ‘./test/testfile’: Permission denied
```
同样即使该目录下的文件可读可执行，也无法执行该目录下的文件
```bash
/tmp$ ./test/test-file2
bash: ./test/test-file2: Permission denied
```

ll命令虽然可以列出该目录下的文件及目录，但是同样因为可执行（x）权限无法查看属性
```bash
/tmp$ ll test
ls: cannot access test/..: Permission denied
ls: cannot access test/.: Permission denied
ls: cannot access test/test-file2: Permission denied
ls: cannot access test/test-dir2: Permission denied
ls: cannot access test/test-dir1: Permission denied
ls: cannot access test/test-file1: Permission denied
total 0
d????????? ? ? ? ?            ? ./
d????????? ? ? ? ?            ? ../
d????????? ? ? ? ?            ? test-dir1/
d????????? ? ? ? ?            ? test-dir2/
-????????? ? ? ? ?            ? test-file1
-????????? ? ? ? ?            ? test-file2
```

对子目录来说，无法列出文件及目录，即便有完整权限
```bash
/tmp$ ll test/test-dir1/
ls: cannot access test/test-dir1/: Permission denied
```

## --x、-wx、rwx、r-x：
有可执行权限
drwxr-x--x  4 root root 4096 Jan  4 13:15 test/

使用cp命令可以正常切换至该目录
```bash
/tmp$ cd test/
/tmp/test$ 
```

但是无法使用ll列出该目录下的文件及目录，因为没有读权限（r）
```bash
/tmp/test$ ll
ls: cannot open directory .: Permission denied
```

子目录不受影响，只要有相应权限
```bash
/tmp/test$ ll test-dir1
total 12
drwxr-xrwx 2 root root 4096 Jan  4 13:27 ./
drwxr-x--x 4 root root 4096 Jan  4 13:15 ../
-rw-r--r-- 1 root root    9 Jan  4 13:27 test-file3
```

可使用cat查看目录下的文件，只要有相应文件的读权限
```bash
/tmp/test$ cat test-file2
#!/bin/bash
echo "hello!"
```

也可以使用cp拷贝该目录下的文件，只要有相应文件的读权限
```bash
/tmp/test$ cp test-file2 ../
/tmp/test$ cd ..
/tmp$ ll | grep test-file
-rw-r--r-x  1 ray  ray    26 Jan  4 13:43 test-file2*
```

也可以执行该目录下的文件，只要有相应文件的读和可执行权限
```bash
/tmp$ ./test/test-file2
hello!
```

如果该目录权限为-wx或rwx即有写入权限
我们就可以用mkdir、cp等命令在该目录创建子目录或文件
```bash
/tmp$ mkdir test/testdir
/tmp$ cp testfile test/
/tmp$ su root
Password: 
root@axisray:/tmp# ll test/
total 24
drwxrwxr-x 2 ray  ray  4096 Jan  4 14:29 testdir/
drwxr-xrwx 2 root root 4096 Jan  4 13:27 test-dir1/
drwxr-xrw- 2 root root 4096 Jan  4 13:15 test-dir2/
-rw-rw-r-x 1 ray  ray    26 Jan  4 14:29 testfile*
-rw-r----- 1 root root   11 Jan  4 13:15 test-file1
-rw-r--r-x 1 root root   26 Jan  4 13:15 test-file2*
```

如果该目录权限为r-x或rwx即有读取权限
我们可以用ll列出当前目录的子目录及文件
```bash
root@axisray:/tmp# chmod o=rx test
root@axisray:/tmp# su ray
/tmp$ ll test
total 32
drwxr-xr-x 5 root root 4096 Jan  4 14:29 ./
drwxrwxrwt 4 root root 4096 Jan  4 14:42 ../
drwxrwxr-x 2 ray  ray  4096 Jan  4 14:29 testdir/
drwxr-xrwx 2 root root 4096 Jan  4 13:27 test-dir1/
drwxr-xrw- 2 root root 4096 Jan  4 13:15 test-dir2/
-rw-rw-r-x 1 ray  ray    26 Jan  4 14:29 testfile*
-rw-r----- 1 root root   11 Jan  4 13:15 test-file1
-rw-r--r-x 1 root root   26 Jan  4 13:15 test-file2*
```

# 总结
* 对于文件权限，**可读权限（r）**是**可执行（x）**的基础
* 对于目录权限，可执行（x）权限是关键，没有可执行权限意味着所有命令都不能在该目录及子目录下执行，该目录及子目录下的文件也不能被执行。这意味着我们常用的命令cd、ls、mkdir、cp、mv、rm等等在该目录下全部失效