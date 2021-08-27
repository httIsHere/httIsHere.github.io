---
title: 「ROAD 6」语句
urlname: wkuzg2
date: 2021-08-27 14:49:55 +0800
tags: [ROAD 6]
categories: [大前端]
---

可以参考之前学的[**重学前端**的语句篇](https://www.yuque.com/httishere/running/ang4as)。

在 JavaScript 标准中，把语句分成了两种：**普通语句和声明型语句**。

常见的语句包括**变量声明、表达式、条件、循环**等。

### Completion Record

> 用于描述异常、跳出等语句执行过程。

表示一个语句执行完之后的结果，它有三个字段：

- [[type]] 表示完成的类型，`normal`, `break`, `continue`, `return`, `throw`；
- [[value]] 表示语句的返回值，如果语句没有，则是 empty；
- [[target]] 表示语句的目标，通常是一个 JavaScript 标签（标签在后文会有介绍）。

### 简单语句

- ExpressionStatement
- EmptyStatement
- DebuggerStatement
- ThrowStatement
- ContinueStatement
- BreakStatement
- ReturnStatement

### 复合语句

- BlockStatement
- IfStatement
- SwitchStatement
- IterationStatement
- WithStatement
- LabelledStatement
- TryStatement

#### block

- BlockStatement`{}`：和作用域相关，语句顺次执行，但是一旦某一语句出现错误，则该 block 会被中断；

#### Iteration

- `while() {}`：while 语句内如果是 return 或者 throw 则整个 block 的 completion 就会变成 return 或者 throw，如果是 continue 则会消费子语句；
- `do{}while()`
- `for(...;...;){}`
- `for(... in ...){}`：一个变量的所有属性名；

```javascript
for (let p in { a: 1, b: 1 }) {
  console.log(p);
}
// a
// b
```

- `for(... of ...){}`：可以遍历所有具有迭代性质的对象，可迭代对象；

```javascript
for (let p of [1, 2, 3]) {
  console.log(p);
}
// 1
// 2
// 3
function* g() {
  yield 0;
  yield 1;
  yield 4;
}
for (let p of g()) {
  console.log(p);
}
```

- `var`
- `const/let`
- `in`

#### try

try 后面必须使用`{}`。

不是 block，但是也会产生一个作用域。

```javascript
try {
  throw 2;
} catch (e) {
  let e;
  console.log(e);
}
// Uncaught SyntaxError: Identifier 'e' has already been declared
```

### 声明语句

- 函数声明

```javascript
function foo() {} // 函数声明，必须有函数名
var foo = function () {}; // 函数表达式
```

- Generator 声明，可以理解为特殊的 function，会返回一个对象，与异步编程并没有关系。
  常见的场景：产生无尽序列，分步返回多个结果等。
  完全继承了`function`的特点。

```javascript
function* foo() {}
```

- 异步声明

```javascript
function sleep(d) {
  return new Promise((resolve) => setTimeout(resolve, d));
}
void (async function () {
  let i = 0;
  while (true) {
    console.log(i++);
    await sleep(1000);
  }
})();
```

- 异步迭代器声明
  `for await`:

```javascript
async function* foo() {
  let i = 0;
  while (true) {
    console.log(i);
    yield i++;
    await sleep(1000);
  }
}
let _foo = foo();
_foo.next();

// 异步的generator只能在异步的函数内调用
void (async function () {
  let g = foo();
  console.log(await g.next());
  console.log(await g.next());
  console.log(await g.next());
})();
```

```javascript
void (async function () {
  let g = foo();
  for await (let i of g) {
    console.log(i);
  }
})();
```

- 变量声明
  - var：**变量提升**，无论在 function 的何处定义都是针对整个 function 而言的（JS 作用域的设计错误），声明提升但是赋值并不提升。
    不建议在函数内部的 block 内进行`var`声明，**最好是在 function 的头部进行变量声明**。

```javascript
var x = 0;
function foo() {
  var o = { x: 1 };
  x = 2;
  with (o) {
    var x = 3; // 改变了o内部的x
  }
  console.log(x);
  console.log(o.x);
}
foo();
console.log(x);
// 2
// 3
// 0
// 相当于
function foo() {
  var o = { x: 1 };
  var x = 3;
  x = 2;
  with (o) {
    x = 3;
  }
  console.log(x);
  console.log(o.x);
}
```

```javascript
var x = 0;
function foo() {
  var o = { x: 1 };
  x = 2; // 访问到的是全局的x
  with (o) {
    x = 3; // 实际改变的是o内部的x
  }
  console.log(x);
  console.log(o.x);
}
foo();
console.log(x);
// 2
// 3
// 2
```
