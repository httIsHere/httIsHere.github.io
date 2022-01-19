---
title: 「ROAD 6」CSS-排版
urlname: vzq7do
date: '2021-12-14 10:52:57 +0800'
tags:
  - ROAD 6
categories:
  - 大前端
---

### 盒（Box）

源代码：标签（tag），语义：元素（Element），表现：盒（Box）。
**排版和渲染的基本单位是盒。**

#### 盒模型

![](https://gitee.com/httishere/blog-image/raw/master/img/WechatIMG1084.png#id=u0xtd&originHeight=468&originWidth=704&originalType=binary∶=1&status=done&style=none)

##### `box-sizing`

- Content-box
- Border-box

### 正常流

> 从左到右；
> 同一行写的文字都是对齐的；
> 一行写满了，就换行道下一行；

- 收集盒进行
- 计算盒在行中的排布
- 计算行的排布

![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-12-13_10-47-21.jpg#id=MRvHg&originHeight=188&originWidth=658&originalType=binary∶=1&status=done&style=none)

![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-12-13_10-50-08.jpg#id=zqkBe&originHeight=464&originWidth=422&originalType=binary∶=1&status=done&style=none)（BFC， block formatting context )

#### 行模型

##### baseline

![](https://gitee.com/httishere/blog-image/raw/master/img/20211213110129.png#id=twFZm&originHeight=262&originWidth=696&originalType=binary∶=1&status=done&style=none)

#### float & clear

![](https://gitee.com/httishere/blog-image/raw/master/img/20211213162357.png#id=QfPuf&originHeight=644&originWidth=2876&originalType=binary∶=1&status=done&style=none)

```html
float:
<div style="float: right; width: 100px; height: 100px; background: pink;"></div>
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
float:
<div style="float: right; width: 100px; height: 100px; background: pink;"></div>
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
float:
<div style="float: right; width: 100px; height: 100px; background: pink;"></div>
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
float:
<div style="float: right; width: 100px; height: 100px; background: pink;"></div>
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字
```

当高度不够**绕环**的时候，所有 float 右的元素可能会产生冲突。

所以此时需要一个`clear`属性。

给所有 float 元素均加上 clear 属性，则遇到相冲突的 float 元素时会发生自动换行。

![](https://gitee.com/httishere/blog-image/raw/master/img/20211213162627.png#id=dCgPV&originHeight=870&originWidth=2870&originalType=binary∶=1&status=done&style=none)

#### margin 折叠

同一个 BFC 内垂直方向上可能会产生 margin 折叠。

产生一个单独的 BFC（能**容纳一个正常流**）：

- `overflow: hidden`等非`visible`；
- `display: inline-block | table-cell | table-caption`；
- `flex item`，它一定是 block container；

只要一个 BFC 里面是正常流，外面也是正常流，且该 BFC 的 overflow 是 visible，那么该 BFC 也会和外面的块级元素发生折叠。

**block container 只有**`**block**`**和**`**inline-block**`**。**

让这个折叠现象去除，我们可以让发生折叠的地方**建立独立的 BFC**。

总结发生 margin 折叠的场景：

- 这些 margin 都处于普通流中，并在同一个 BFC 中；
- 这些 margin 没有被非空内容、padding、border 或 clear 分隔开；
- 这些 margin 在垂直方向上是相邻的；

当相邻的两个 margin 都是正值的时候，取两者的最大值；当 margin 都是负值的时候，取的是其中绝对值较大的。
