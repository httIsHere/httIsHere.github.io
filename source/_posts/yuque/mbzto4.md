---
title: "「大前端」链接\U0001F517"
urlname: mbzto4
date: '2021-05-06 11:08:25 +0800'
tags:
  - css
categories:
  - css/Less
---

链接是 HTML 中的一种机制，它是 HTML 文档和其它文档或者资源的连接关系，在 HTML 中，链接有两种类型。一种是超链接型标签，一种是外部资源链接。

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1620270517981-020e14be-3c75-4002-bc3b-53dda82085dd.png#align=left&display=inline&height=1100&margin=%5Bobject%20Object%5D&originHeight=1100&originWidth=702&size=0&status=done&style=none&width=702)

### link 标签

HTML 标准并没有规定浏览器如何使用元信息，我们还讲到了元信息中有不少是被设计成“无需被浏览器识别，而是专门用于搜索引擎看的”。

link 标签也是元信息的一种，在很多时候，它也是不会对浏览器产生任何效果的。

link 标签会生成一个链接，它可能生成超链接，也可能生成外部资源链接。

一些 link 标签会生成超链接，这些超链接又不会像 a 标签那样显示在网页中，这就是超链接型的 link 标签。这意味着多数浏览器中，这些 link 标签不产生任何作用。但是，这些 link 标签能够被搜索引擎和一些浏览器插件识别，从而产生关键性作用。

另外一些 link 标签则会把外部的资源链接到文档中，也就是说，会实际下载这些资源，并且做出一些处理，比如我们常见的用 link 标签引入样式表。

除了元信息的用法之外，多数外部资源型的 link 标签还能够被放在 body 中使用，从而起到把外部资源链接进文档的作用。

link 标签的链接类型主要通过 **rel 属性**来区分，`<link rel="xx" ...>`。

#### 超链接类 link 标签

超链接型 link 标签是一种被动型链接，在用户不操作的情况下，它们不会被主动下载。

link 标签具有特定的 rel 属性，会成为特定类型的 link 标签。产生超链接的 link 标签包括：具有 rel=“canonical” 的 link、具有 rel="alternate"的 link、具有 rel=“prev” rel="next"的 link 等等。

- canonical 型 link，`<link rel="canonical" href="...">`：这个标签提示页面它的主 URL，在网站中常常有多个 URL 指向同一页面的情况，搜索引擎访问这类页面时会去掉重复的页面，这个 link 会提示搜索引擎保留哪一个 URL。
- alternate 型 link，`<link rel="alternate" href="...">`：这个标签提示页面它的变形形式，这个所谓的变形可能是当前页面内容的不同格式、不同语言或者为不同的设备设计的版本，这种 link 通常也是提供给搜索引擎来使用的。alternate 型的 link 的一个典型应用场景是，页面提供 rss 订阅时，可以用这样的 link 来引入：`<link rel="alternate" type="application/rss+xml" title="RSS" href="...">`。
- prev 型 link & next 型 link：在互联网应用中，很多网页都属于一个序列，比如分页浏览的场景，或者图片展示的场景，每个网页是序列中的一个项。这种时候，就适合使用 prev 和 next 型的 link 标签，来告诉搜索引擎或者浏览器它的前一项和后一项，这有助于页面的批量展示。因为 next 型 link 告诉浏览器“这是很可能访问的下一个页面”，HTML 标准还建议对 next 型 link 做预处理，在本课后面的内容，我们会讲到预处理类的 link。
- 其它超链接类的 link：表示一个跟当前文档相关联的信息，可以把这样的 link 标签视为一种带链接功能的 meta 标签。
  - rel=“author” 链接到本页面的作者，一般是 mailto: 协议
  - rel=“help” 链接到本页面的帮助页
  - rel=“license” 链接到本页面的版权信息页
  - rel=“search” 链接到本页面的搜索页面（一般是站内提供搜索时使用）

#### 外部资源类 link 标签

外部资源型 link 标签**会被主动下载**，并且根据 rel 类型做不同的处理。外部资源型的标签包括：具有 icon 型的 link、预处理类 link、modulepreload 型的 link、stylesheet、pingback。

- icon 型的 link：表示页面的 icon。
  多数浏览器会读取 icon 型 link，并且把页面的 icon 展示出来。icon 型 link 是唯一一个外部资源类的元信息 link，其它元信息类 link 都是超链接，这意味着，icon 型 link 中的图标地址默认会被浏览器下载和使用。
  如果没有指定这样的 link，多数浏览器会使用域名根目录下的 favicon.ico，即使它并不存在，所以从性能的角度考虑，建议一定要保证页面中有 icon 型的 link。
  只有 icon 型 link 有有效的 sizes 属性，HTML 标准允许一个页面出现多个 icon 型 link，并且用 sizes 指定它适合的 icon 尺寸。
