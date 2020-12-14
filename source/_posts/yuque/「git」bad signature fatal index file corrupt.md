---
title: 「git」bad signature fatal index file corrupt
urlname: gx5dy7
date: 2020-03-26 11:20:14 +0800
tags: []
categories: []
---

tags: [git, error]
categories: [error]
cover:

---

<!-- more -->

在 commit 过程中，电脑突然蓝屏，之后开机打开电脑 sourcetree 就出现了这个报错问题。

**原因**：

因为 git 在更新操作的时候会更新.git 文件夹下的 index 文件，方便下一次更新的时候会找到更新的节点，而电脑突然崩溃，这个文件可能只更新了一部分，甚至直接导致这个文件破坏，所以再次更新的时候，发现这个 index 文件信息不全或者文件无法读取。

**解决办法：**

```bash
$ rm -f .git/index    // 删除文件index，也可以手动删除
$ git reset       //这个是git命名可以恢复指定的版本号，这里没有就默认恢复上一次正确的文件
```

[原文章参考](https://blog.csdn.net/hy_coming/article/details/84099105)
