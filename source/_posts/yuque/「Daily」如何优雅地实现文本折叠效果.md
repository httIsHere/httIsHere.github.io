---
title: 「Daily」如何优雅地实现文本折叠效果
urlname: gi0z7v
date: 2021-08-06 15:37:08 +0800
tags: [Daily]
categories: [Daily]
---

文本折叠是 UI 以及前端经常会遇见的问题，但它也分好几种场景，最常见的就是单行文本溢出和多行文本溢出：

### 单行文本溢出

```css
.text-hidden {
  width: 200px; /* 限定宽度 */
  overflow: hidden; /* 文字长度超出限定宽度，则隐藏超出的内容 */
  white-space: nowrap; /* 文字在一行显示，不能换行 */
  text-overflow: ellipsis; /*（显示省略符号来代表被修剪的文本 */
}
```

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1628236258330-73109c79-21f2-4aed-9173-7675d31b769d.jpeg#align=left&display=inline&height=108&margin=%5Bobject%20Object%5D&originHeight=108&originWidth=289&size=0&status=done&style=none&width=289)

### 多行文本溢出

```css
.text-hidden2 {
  width: 200px; /* 限定宽度 */
  -webkit-line-clamp: 2; /* 显示的文本的行数, 为了实现该效果，需要结合其他的 WebKit 属性 */
  display: -webkit-box; /* 将对象作为弹性伸缩盒子模型 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  overflow: hidden;
  text-overflow: ellipsis;
}
```

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1628236561327-694c9bfc-c799-4516-ae46-7fff62344edd.jpeg#align=left&display=inline&height=95&margin=%5Bobject%20Object%5D&originHeight=95&originWidth=293&size=0&status=done&style=none&width=293)

### 文本末尾携带操作按钮

> 大部分场景下已上两种方法基本可以满足，但是当文本末尾携带操作按钮时就不好再用已上两种方法实现了。

UI 效果如图：
![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1628237149834-7a732f71-b576-47f2-bcc7-757d1319b2dd.jpeg#align=left&display=inline&height=135&margin=%5Bobject%20Object%5D&originHeight=135&originWidth=434&size=0&status=done&style=none&width=434)
文本交互按钮是处于文末而且与文本行对齐。

#### JS 文本截取

根据每块文本元素的字数进行截取，实现如下：

```javascript
let is_intro_fold = true; // 默认文本折叠
let fold_intro = ""; // 折叠后的文本内容
let fold_index = -1; // 文本截取的位置索引
function foldText() {
  let max_length = 132, // 限制文本字节数
    intro =
      "我是文本我是文本我是文本我是文本我是文本我是文本我是文本我是文本我是文本", //  原始文本
    bytes_count = 0; // 原始文本字节数
  // 计算当前的文本字节数
  for (let i = 0; i < intro.length; i++) {
    let _c = intro.charAt(i);
    bytes_count += /^[\u0000-\u00ff]$/.test(_c) ? 1 : 2;
    if (bytes_count >= max_length && fold_index === -1) {
      fold_index = i - 1;
    }
  }
  if (bytes_count <= max_length || !is_intro_fold) {
    fold_intro = intro;
    return bytes_count <= max_length ? "" : "<em>收起</em>";
  } else if (this.is_intro_fold) {
    let _intro = intro.substring(0, this.fold_index);
    fold_intro = `${_intro}…`;
    return "<em>展开</em>";
  }
}
```

- 优点：可以灵活的控制截取文字长度以及操作按钮控制；
- 缺点：不同字符宽度不同，导致每行实际的字数不相同，无法单纯的使用文字字数去限制溢出；

如：以下两个不同文本内容所产生的不同效果：
![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1628238182417-636d5ae4-4cbf-4eb9-b17c-cc689563e24e.jpeg#align=left&display=inline&height=125&margin=%5Bobject%20Object%5D&originHeight=125&originWidth=435&size=0&status=done&style=none&width=435)
![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1628238430536-955ec13b-1aad-44cb-abcc-a9caf5671333.jpeg#align=left&display=inline&height=134&margin=%5Bobject%20Object%5D&originHeight=134&originWidth=432&size=0&status=done&style=none&width=432)

#### CSS 溢出省略+操作按钮覆盖

将操作按钮背景颜色设置为与文本背景同色，并根据实际场景将文本块用 CSS 设置为溢出省略，再根据定位将操作按钮覆盖在文末的文字上。

```javascript
let is_intro_fold = true; // 默认文本折叠
function foldText() {
  let max_length = 132, // 限制文本字节数
    intro =
      "我是文本我是文本我是文本我是文本我是文本我是文本我是文本我是文本我是文本", //  原始文本
    bytes_count = 0; // 原始文本字节数
  // 计算当前的文本字节数
  for (let i = 0; i < intro.length; i++) {
    let _c = intro.charAt(i);
    bytes_count += /^[\u0000-\u00ff]$/.test(_c) ? 1 : 2;
    if (bytes_count >= max_length && fold_index === -1) {
      fold_index = i - 1;
    }
  }
  if (bytes_count <= max_length || !is_intro_fold) {
    fold_intro = intro;
    return bytes_count <= max_length ? "" : "<em>收起</em>";
  } else if (this.is_intro_fold) {
    fold_intro = intro;
    return "...<em>展开</em>"; // 将省略号和操作按钮结合
  }
}
```

```less
p.fold {
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
// 操作按钮
.action {
  float: right;
  background: #f6f8fa;
  position: absolute;
  right: 0.373333rem;
  bottom: 0.373333rem;
  em {
    color: @primary-blue;
  }
}
```

- 优点：可以满足文本内容占满整行；
- 缺点：容易出现文字被截断的问题；

如：
![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1628239233062-1c2b7465-9212-45fd-9a6b-82ff19c5770a.jpeg#align=left&display=inline&height=129&margin=%5Bobject%20Object%5D&originHeight=129&originWidth=434&size=0&status=done&style=none&width=434)

:::info
**有没有更好的解决方案？?**
:::
