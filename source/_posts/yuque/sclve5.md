---
title: 「大前端」Selector
urlname: sclve5
date: '2021-04-12 10:44:15 +0800'
tags:
  - css
categories:
  - CSS/Less
---

选择器的基本意义是：根据一些特征，选中元素树上的一批元素。

> - 简单选择器：针对某一特征判断是否选中元素。
> - 复合选择器：连续写在一起的简单选择器，针对元素自身特征选择单个元素。
> - 复杂选择器：由“（空格）”“ >”“ ~”“ +”“ ||”等符号连接的复合选择器，根据父元素或者前序元素检查单个元素。
> - 选择器列表：由逗号分隔的复杂选择器，表示“或”的关系。

### 简单选择器

- 类型选择器：根据元素的标签名来选中元素；
- 全体选择器：可以选中任何元素；
- id 选择器：根据特定属性的选择器，"#"后面跟随元素 id 属性值；
- class 选择器：根据特定属性的选择器，"."后面跟随元素 class 属性值；
- 属性选择器
  - [attr]
  - [attr=val]
  - [attr~=val]
  - [attr|=val]
- 伪类选择器
  - 树结构关系伪类选择器
  - 链接与行为伪类选择器
  - 逻辑伪类选择器
  - 其他伪类选择器

#### 类型选择器&全体选择器

```css
div {
}
```

根据一个元素的标签名来选中元素，但是实际上，我们还必须要考虑 HTML 或者 XML 元素的命名空间问题。