- 预处理类 link：导航到一个网站需要经过 dns 查询域名、建立连接、传输数据、加载进内存和渲染等一系列的步骤。
  预处理类 link 标签就是允许我们控制浏览器，提前针对一些资源去做这些操作，以提高性能（当然如果乱用的话，性能反而更差）。
  - dns-prefetch 型 link 提前对一个域名做 dns 查询，这样的 link 里面的 href 实际上只有域名有意义。
  - preconnect 型 link 提前对一个服务器建立 tcp 连接。
  - prefetch 型 link 提前取 href 指定的 url 的内容。
  - preload 型 link 提前加载 href 指定的 url。
  - prerender 型 link 提前渲染 href 指定的 url。
- modulepreload 型的 link：作用是预先加载一个 JavaScript 的模块，可以保证 JS 模块不必等到执行时才加载（完成下载并放入内存，并不会执行对应的 JavaScript）。

```html
<link rel="modulepreload" href="app.js">
<link rel="modulepreload" href="helpers.js">
<link rel="modulepreload" href="irc.js">
<link rel="modulepreload" href="fog-machine.js">
<script type="module" src="app.js">
```

- 假设 app.js 中有 import “irc” 和 import “fog-machine”, 而 irc.js 中有 import “helpers”。这段代码使用 moduleload 型 link 来预加载了四个 js 模块。通过加入对四个 JS 文件的 link 标签，使得四个 JS 文件有机会被并行地下载，这样提高了性能。
- stylesheet 型 link：基本用法是从一个 CSS 文件创建一个样式表，type 属性可以没有，如果有，必须是"text/css"才会生效。

```html
<link rel="stylesheet" href="xxx.css" type="text/css" />
```

- pingback 型 link：表示本网页被引用时，应该使用的 pingback 地址，这个机制是一份独立的标准，遵守 pingback 协议的网站在引用本页面时，会向这个 pingback url 发送一个消息。

#### a 标签

a 标签是“anchor”的缩写，它是锚点的意思，anchor 标签的意思是标识文档中的特定位置。其同时充当了链接和目标点的角色，当 a 标签有 href 属性时，它是链接，当它有 name 时，它是链接的目标。具有 href 的 a 标签跟一些 link 一样，会产生超链接，也就是在用户不操作的情况下，它们不会被主动下载的被动型链接。a 标签基本解决了在页面中**插入文字型和整张图片超链接**的需要。

重点的内容是，a 标签也可以有 rel 属性：alternate，author，help，license，next，prev，search。

a 标签独有的 rel 类型：

- tag 表示本网页所属的标签；
- bookmark 到上级章节的链接。

a 标签还有一些辅助的 rel 类型，用于提示浏览器或者搜索引擎做一些处理：

- nofollow 此链接不会被搜索引擎索引；
- noopener 此链接打开的网页无法使用 opener 来获得当前页面的窗口；
- noreferrer 此链接打开的网页无法使用 referrer 来获得当前页面的 url；
- opener 打开的网页可以使用 window.opener 来访问当前页面的 window 对象，这是 a 标签的默认行为。

### area 标签：区域型的链接

area 是整个 html 规则中唯一支持非矩形热区的标签，它的 shape 属性支持三种类型。

- 圆形：circle 或者 circ，coords 支持三个值，分别表示中心点的 x,y 坐标和圆形半径 r。
- 矩形：rect 或者 rectangle，coords 支持两个值，分别表示两个对角顶点 x1，y1 和 x2，y2。
- 多边形：poly 或者 polygon，coords 至少包括 6 个值，表示多边形的各个顶点。

area 必须跟 img 和 map 标签配合使用。使用示例如下（例子来自 html 标准）：在一张图片上画热区并且产生链接，分别使用了矩形、圆形和多边形三种 area。

```html
<p>
  Please select a shape:
  <img
    src="shapes.png"
    usemap="#shapes"
    alt="Four shapes are available: a red hollow box, a green circle, a blue triangle, and a yellow four-pointed star."
  />
  <map name="shapes">
    <area shape="rect" coords="50,50,100,100" />
    <!-- the hole in the red box -->
    <area shape="rect" coords="25,25,125,125" href="red.html" alt="Red box." />
    <area
      shape="circle"
      coords="200,75,50"
      href="green.html"
      alt="Green circle."
    />
    <area
      shape="poly"
      coords="325,25,262,125,388,125"
      href="blue.html"
      alt="Blue triangle."
    />
    <area
      shape="poly"
      coords="450,25,435,60,400,75,435,90,450,125,465,90,500,75,465,60"
      href="yellow.html"
      alt="Yellow star."
    />
  </map>
</p>
```
