---
title: 重看css 01
date: 2020-01-12 14:57:23
tags:
  - "css"
categories:
  - "css"
---

直到前天同事的技术分享，我才突然觉得我好像并不懂 css，只会实现，不会就 Google，但是从来没有去真正的了解过其中的原理，惭愧。

所以重看 css 和 js 都是必须要做的事。

#### x (baseline)

我之前一直没有了解过的"x"，在各种内联模型中，涉及排版或者对齐时都需要用到基线（baseline），比如`line-light`行高的定义就是两基线的间距，`vertical-align`的默认值就是基线。
那么最普遍的就是字母基线（`x`的下边缘线）：

![](https://image.zhangxinxu.com/image/blog/201506/2015-06-28_105734.png)

![](https://image.zhangxinxu.com/image/blog/201506/410px-Typography_Line_Terms.svg.png)

- x-height: 小写 x 字母的高度
- ascender height: 上下线高度
- cap height: 大写字母高度
- median: 中线
- descender height: 下行线高度

在 css 内`vertical-align: middle`就与`x-height`有关，其中 middle 与上述 median 并不同，在规范中对`middle`的解释：

> _middle_: This identifies a baseline that is offset from the alphabetic baseline in the shift-direction by 1/2 the value of the x-height font characteristic. The position of this baseline may be obtained from the font data or, for fonts that have a font characteristic for “x-height”, it may be computed using 1/2 the “x-height”. Lacking either of these pieces of information, the position of this baseline may be approximated by the “central” baseline.

middle 指的是基线往上 1/2 "x-height"高度。可以近似看做字母 x 交叉点那个位置。
所以`vertical-align: middle`并不是绝对的垂直居中对齐。

css 内的`ex`单位：一个相对单位，指小写字母 x 的高度。
实用：借助`ex`实现 icon 上下垂直居中的效果（必须为内联元素），优点在于不受字体字号影响。

```
.icon-arrow {
    display: inline-block;
    width: 20px;
    height: 1ex;
    background: url(arrow.png) no-repeat center;
}
```

![](https://image.zhangxinxu.com/image/blog/201506/2015-06-28_143139.png)

参考：[字母’x’在 CSS 世界中的角色和故事](https://www.zhangxinxu.com/wordpress/2015/06/about-letter-x-of-css/)

#### border

_border-color_: 如果设置 border 宽度为 Xpx，那么可以在 border 上适应 X 种颜色，每种颜色显示 1px 的宽度。如果说你的 border 的宽度是 10 个像素，但是只声明了 5 或 6 种颜色，那么最后一个颜色将被添加到剩下的宽度。

_border-radius_：左上角水平圆角半径大小 右上角水平圆角半径大小 右下角水平圆角半径大小 左下角水平圆角半径大小/左上角垂直圆角半径大小 右上角垂直圆角半径大小 右下角垂直圆角半径大小 左下角垂直圆角半径大小。
如果忽略垂直圆角值，则等于水平圆角值即此时圆角为 1/4 圆，水平/垂直半径有一个小于等于 0，则这个角是矩形不会是圆的。

![](https://image.zhangxinxu.com/image/blog/201511/2015-11-01_191017-highlight.png)

_border-image_：< image > < number > < percentage >

[ stretch | repeat | round ]：拉伸 | 重复 | 平铺 (其中 stretch 是默认值)。

图片裁剪位置< number >：无单位，默认单位 px，支持百分比。
在设置`border-image`时实际是将图片进行裁剪形成九个分离区域，然后进行边角设置。

![](http://image.zhangxinxu.com/image/blog/201001/jiugong.gif)

即有了 border-top-image , border-right-image , border-bottom-image , border-left-image, border-top-left-image , border-top-right-image , border-bottom-left-image , border-bottom-right-image 以及中间内容区域。

比如当前边框背景图资源为 81px\*81px。

```css
// 边框平铺
div {
  border: 20px solid transparent;
  width: 300px;
  -moz-border-image: url(/i/border.png) 27 round; /* Old Firefox */
  -webkit-border-image: url(/i/border.png) 27 round; /* Safari and Chrome */
  -o-border-image: url(/i/border.png) 27 round; /* Opera */
  border-image: url(/i/border.png) 27 round;
}
```

![](http://image.zhangxinxu.com/image/blog/201001/2010-01-08_164725.png)

```css
// 边框拉伸
div {
  border: 20px solid transparent;
  width: 300px;
  -moz-border-image: url(/i/border.png) 27 stretch; /* Old Firefox */
  -webkit-border-image: url(/i/border.png) 27 stretch; /* Safari and Chrome */
  -o-border-image: url(/i/border.png) 27 stretch; /* Opera */
  border-image: url(/i/border.png) 27 stretch;
}
```

![](http://image.zhangxinxu.com/image/blog/201001/2010-01-08_140351.png)

```css
// 边框重复
div {
  border: 20px solid transparent;
  width: 300px;
  -moz-border-image: url(/i/border.png) 27 repeat; /* Old Firefox */
  -webkit-border-image: url(/i/border.png) 27 repeat; /* Safari and Chrome */
  -o-border-image: url(/i/border.png) 27 repeat; /* Opera */
  border-image: url(/i/border.png) 27 repeat;
}
```

![](https://image.zhangxinxu.com/image/blog/201001/2010-01-08_170850.png)

round 会压缩（或伸展）图片大小使其正好在区域内显示，而 repeat 是不管三七二十一直接重复的，而且是居中重复。

边框图片被切割成 9 部分，以一一对应的关系放到 div 边框的九宫格中，然后再压缩（或拉伸）至边框（border-width 或 border-image-width）的宽度大小。

设置`border-image-width`：优先以边框图片宽度。

```css
div {
  border-image: url(/i/border.png) 27/10px stretch;
}
```

#### Text effects

_text-stroke_：文字描边属性，宽度+颜色，目前只能实现描边，也无法指定是外描边，内描边还是居中描边，目前指的是剧中描边。

本质上让真实文本的字重削弱了，例如文字在页面上渲染时候，线条粗细大概是 1 像素，这时候我们设置个 1 像素宽的描边，则真实显示粗细岂不是只剩下 0.5 像素，如果真是这样，我们其实可以模拟 font-weight 属性的不同字重效果。但是对于某些字体，由于字重的缺失，font-weight:100 和 font-weight:400 粗细都是一样的，都是正常粗细。

![](https://image.zhangxinxu.com/image/blog/201706/2017-06-04_175554.png)

实现外描边可以使用`text-shadow`：

```css
.strok-outside {
  text-shadow: 0 1px red, 1px 0 red, -1px 0 red, 0 -1px red;
}
```

![](https://image.zhangxinxu.com/image/blog/201706/2017-06-04_205440.png)

多重描边：

`text-shadow` 属性值可以不断累加，但是 `text-stroke` 属性却不行，如果想要实现多重描边效果，可以借助伪元素多层叠加模拟。

```html
<p data-text="多重描边">多重描边</p>
```

```css
p {
  -webkit-text-stroke: 1px #fff;
  font-size: 40px;
  position: relative;
  z-index: 0;
}
p::before,
p::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  z-index: -1;
}
p::before {
  -webkit-text-stroke: 7px yellow;
}
p::after {
  -webkit-text-stroke: 4px red;
}
```

![](https://image.zhangxinxu.com/image/blog/201706/2017-06-04_211947.png)

_text-fill-color_：文字颜色填充，实现效果基本与`color`一致，目前仅`webkit`核心浏览器下支持该属性，会覆盖`color`属性，主要可实现渐变字体和镂空字体。

渐变字体：

```html
<p class="font1">渐变色字体</p>
```

```css
.font1 {
  font-size: 22px;
  background-image: -webkit-linear-gradient(
    bottom,
    rgb(201, 21, 134),
    rgb(20, 11, 255)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

![](https://upload-images.jianshu.io/upload_images/6080416-d411cc5334e83b22.PNG?imageMogr2/auto-orient/strip|imageView2/2/w/135/format/webp)

镂空字体（配合`text-stroke`）：

```html
<p class="font1">我的镂空字体</p>
```

```css
.font1 {
  font-size: 32px;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1px #000;
}
```

![](https://upload-images.jianshu.io/upload_images/6080416-57515b6a4b0c68f4.PNG?imageMogr2/auto-orient/strip|imageView2/2/w/245/format/webp)

_word-wrap_：文字换行。

经常在渲染文本时由于连续英文字符串过长导致文本溢出（比如 url 链接等），此时可对文本设置强制边界换行。

```css
.word_wrap {
  word-wrap: break-word;
}
```
![](http://image.zhangxinxu.com/image/web/css3/2010-03-08_012239.png)

参考：[张鑫旭大神博客](https://www.zhangxinxu.com/)