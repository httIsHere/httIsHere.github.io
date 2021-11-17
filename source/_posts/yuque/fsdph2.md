---
title: 「CSS」外边距重叠以及解决方案
urlname: fsdph2
date: '2021-01-05 16:30:50 +0800'
tags:
  - css
categories:
  - css/Less
---

> **边距折叠**：块的上外边距(margin-top)和下外边距(margin-bottom)有时合并(折叠)为单个边距，其大小为单个边距的最大值(或如果它们相等，则仅为其中一个)。

####

### 发生 margin 重叠场景

#### 1. 两个相邻元素的下边距和上边距

```html
<style>
  p:nth-child(1) {
    margin-bottom: 20px;
  }
  p:nth-child(2) {
    margin-top: 30px;
  }
</style>

<p>下边界范围会...</p>
<p>...会跟这个元素的上边界范围重叠。</p>
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1609837737634-ef4f99a2-e1b8-4521-9cf5-c0aefd5a510f.png#align=left&display=inline&height=455&margin=%5Bobject%20Object%5D&name=image.png&originHeight=994&originWidth=780&size=64587&status=done&style=none&width=357)->![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1609837899326-43cca7f6-3e98-40b8-b6b8-083344f2a2d2.png#align=left&display=inline&height=454&margin=%5Bobject%20Object%5D&name=image.png&originHeight=944&originWidth=770&size=55460&status=done&style=none&width=370)

#### 2. 父元素与子元素发生边距折叠

```html
<style type="text/css">
  section {
    margin-top: 13px;
    margin-bottom: 87px;
  }

  header {
    margin-top: 87px;
  }

  footer {
    margin-bottom: 13px;
  }
</style>

<section>
  <header>上边界重叠 87</header>
  <main></main>
  <footer>下边界重叠 87 不能再高了</footer>
</section>
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1609839734048-548f3e49-b7c7-404e-97e1-3b88a5693754.png#align=left&display=inline&height=516&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1032&originWidth=628&size=83367&status=done&style=none&width=314)->![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1609839875220-64c769e9-6d1a-4807-ad19-3394a020fa09.png#align=left&display=inline&height=519&margin=%5Bobject%20Object%5D&name=image.png&originHeight=972&originWidth=644&size=96192&status=done&style=none&width=344)

#### 3. 空的块级元素的上下边距

该元素完全没有设定边框 border、内边距 paddng、高度 height、最小高度 min-height 、最大高度 max-height 时可能会发生。

```html
<style>
  p {
    margin: 0;
  }
  div {
    margin-top: 13px;
    margin-bottom: 87px;
  }
</style>

<p>上边界范围是 87 ...</p>
<div></div>
<p>... 上边界范围是 87</p>
```

### PS

- 如果参与折叠的外边距中包含负值，折叠后的外边距的值为最大的正边距与最小的负边距（即绝对值最大的负边距）的和,；也就是说如果有-13px 8px 100px 叠在一起，边界范围的技术就是 100px -13px 的 87px。
- 父元素的外边距是 0，第一个或最后一个子元素的外边距仍然会“溢出”到父元素的外面。
- 如果所有参与折叠的外边距都为负，折叠后的外边距的值为最小的负边距的值。这一规则适用于相邻元素和嵌套元素。

### 解决方法

以上情况的组合会产生复杂的外边距折叠（普通文档流中块框的垂直边界才会发生边界叠加），行内框、浮动框或绝对定位框之间的边界不会叠加。

1. 父元素增加内边距：padding；
1. 增加透明边框：`border: 1px solid transparent;`
1. 增加绝对定位：`position: absolute;`
1. 子元素设置为行内元素或者浮动元素：` float: left; ``display: inline-block; `
1. 父元素超出部分隐藏：`overflow: hidden;`

参考：[外边距重叠 ｜ MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)
