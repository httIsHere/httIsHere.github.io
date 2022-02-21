---
title: 「大前端」at rule & qualified rule
urlname: xcwk53
date: '2021-03-24 14:55:19 +0800'
tags:
  - css
categories:
  - CSS/Less
---

## at-rule

- [@charset ](/charset) ： [https://www.w3.org/TR/css-syntax-3/](https://www.w3.org/TR/css-syntax-3/)
- [@import ](/import) ： [https://www.w3.org/TR/css-cascade-4/](https://www.w3.org/TR/css-cascade-4/)
- [@media ](/media) ： [https://www.w3.org/TR/css3-conditional/](https://www.w3.org/TR/css3-conditional/)
- [@page ](/page) ： [https://www.w3.org/TR/css-page-3/](https://www.w3.org/TR/css-page-3/)
- [@counter-style ](/counter-style) ： [https://www.w3.org/TR/css-counter-styles-3](https://www.w3.org/TR/css-counter-styles-3)
- [@keyframes ](/keyframes) ： [https://www.w3.org/TR/css-animations-1/](https://www.w3.org/TR/css-animations-1/)
- [@fontface ](/fontface) ： [https://www.w3.org/TR/css-fonts-3/](https://www.w3.org/TR/css-fonts-3/)
- [@supports ](/supports) ： [https://www.w3.org/TR/css3-conditional/](https://www.w3.org/TR/css3-conditional/)
- [@namespace ](/namespace) ： [https://www.w3.org/TR/css-namespaces-3/](https://www.w3.org/TR/css-namespaces-3/)

### [@charset ](/charset)

> [@charset ](/charset) 用于提示 CSS 文件使用的字符编码方式，它如果被使用，必须出现在最前面。这个规则只在给出语法解析阶段前使用，并不影响页面上的展示效果。

```css
@charset "utf-8";
```

### [@import ](/import)

> [@import ](/import) 用于引入一个 CSS 文件，除了 [@charset ](/charset) 规则不会被引入，[@import ](/import) 可以引入另一个文件的全部内容。

```css
@import "mystyle.css";
@import url("mystyle.css");

@import [ <url> | <string> ] [ supports(
    [ <supports-condition> | <declaration> ]
  ) ]? <media-query-list>?;
```

### [@media ](/media)

> [@media ](/media) 就是大名鼎鼎的 media query 使用的规则了，它能够对设备的类型进行一些判断。在 media 的区块内，是普通规则列表。

```css
@media print {
  body {
    font-size: 10pt;
  }
}
```

### [@page ](/page)

> [@page ](/page) 用于分页媒体访问网页时的表现设置，页面是一种特殊的盒模型结构，除了页面本身，还可以设置它周围的盒。

```css
@page {
  size: 8.5in 11in;
  margin: 10%;
  @top-left {
    content: "Hamlet";
  }
  @top-right {
    content: "Page " counter(page);
  }
}
```

### [@counter-style ](/counter-style)

> counter-style 产生一种数据，用于定义列表项的表现。_目前只有 Firefox 支持_。

```css
@counter-style triangle {
  system: cyclic;
  symbols: ‣;
  suffix: " ";
}
li {
  list-style: triangle;
}
```

### [@key-frames ](/key-frames)

> [@keyframes ](/keyframes) 产生一种数据，用于定义动画关键帧。

```css
@keyframes diagonal-slide {
  from {
    left: 0;
    top: 0;
  }
  to {
    left: 100px;
    top: 100px;
  }
}
```

### [@fontface ](/fontface)

> [@fontface ](/fontface) 用于定义一种字体，icon font 技术就是利用这个特性来实现的。

```css
@font-face {
  font-family: Gentium;
  src: url(http://example.com/fonts/Gentium.woff);
}
p {
  font-family: Gentium, serif;
}
```

### [@support ](/support)

> support 检查环境的特性，它与 media 比较类似。

### @namespace

> 用于跟 XML 命名空间配合的一个规则，表示内部的 CSS 选择器全都带上特定命名空间。

### @viewport

> 用于设置视口的一些特性，不过兼容性目前不是很好，多数时候被 HTML 的 meta 代替。

## qualified rule

主要是由选择器和声明区块构成。声明区块又由属性和值构成。普通规则：

- 选择器
- 声明列表
  - 属性
  - 值
    - 值的类型
    - 函数

### 选择器

任何选择器，都是由几个符号结构连接的：空格、大于号、加号、波浪线、双竖线（空格，即为后代选择器的优先级较低）。
![](https://cdn.nlark.com/yuque/0/2021/png/250093/1616577961595-6e6e5814-08bb-42c8-b8c0-b130511a8883.png#height=404&id=hLLxP&originHeight=404&originWidth=410&originalType=binary∶=1&size=0&status=done&style=none&width=410)
![](https://cdn.nlark.com/yuque/0/2021/png/250093/1616577961646-8738dc24-798c-414c-a44c-b0a582c3ba35.png#height=562&id=cUl11&originHeight=562&originWidth=960&originalType=binary∶=1&size=0&status=done&style=none&width=960)

### 声明：属性和值

> 声明部分是一个由“属性: 值”组成的序列。属性是由中划线、下划线、字母等组成的标识符，CSS 还支持使用反斜杠转义。需要注意的是：属性不允许使用连续的两个中划线开头，这样的属性会被认为是 CSS 变量。

```css
:root {
  --main-color: #06c;
  --accent-color: #006;
}
/* The rest of the CSS file */
#foo h1 {
  color: var(--main-color);
}
```

其中属性值是以下类型：

- CSS 范围的关键字：initial，unset，inherit，任何属性都可以的关键字。
- 字符串：比如 content 属性。
- URL：使用 url() 函数的 URL 值。
- 整数 / 实数：比如 flex 属性。
- 维度：单位的整数 / 实数，比如 width 属性。
- 百分比：大部分维度都支持。
- 颜色：比如 background-color 属性。
- 图片：比如 background-image 属性。
- 2D 位置：比如 background-position 属性。
- 函数：来自函数的值，比如 transform 属性。

计算型函数：

- calc()：是基本的表达式计算，它支持加减乘除四则运算。在针对维度进行计算时，该函数允许不同单位混合运算。

```css
section {
  float: left;
  margin: 1em;
  border: solid 1px;
  width: calc(100% / 3 - 2 * 1em - 2 * 1px);
}
```

- max()
- min()
- clamp()
  ：max()、min() 和 clamp() 则是一些比较大小的函数，max() 表示取两数中较大的一个，min() 表示取两数之中较小的一个，clamp() 则是给一个值限定一个范围，超出范围外则使用范围的最大或者最小值。
- toggle()：在规则选中多于一个元素时生效，它会在几个值之间来回切换，比如我们要让一个列表项的样式圆点和方点间隔出现。

```css
ul {
  list-style-type: toggle(circle, square);
}
```

- attr()：允许 CSS 接受属性值的控制。
