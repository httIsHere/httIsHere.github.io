---
title: Less 记录
urlname: wi7qsa
date: '2020-04-13 15:22:33 +0800'
tags: []
categories: []
---

![](https://cdn.nlark.com/yuque/0/2020/png/250093/1586762618421-4b4d86d0-4c18-444e-97be-73a9ff5fc5a2.png#align=left&display=inline&height=81&margin=%5Bobject%20Object%5D&originHeight=81&originWidth=199&size=0&status=done&style=none&width=199)

> 特性：变量、Mixin、函数。

1. 循环类名

```less
// 定义循环函数
.part-title-loop(@n, @i: 0) when (@i < @n) {
  .part-title-@{i} {
    background: url(".../trial-part-title_@{i}.png");
    background-size: 100% 100%;
  }
  .part-title-loop(@i+1);
}
.part-box {
  padding: 0 0.64rem;
  .part-title {
    width: 12.16rem;
    height: 1.365rem;
    margin: 0 auto 1.344rem;
  }
  // 调用循环函数
  .part-title-loop(8);
}
```

2. 使用兄弟选择器时如果采用嵌套写法可能会有问题，所以最好写在外层。

|     |     |
| --- | --- |
|     |     |
|     |     |
