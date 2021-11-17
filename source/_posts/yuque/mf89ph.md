---
title: 'no such file or directory, scandir ''...\node_modules\node-sass\vendor'
urlname: mf89ph
date: '2020-03-27 17:02:39 +0800'
tags:
  - sass
  - error
categories:
  - error
---

在编译的时候突然出现这个问题。
解决：
重新 bulid node sass。

```bash
npm rebuild node-sass
```

2020.04.19

拉取到 hexo 博客内时，报错：
incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line at line 4, column 14:
   title: ENOENT: no such file or directory, sca ...

因为标题内存在英文':'。
