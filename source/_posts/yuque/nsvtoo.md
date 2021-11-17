---
title: 「JS」VD 1
urlname: nsvtoo
date: '2020-09-21 17:43:47 +0800'
tags:
  - js
categories:
  - Javascript
---

> VD 其实就是一个 JS 对象，包括 tag（标签名），props（属性），children（子元素对象）。

```jsx
{
  tag: "div",
  props: {
    className: "wrapper"
  },
  children: {
    "Hello World!",
    {}
  }
}
```

上面的 VD 对应的就是下面这段 HTML：

```jsx
<div className="wrapper">Hello World!</div>
```

当 html 内包括多个子元素时：

```jsx
		<div className="wrapper">
      Hello World!
      <ul>
        <li className="list-item">hh</li>
      </ul>
    </div>

{
  tag: "div",
  props: {
    className: "wrapper"
  },
  children: {
    "Hello World!",
    {
      tag: "ul",
      props: null,
      children: {
        tag: "li",
        props: {
    			className: "list-item"
  			},
        children: ["hh"]
      }
    }
  }
}
```

我们在写代码时都会写到一个 render 函数，里面写的是页面的 html 模版，然后实现 VD 与实际 DOM 的映射。

```jsx
function render() {
  const _html = (
    <div className="wrapper">
      Hello World!
      <ul>
        <li className="list-item">hh</li>
      </ul>
    </div>
  );
  return _html;
}
```

通过 JSX 编译之后生成：

```jsx
function _render() {
  var _html = createElement(
    "div",
    {
      className: "wrapper",
    },
    "Hello World!",
    createElement(
      "ul",
      null,
      createElement(
        "li",
        {
          className: "list-item",
        },
        "hh"
      )
    )
  );
  return _html;
}
```

这里面的`createElement`其实就是构造 VD 的函数，返回的就是我们的 VD 对象：

```jsx
function flatten(arr) {
  return [].concat.apply([], arr);
}
// 至少三个参数，children可能是数组所以需要对children进行jie gou
function createElement(tag, props, ...children) {
  return {
    tag,
    props: props || {},
    children: flatten(children) || [],
  };
}
```
