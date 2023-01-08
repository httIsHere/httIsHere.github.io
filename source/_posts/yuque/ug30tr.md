---
title: 「JS」作用域
urlname: ug30tr
date: '2020-10-10 11:29:31 +0800'
tags:
  - js
categories:
  - JavaScript
---

> 作用域：负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符（变量）的访问权限。
> ——《你不知道的 JavaScript 上卷》

参考教程：[前端进击的巨人（三）：从作用域走进闭包](https://segmentfault.com/a/1190000017948999)

### 类型

- 全局作用域
- 函数作用域
- eval 作用域
- 块级作用域（ES6 新增）

#### 全局作用域

JavaScript 中全局环境只有一个，对应的全局作用域也只有一个。局部环境没有使用`var/let/const`声明的变量默认都会成为全局变量。

```typescript
function foo() {
  a = "global";
}
foo();
console.log(a); // global 变全局变量
```

#### 函数作用域

函数内部环境称为函数作用域，在函数内声明的变量仅在函数内有效。

```typescript
let a = "global";
function foo() {
  let a = "function";
  console.log(a); // function
}
foo();
console.log(a); // global
```

#### 块级作用域

被大括号`{}`包裹的代码部分。
ES6 前没有块级作用域的概念，所以`{}`中并没有自己的作用域。如果我们想在 ES5 的环境下构建块级作用域，一般都是是通过立即执行函数来实现的。

```typescript
var name = "global";
(function (window) {
  var name = "block";
  console.log(name); // 'block'
})(window);
console.log(name); // 'global'
```

`let/const`不允许变量提升，必须**"先声明再使用"**。这种限制，称为**"暂时性死区"**。这也能让我们在代码编写阶段变得更加规范化，执行跟书写顺序保持一致。

### 作用域链

> 当代码在一个环境中执行时，会创建变量对象的一个作用域链（scope chain）。作用域链的用途，是保证对执行环境有权访问的所有变量和函数的有序访问。作用域链的前端，始终都是当前执行的代码所在环境的变量对象。如果这个环境是函数，则将其活动对象（activation object）作为变量对象。
> ——《JavaScript 高级程序设计》

```javascript
var color = "blue";
function changeColor() {
  if (color === "blue") {
    color = "red";
  } else {
    color = "blue";
  }
}
changeColor();
alert("Color is now " + color);
```

函数` changeColor()`的作用域链包含两个对象：它自己的变量对象（其中定义着`arguments`对象）和全局环境的变量对象。

#### 作用域链的变量查询

在多层级函数嵌套内，变量对象需要在作用域链上进行查找。

```javascript
let a = 1,
  b = 2;
function func1() {
  let c = 3,
    d = 4;
  function func2() {
    let e = 5,
      f = 6;
    return a + b + c + d + e + f;
  }
  func2();
}
func1();
```

`func2()`内部获取`a`变量时，先查找当前作用域是否声明该变量，若没有则循着作用域链向上作用域进行查找，知道全局作用域。
