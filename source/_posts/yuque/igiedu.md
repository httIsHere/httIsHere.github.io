---
title: 「大前端」DOM API
urlname: igiedu
date: '2021-06-30 14:24:06 +0800'
tags:
  - browser
categories:
  - browser
---

### 文档对象模型（Document Object Model，DOM）

文档对象模型是用来描述文档（特指 HTML 文档）。
同时它又是一个“对象模型”，这意味着它使用的是对象这样的概念来描述 HTML 文档。
HTML 文档是一个由标签嵌套而成的树形结构，因此，DOM 也是使用树形的对象模型来描述一个 HTML 文档。

## DOM API

- 节点：DOM 树形结构中的节点相关 API。
- 事件：触发和监听事件相关 API。
- Range：操作文字范围相关 API。
- 遍历：遍历 DOM 需要的 API。

### 节点

DOM 的树形结构所有的节点有统一的接口 Node。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1625034748183-76575f66-e3c5-4784-8665-56fd243e4519.png#align=left&display=inline&height=634&margin=%5Bobject%20Object%5D&name=image.png&originHeight=634&originWidth=955&size=260574&status=done&style=none&width=955)

```html
Element: <tagname>...</tagname> Text: text Comment:
<!-- comments -->
DocumentType: <!DOCTYPE html> ProcessingInstruction:
<?a 1?>
```

在编写 HTML 代码并且运行后，就会在内存中得到这样一棵 DOM 树，HTML 的写法会被转化成对应的文档模型，就可以通过 JavaScript 等语言去访问这个文档模型。
要重点掌握的是：Document、Element、Text 节点。
DocumentFragment 也非常有用，它常常被用来高性能地批量添加节点。
因为 Comment、DocumentType 和 ProcessingInstruction 很少需要运行时去修改和操作，所以有所了解即可。

#### Node

Node 是 DOM 树继承关系的根节点，它定义了 DOM 节点在 DOM 树上的操作，首先，Node 提供了一组属性，来表示它在 DOM 树中的关系：

- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling

操作 DOM 树的 API：

- appendChild
- insertBefore
- removeChild
- replaceChild

appendChild 和 insertBefore 的这个设计，是一个“最小原则”的设计，这两个 API 是满足插入任意位置的必要 API，而 insertAfter，则可以由这两个 API 实现出来。
所有这几个修改型的 API，全都是在父元素上操作的，比如我们要想实现“删除一个元素的上一个元素”，必须要先用 parentNode 获取其父元素。
一些高级 API：

- compareDocumentPosition：用于比较两个节点中关系的函数。
- contains：检查一个节点是否包含另一个节点的函数。
- isEqualNode：检查两个节点是否完全相同。
- isSameNode：检查两个节点是否是同一个节点，实际上在 JavaScript 中可以用“===”。
- cloneNode：复制一个节点，如果传入参数 true，则会连同子元素做深拷贝。

DOM 标准规定了节点必须从文档的 create 方法创建出来，不能够使用原生的 JavaScript 的 new 运算。于是 document 对象有：

- createElement
- createTextNode
- createCDATASection
- createComment
- createProcessingInstruction
- createDocumentFragment
- createDocumentType

#### Element 与 Attribute

Element 表示元素，它是 Node 的子类。
元素对应了 HTML 中的标签，它既有子节点，又有属性。所以 Element 子类中，有一系列操作属性的方法：

- getAttribute
- setAttribute
- removeAttribute
- hasAttribute

#### 查找元素

- querySelector
- querySelectorAll
- getElementById
- getElementsByName
- getElementsByTagName
- getElementsByClassName

getElementsByName、getElementsByTagName、getElementsByClassName 获取的集合并非数组，而是一个能够动态更新的集合。

```javascript
var collection = document.getElementsByClassName("htt");
console.log(collection.length); // 0
var winter = document.createElement("div");
winter.setAttribute("class", "htt");
document.documentElement.appendChild(winter);
console.log(collection.length); // 1
```

说明浏览器内部是有高速的索引机制，来动态更新这样的集合的。
所以，尽管 querySelector 系列的 API 非常强大，我们还是应该尽量使用 getElement 系列的 API。

### 遍历

通过 Node 的相关属性，可以用 JavaScript 遍历整个树。
实际上，DOM API 中还提供了 NodeIterator 和 TreeWalker 来遍历树。
比起直接用属性来遍历，NodeIterator 和 TreeWalker 提供了过滤功能，还可以把属性节点也包含在遍历之内。

NodeIterator:

```javascript
var iterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT,
  null,
  false
);
var node;
while ((node = iterator.nextNode())) {
  console.log(node);
}
```

TreeWalker:

```javascript
var walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT,
  null,
  false
);
var node;
while ((node = walker.nextNode())) {
  if (node.tagName === "p") node.nextSibling();
  console.log(node);
}
```

建议需要遍历 DOM 的时候，直接使用递归和 Node 的属性。

### Range

Range API 表示一个 HTML 上的范围，这个范围是以**文字**为最小单位的，所以 Range 不一定包含完整的节点，它可能是 Text 节点中的一段，也可以是头尾两个 Text 的一部分加上中间的元素。
通过 Range API 可以比节点 API 更精确地操作 DOM 树，凡是 节点 API 能做到的，Range API 都可以做到，而且可以做到更高性能，但是 Range API 使用起来比较麻烦，所以在实际项目中，并不常用，只有做底层框架和富文本编辑对它有强需求。

创建 Range 一般是通过设置它的起止来实现：

```javascript
var range = new Range(),
  firstText = p.childNodes[1],
  secondText = em.firstChild;
range.setStart(firstText, 9); // do not forget the leading space
range.setEnd(secondText, 4);
```

通过 Range 也可以从用户选中区域创建，这样的 Range 用于处理用户选中区域：

```javascript
var range = document.getSelection().getRangeAt(0);
```

更改 Range 选中区段内容的方式主要是取出和插入，分别由 extractContents 和 insertNode 来实现：

```javascript
var fragment = range.extractContents();
range.insertNode(document.createTextNode("aaaa"));
```