比如 svg 元素，实际上在： [http://www.w3.org/2000/svg](http://www.w3.org/2000/svg) 命名空间之下。svg 和 HTML 中都有 a 元素，我们若要想区分选择 svg 中的 a 和 HTML 中的 a，就必须用带命名空间的类型选择器。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>JS Bin</title>
  </head>
  <body>
    <svg
      width="100"
      height="28"
      viewBox="0 0 100 28"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <desc>Example link01 - a link on an ellipse</desc>
      <a xlink:href="http://www.w3.org">
        <text y="100%">name</text>
      </a>
    </svg>
    <br />
    <a href="javascript:void 0;">name</a>
  </body>
</html>
```

```css
@namespace svg url(http://www.w3.org/2000/svg);
@namespace html url(http://www.w3.org/1999/xhtml);
svg|a {
  stroke: blue;
  stroke-width: 1;
}

html|a {
  font-size: 40px;
}
```

#### id 选择器&class 选择器

id 选择器和 class 选择器都是针对特定属性的选择器。id 选择器是“#”号后面跟随 id 名，class 选择器是“.”后面跟随 class 名。

```css
.my_class {
}
.my_id {
}
```

#### 属性选择器

属性选择器根据 HTML 元素的属性来选中元素。属性选择器有四种形态：

- 第一种，[att]直接在方括号中放入属性名，是检查元素是否具有这个属性，只要元素有这个属性，不论属性是什么值，都可以被选中。
- 第二种，[att=val]精确匹配，检查一个元素属性的值是否是 val。
- 第三种，[att~=val]多种匹配，检查一个元素的值是否是若干值之一，这里的 val 不是一个单一的值了，可以是用空格分隔的一个序列。
- 第四种，[att|=val]，开头匹配，检查一个元素的值是否是以 val 开头，它跟精确匹配的区别是属性只要以 val 开头即可，后面内容不管。
  > PS：
  > [attribute] 用于选取带有指定属性的元素。
  > [attribute=value] 用于选取带有指定属性和值的元素。
  > [attribute~=value] 用于选取属性值中包含指定词汇的元素。
  > [attribute|=value] 用于选取带有以指定值开头的属性值的元素，该值必须是整个单词。
  > [attribute^=value] 匹配属性值以指定值开头的每个元素。
  > [attribute$=value] 匹配属性值以指定值结尾的每个元素。
  > [attribute*=value] 匹配属性值中包含指定值的每个元素。

#### 伪类选择器

伪类选择器是一系列由 CSS 规定好的选择器，它们以冒号开头。伪类选择器有普通型和函数型两种。

- 树结构关系伪类选择器
  :root 伪类表示树的根元素，在选择器是针对完整的 HTML 文档情况，我们一般用 HTML 标签即可选中根元素。但是随着 scoped css 和 shadow root 等场景出现，选择器可以针对某一子树来选择，这时候就很需要 root 伪类了。
  - :empty 伪类表示没有子节点的元素，这里有个例外就是子节点为空白文本节点的情况。
  - :nth-child 和 :nth-last-child 这是两个函数型的伪类
    ![](https://cdn.nlark.com/yuque/0/2021/png/250093/1618219519156-dc7dbf22-2a9f-47f3-bce9-fd55cc73b758.png#height=188&id=IotxV&originHeight=188&originWidth=619&originalType=binary∶=1&size=0&status=done&style=none&width=619)
  - :nth-last-child 的区别仅仅是从后往前数。
  - :first-child :last-child 分别表示第一个和最后一个元素。
  - :only-child 按字面意思理解即可，选中唯一一个子元素。

of-type 系列，是一个变形的语法糖，S:nth-of-type(An+B) 是:nth-child(|An+B| of S) 的另一种写法。以此类推，还有 nth-last-of-type、first-of-type、last-of-type、only-of-type。

- 链接与行为伪类选择器
  - :any-link 表示任意的链接，包括 a、area 和 link 标签都可能匹配到这个伪类。
  - :link 表示未访问过的链接，
  - :visited 表示已经访问过的链接。
  - :hover 表示鼠标悬停在上的元素。
  - :active 表示用户正在激活这个元素，如用户按下按钮，鼠标还未抬起时，这个按钮就处于激活状态。
  - :focus 表示焦点落在这个元素之上。
  - :target 用于选中浏览器 URL 的 hash 部分所指示的元素。
- 逻辑伪类选择器
  一个逻辑伪类 —— :not 伪类。这个伪类是个函数型伪类，它的作用时选中内部的简单选择器命中的元素。

```css
*|*: not(: hover);
```

- 选择器 3 级标准中，not 只支持简单选择器，在选择器 4 级标准，则允许 not 接受一个选择器列表，这意味着选择器支持嵌套，仅靠 not 即可完成选择器的一阶真值逻辑完备，但目前还没有看到浏览器实现它。

### 选择器的组合

选择器列表是用逗号分隔的复杂选择器序列；复杂选择器则是用空格、大于号、波浪线等符号连接的复合选择器；复合选择器则是连写的简单选择器组合。

#### 组合符号优先级

优先级第一：“无连接符号”；优先级第二：“空格”，“~”，“+”，“>”，“||”；优先级第三：“，”；

例：

```css
.c,
.a > .b.d {
  /*......*/
}
```

- .c,.a>.b.d
  - .c
  - .a>.b.d
    - .a
      - .b.d
        - .b
        - .d

复合选择器表示简单选择器中“且”的关系，例如，例子中的“ .b.d ”，表示选中的元素必须同时具有 b 和 d 两个 class。

- “空格”：后代，表示选中所有符合条件的后代节点， 例如“ .a .b ”表示选中所有具有 class 为 a 的后代节点中 class 为 b 的节点。
- “>” ：子代，表示选中符合条件的子节点，例如“ .a>.b ”表示：选中所有“具有 class 为 a 的子节点中，class 为 b 的节点”。
- “~” : 后继，表示选中所有符合条件的后继节点，后继节点即跟当前节点具有同一个父元素，并出现在它之后的节点，例如“ .a~.b ”表示选中所有具有 class 为 a 的后继中，class 为 b 的节点。
- “+”：直接后继，表示选中符合条件的直接后继节点，直接后继节点即 nextSlibling。例如 “.a+.b ”表示选中所有具有 class 为 a 的下一个 class 为 b 的节点。
- “||”：列选择器，表示选中对应列中符合条件的单元格。

同一优先级的选择器遵循“后面的覆盖前面的”原则。

在实践中，建议“根据 id 选单个元素”“class 和 class 的组合选成组元素”“tag 选择器确定页面风格”这样的简单原则来使用选择器，不要搞出过于复杂的选择器，否则容易造成样式覆盖。

### 伪元素

没有把它放在简单选择器中，是因为伪元素本身不单单是一种选择规则，它还是一种机制。

目前兼容性达到可用的伪元素有以下几种：

- ::first-line
- ::first-letter
- ::before
- ::after

#### ::first-line & ::first-letter

比较类似的伪元素，其中一个表示元素的第一行，一个表示元素的第一个字母。

```html
<p>
  This is a somewhat long HTML paragraph that will be broken into several lines.
  The first line will be identified by a fictional tag sequence. The other lines
  will be treated as ordinary lines in the paragraph.
</p>
```

```css
p::first-line {
  text-transform: uppercase;
}

p::first-letter {
  text-transform: uppercase;
  font-size: 2em;
  float: left;
}
```

CSS 标准规定了 first-line 必须出现在最内层的块级元素之内。例：

```html
<div>
  <p id="a">First paragraph</p>
  <p>Second paragraph</p>
</div>

<div>
  <span id="b">First paragraph</span><br />
  <span>Second paragraph</span>
</div>
```

```css
div > p#a {
  color: green;
}

div > p#b {
  color: green;
}

div::first-line {
  color: blue;
}
```

最终，第一块文本的第一行是蓝色的，因为 p 是块级元素，所以伪元素出现在块级元素之内，所以内层的 color 覆盖了外层的 color 属性。第二块文本的第一行是绿色的。

::first-letter 的行为又有所不同，它的位置在所有标签之内。

```css
div > span#b {
  color: green;
}

div::first-letter {
  color: blue;
}
```

首字母变成了蓝色，这说明伪元素出现在 span 之内。

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1618219519144-ae05e6de-eec9-4fc8-b343-73cf6d192f4c.png#height=526&id=baGPb&originHeight=526&originWidth=1187&originalType=binary∶=1&size=0&status=done&style=none&width=1187)

#### ::before & ::after

不是把已有的内容套上一个元素，而是真正的无中生有，造出一个元素。::before 表示在元素内容之前插入一个虚拟的元素，::after 则表示在元素内容之后插入。这两个伪元素所在的 CSS 规则必须指定 content 属性才会生效。

::before 和 ::after 还支持 content 为 counter。

```html
<p class="special">I'm real element</p>

p.special::before { display: block; content: "pseudo! "; } body { counter-reset:
chapno; } p.special::before { display: block; counter-increment: chapno;
content: counter(chapno, upper-roman) ". "; }
```
