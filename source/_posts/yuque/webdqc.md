---
title: 「Daily Keyword」yield
urlname: webdqc
date: '2021-08-24 09:54:41 +0800'
tags:
  - Daily Keyword
categories:
  - Daily
---

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1629973954887-d9120014-773e-47dc-b5da-45ec81e41031.png#clientId=u0455ce5d-5521-4&from=paste&height=297&id=u5d93a9c8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=594&originWidth=804&originalType=binary∶=1&size=343004&status=done&style=none&taskId=u8919f837-625e-4782-bc6a-fa1a9060057&width=402)

> 参考：[yield](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield)，[深入理解 js 中的 yield](https://juejin.cn/post/6999530125020626957)

​

yield 关键字用来暂停和恢复一个生成器函数（(function\* 或遗留的生成器函数）。
​

**yield 关键字使生成器函数执行暂停，yield 关键字后面的表达式的值返回给生成器的调用者。它可以被认为是一个基于生成器的版本的 return 关键字。**

####

#### 语法

> [_rv_] = **yield** [_expression_];

##### expression

定义通过迭代器协议从生成器函数返回的值。如果省略，则返回 undefined。

##### rv

返回传递给生成器的 next()方法的可选值，以恢复其执行。
​

#### 描述

- `yield`关键字实际返回一个`IteratorResult`对象，它有两个属性，`value`和`done`。
  - `value`属性是对`yield`表达式求值的结果；
  - `done`是`false`，表示生成器函数尚未完全完成；`true`则表示生成器函数已完成；
- 一旦遇到`yield`表达式，生成器的代码将被暂停运行，直到生成器的 `next()` 方法被调用。

​

#### 使用

```javascript
function* countAppleSales() {
  var saleList = [3, 7, 5];
  for (var i = 0; i < saleList.length; i++) {
    yield saleList[i];
  }
}

let appleStore = countAppleSales(); // Generator countAppleSales {<suspended>}[[GeneratorLocation]]: VM47:1[[Prototype]]: Generator[[GeneratorState]]: "suspended"[[GeneratorFunction]]: ƒ* countAppleSales()[[GeneratorReceiver]]: Window[[Scopes]]: Scopes[2]

appleStore.next(); // {value: 3, done: false}
appleStore.next(); // {value: 7, done: false}
appleStore.next(); // {value: 5, done: false}
appleStore.next(); // {value: undefined, done: true}
```

##### 说明

1. `yield`并不能直接生产值，而是产生一个等待输出的函数；
1. 某个函数包含了`yield`，意味着这个函数已经是一个 Generator；
1. 如果 yield 在其他表达式中，需要用`()`单独括起来；

##### next()函数及参数

`next()`可以带一个参数，该参数会被认为是上一个 yield 整体的返回值。
**意义在于可以在不同阶段从外部直接向内部注入不同的值来调整函数的行为。**

```javascript
function* list() {
  for (let i = 0; i < 10; i++) {
    let r = yield i;
    if (r) i = -1;
  }
}
let _list = list();
_list.next(); // {value: 0, done: false}
_list.next(); // {value: 1, done: false}
_list.next(); // {value: 2, done: false}
_list.next(); // {value: 3, done: false}
_list.next(true); // {value: 0, done: false}
// next的参数认为是yield表达式的返回值，所以此时r为true，导致i被reset
_list.next(); // {value: 1, done: false}
```

####

#### 场景

`yield`通常会和`for...of...`配合使用。

```javascript
function* salesList() {
  yield 1;
  yield 3;
  yield 5;
}

for (let item of salesList()) {
  console.log(item);
}
// 1
// 3
// 5
```
