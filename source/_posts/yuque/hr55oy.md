---
title: 「ROAD 6」浏览器原理-HTML解析
urlname: hr55oy
date: '2021-09-27 14:18:17 +0800'
tags:
  - ROAD 6
categories:
  - 大前端
---

> 主要分析浏览器接收到服务器端传输过来的 HTML 如何将其解析为 DOM 的步骤。

### STEP 1: 文件拆分

> parse 接受 HTML 文本作为参数，返回一棵 DOM 树。

为了方便管理，单独拆分出`parser.js`。

### STEP 2: 创建状态机

- 使用 FSM 实现 HTML 的分析；
- 在[HTML 标准](https://html.spec.whatwg.org/multipage/parsing.html#data-state)中已经规定了 HTML 的状态；
- toy-browser 仅使用其中几个简单的状态；

### STEP 3: 解析标签

- 主要的标签：开始标签，结束标签和自封闭标签；
- 暂时忽略属性；

### STEP 4: 创建元素

- 在状态机中，除了状态歉意，还需加入业务逻辑；
- 在标签结束状态提交标签 token；

### STEP 5: 处理属性

- 属性值分为单引号，双引号，无引号三种写法，需要多种状态处理；
- 处理属性的方式跟标签类似；
- 属性结束时，需要把属性加到标签 Token 上；

### STEP 6: 构建 DOM 树

- 从标签构建 DOM 树的基本技巧就是使用栈；
- 遇到开始标签时创建元素并入栈，遇到结束标签时出栈；
- 自封闭节点可视为入栈后立即出栈；
- 任何元素的父元素是它入栈前的栈顶；

### STEP 7: 文本节点

- 文本节点与自封闭标签处理类似；
- 多个文本节点需要合并；

### 主要代码

```javascript
/*
 * @Author: httishere
 * @Date: 2021-09-24 11:06:02
 * @LastEditTime: 2021-09-24 17:57:47
 * @LastEditors: Please set LastEditors
 * @Description: 解析HTML
 * @FilePath: /Note/toy-browser/parse.js
 */
const EOF = Symbol("EOF"); // EOF: End Of File

let currentToken = null,
  currentAttribute = null;

// 构造树结构
let stack = [{ type: "document", children: [] }];

// 报告当前状态
function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type === "startTag") {
    console.log(token);
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;
    for (let p in token) {
      if (p !== "type" || p !== "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }
    top.children.push(element);
    element.parent = top;

    // 入栈
    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type == "endTag") {
    console.log(token);
    if (top.tagName !== token.tagName) {
      throw new Error("Tag start doesn't macth the end");
    } else {
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === "text") {
    // 文本节点处理
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content = token.content;
  }
}

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: "EOF" });
    return;
  } else {
    emit({ type: "text", content: c });
    return data;
  }
}

function tagOpen(c) {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  }
  return;
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c === ">") {
  } else if (c === EOF) {
  }
  return;
}

function tagName(c) {
  // 空格，回车等
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    // 自封闭标签
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c; // 记录当前的标签名
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else return tagName;
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === ">" || c === "/" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === ">" || c === "/" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttribute.name = "";
    currentAttribute.value = "";
    return attributeName(c);
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === ">" || c === "/" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuoteAttributeValue;
  } else if (c === "'") {
    return singleQuoteAttributeValue;
  } else {
    return unquoteAttributeValue(c);
  }
}

function doubleQuoteAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuoteAttributeValue;
  }
}

function singleQuoteAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuoteAttributeValue;
  }
}

function afterQuoteAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuoteAttributeValue;
  }
}

function unquoteAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<" || c === "=" || c === "`") {
  } else if (c === EOF) {
  } else {
    // 普通字符
    currentAttribute.value += c;
    return unquoteAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c === EOF) {
  } else {
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  console.log(stack[0]);
};
```
