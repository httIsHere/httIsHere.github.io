---
title: 「大前端」执行中都发生了什么
urlname: ayyozw
date: '2021-03-11 14:03:37 +0800'
tags:
  - js
categories:
  - Javascript
---

## Promise or setTimeOut

得到一段 JS 代码时，浏览器或者 Node 环境首先要做的就是；传递给 JavaScript 引擎，并且要求它去执行。但是宿主环境当遇到一些事件时，会继续把一段代码传递给 JavaScript 引擎去执行。可能还会提供 API 给 JavaScript 引擎，比如 setTimeout 这样的 API，它会允许 JavaScript 在特定的时机执行。

一个 JavaScript 引擎会常驻于内存中，它等待着我们（宿主）把 JavaScript 代码或者函数传递给它执行。

在 ES5 之后，JavaScript 引入了 Promise，这样不需要浏览器的安排，JavaScript 引擎本身也可以发起任务了（宿主发起的任务称之为：**宏任务**，JS 引擎发起的任务称之为：**微任务**）。

_相关：_【面试】什么是宏观任务？ 什么是微观任务？ 为什么会有宏观任务和微观任务？ JS 代码如何被执行？

### 宏观和微观任务

JavaScript 引擎等待宿主环境分配宏观任务，在操作系统中，通常等待的行为都是一个事件循环，所以在 Node 术语中，也会把这个部分称为事件循环。

整个循环做的事情基本上就是反复“等待 - 执行”，实际中还有要判断循环是否结束、宏观任务队列等逻辑。

所以**宏观任务的队列就相当于事件循环**。

在宏观任务中，JavaScript 的 Promise 还会产生异步代码，JavaScript 必须保证这些异步代码在一个宏观任务中完成，因此，每个宏观任务中又包含了一个微观任务队列：

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1615442641602-3651867b-6319-491c-a2fc-de436e5a69d1.jpeg#align=left&display=inline&height=1636&margin=%5Bobject%20Object%5D&originHeight=1636&originWidth=1398&size=0&status=done&style=none&width=1398)

> JavaScript 语言的一大特点就是单线程，也就是说，同一个时间只能做一件事。那么，为什么 JavaScript 不能有多个线程呢 ？这样能提高效率啊。 JavaScript 的单线程，与它的用途有关。作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？ 所以，为了避免复杂性，从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

有了宏观任务和微观任务机制，我们就可以实现 JavaScript 引擎级和宿主级的任务了，例如：Promise 永远在队列尾部添加微观任务。setTimeout 等宿主 API，则会添加宏观任务。

### Promise

> Promise 是 JavaScript 语言提供的一种标准化的异步管理方式，它的总体思想是，需要进行 io、等待或者其它异步操作的函数，不返回真实结果，而返回一个“承诺”，函数的调用方可以在合适的时机，选择等待这个承诺兑现（通过 Promise 的 then 方法的回调）。

基本使用方法：

```javascript
function sleep(duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, duration);
  });
}
sleep(1000).then(() => console.log("finished"));
```

_例 1_ Promise 函数内的执行顺序：

```javascript
var r = new Promise(function (resolve, reject) {
  console.log("a");
  resolve(); // 就是调用时的then函数
});
r.then(() => console.log("c"));
console.log("b");
// a b c
```

Promise 的 resolve 始终是异步操作，所以 c 无法出现在 b 之前。

_例 2_ setTimeOut 和 Promise 混合：

```javascript
var r = new Promise(function (resolve, reject) {
  console.log("a");
  resolve();
});
setTimeout(() => console.log("d"), 0);
r.then(() => console.log("c"));
console.log("b");
// a b c d
```

Promise 产生的是 JavaScript 引擎内部的微任务，而 setTimeout 是浏览器 API，它产生宏任务，**微任务始终先于宏任务**（因为微观服务是包含在宏观服务中）。

_例 3_ 微任务优先于宏任务：

```javascript
setTimeout(() => console.log("d"), 0);
var r = new Promise(function (resolve, reject) {
  resolve();
});
r.then(() => {
  var begin = Date.now();
  while (Date.now() - begin < 1000); // 执行一个耗时 1 秒的 Promise
  console.log("c1");
  new Promise(function (resolve, reject) {
    resolve();
  }).then(() => console.log("c2"));
});
// c1 c2 d
```

设置 1 秒延时，确保任务 c2 是在 d 之后被添加到任务队列，所以可以得出微任务优先的结论。

**分析异步执行的顺序：**

- 首先我们分析有多少个宏任务；
- 在每个宏任务中，分析有多少个微任务；
- 根据调用次序，确定宏任务中的微任务执行次序；
- 根据宏任务的触发规则和调用次序，确定宏任务的执行次序；
- 确定整个顺序。

_例 4_ 复杂的顺序问题

```javascript
function sleep(duration) {
  return new Promise(function (resolve, reject) {
    console.log("b");
    setTimeout(resolve, duration);
  });
}
console.log("a");
sleep(5000).then(() => console.log("c"));
// a b c
```

利用 Promise 把 setTimeout 封装成可以用于异步的函数，setTimeout 把整个代码分割成了 2 个宏观任务：

- 第一个宏观任务中，包含了先后同步执行的 console.log(“a”); 和 console.log(“b”)；
- setTimeout 后，第二个宏观任务执行调用了 resolve，然后 then 中的代码异步得到执行，所以调用了 console.log(“c”)；

### 新特性：async/await

它提供了用 for、if 等代码结构来编写异步的方式。它的运行时基础是 Promise。

async 函数必定返回 Promise，我们把所有返回 Promise 的函数都可以认为是异步函数。

async 函数是一种特殊语法，特征是在 function 关键字之前加上 async 关键字，这样，就定义了一个 async 函数，我们可以在其中使用 await 来等待一个 Promise。

```javascript
function sleep(duration) {
  return new Promise(function (resolve, reject) {
    console.log("c");
    setTimeout(resolve, duration);
  });
}
async function foo() {
  console.log("a");
  await sleep(2000); // await 会等待一个Promise后继续执行
  console.log("b");
}
foo();
// a
// c
// after 2s
// b
```

async 函数可以嵌套，我们在定义了一批原子操作的情况下，可以利用 async 函数组合出新的 async 函数。

```javascript
function sleep(duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, duration);
  });
}
async function foo(name) {
  await sleep(2000);
  console.log(name);
}
async function foo2() {
  await foo("a");
  await foo("b");
}
foo2();
// after 2s
// a
// after 2s
// b
```

foo2 用 await 调用了两次异步函数 foo。

### 结语

我们把宿主发起的任务称为宏观任务，把 JavaScript 引擎发起的任务称为微观任务。许多的微观任务的队列组成了宏观任务。

### 练习

实现一个红绿灯，把一个圆形 div 按照绿色 3 秒，黄色 1 秒，红色 2 秒循环改变背景色。

```javascript
function sleep(duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, duration);
  });
}
function changeColor(color) {
  console.log(color);
}
async function func() {
  changeColor("green");
  await sleep(3000);
  changeColor("yellow");
  await sleep(1000);
  changeColor("red");
  await sleep(2000);
}
let color = "green";
async function main() {
  // 实现一个循环执行后执行
  while (true) {
    await func();
  }
}
main();
```

## 闭包 & 执行上下文

JavaScript 执行中最粗粒度的任务：传给引擎执行的代码段。

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1615442641578-5775739e-90d3-49da-bbd8-6e03dfc63e02.png#align=left&display=inline&height=481&margin=%5Bobject%20Object%5D&originHeight=481&originWidth=745&size=0&status=done&style=none&width=745)

### 闭包（closure）

闭包其实只是一个**绑定了执行环境**的**函数**，它携带了执行的环境。

根据古典定义，闭包组成部分：

- 环境部分环境：
  - 函数的词法环境（执行上下文的一部分）
  - 标识符列表：函数中用到的未声明的
- 变量表达式部分：函数体

所以 JavaScript 中的函数完全符合闭包的定义。它的环境部分是函数词法环境部分组成，它的标识符列表是函数中用到的未声明变量，它的表达式部分就是函数体。

JavaScript 中跟闭包对应的概念就是“函数”，而非作用域。

从广泛的角度说，普通函数就属于闭包，但这对于我们真正理解闭包毫无意义。真正的闭包应该是即使函数是在当前词法作用域之外执行，仍访问到函数内部属性：

```javascript
function foo() {
  var a = 1;
  function bar() {
    console.log(a);
  }
  return bar;
}
var baz = foo();
baz(); // 1
```

### 执行上下文：执行的基础设施

JavaScript 函数的主要复杂性来自于它携带的“环境部分”，JavaScript 标准把一段代码（包括函数），*执行所需的所有信息*定义为：“执行上下文”。

**执行上下文在 ES3 中**，包含三个部分：

- scope：作用域，也常常被叫做作用域链。
- variable object：变量对象，用于存储变量的对象。
- this value：this 值。

**在 ES5 中**，我们改进了命名方式，把执行上下文最初的三个部分改为下面这个样子：

- lexical environment：词法环境，当获取变量时使用。
- variable environment：变量环境，当声明变量时使用。
- this value：this 值。

**在 ES2018 中**（**_推荐_**），执行上下文又变成了这个样子，this 值被归入 lexical environment：

- lexical environment：词法环境，当获取变量或者 this 值时使用。
- variable environment：变量环境，当声明变量时使用。
- code evaluation state：用于恢复代码执行位置。
- Function：执行的任务是函数时使用，表示正在被执行的函数。
- ScriptOrModule：执行的任务是脚本或者模块时使用，表示正在被执行的代码。
- Realm：使用的基础库和内置对象实例。
- Generator：仅生成器上下文有这个属性，表示当前生成器。

#### var 声明与赋值

```javascript
var b = 1;
```

var 声明作用于函数执行的作用域，也就是说，var 会穿透 for 、if 等语句。

在还没有 let 的时候--立即执行的函数表达式（**立即执行函数，IIFE**），通过创建一个函数，并且立即执行，来构造一个新的域，从而控制 var 的范围。

_例 1_

```javascript
(function () {
  var a;
  //code
})();

(function () {
  var a;
  //code
})();

// 使用void关键字，代替立即执行函数包在外边的括号
// 可以避免前一行代码不带分号而带来的问题
void (function () {
  var a;
  //code
})();
```

_例 2_，有时候 var 的特性会导致声明的变量和被赋值的变量是两个 b：

```javascript
var b;
void (function () {
  var env = { b: 1 };
  b = 2;
  console.log("In function b:", b);
  with (env) {
    var b = 3;
    console.log("In with b:", b);
  }
})();
console.log("Global b:", b);
// In function b:2
// In with b:3
// Global b:undefined
```

在 Global function with 三个环境中，b 的值都不一样，而在 function 环境中，并没有出现 var b，这说明 with 内的 var b 作用到了 function 这个环境当中（with 内的 var b 得到了变量提升），所以并未改变 Global 环境内的 b。

所以 with 内的 b 对 Function 和 With 两个域都起了作用，所以不推荐使用 with。

#### let

ES6 开始引入的新的变量声明模式，在 let 出现之前，JavaScript 的 if for 等语句皆不产生作用域。

会产生 let 使用的作用域：

- for；
- if；
- switch；
- try/catch/finally。

#### Realm

在实际的前端开发中，通过 iframe 等方式创建多 window 环境并非罕见的操作，所以，这才促成了新概念 Realm 的引入。

Realm 中包含一组完整的内置对象，而且是复制关系，顶层对象的复制关系，原型是互不干涉的。

在浏览器环境中获取来自两个 Realm 的对象，它们跟本土的 Object 做 instanceOf 时会产生差异：

```javascript
var iframe = document.createElement("iframe");
document.documentElement.appendChild(iframe);
iframe.src = "javascript:var b = {};";

var b1 = iframe.contentWindow.b;
var b2 = {};

console.log(typeof b1, typeof b2); //object object

console.log(b1 instanceof Object, b2 instanceof Object); //false true
```

由于 b1、 b2 由同样的代码“ {} ”在不同的 Realm 中执行，所以表现出了不同的行为。

## 函数

上述我们了解了执行上下文是什么（JavaScript 标准把一段代码（包括函数），*执行所需的所有信息*定义为：“执行上下文”。），也知道了任何语句的执行都会依赖特定的上下文。

切换上下文最主要的场景是函数调用。

类型：

- 普通函数：function 关键字定义的函数，`function foo(){}`；
- 箭头函数：=>运算符定义的函数，`const foo = () => {}`；
- 方法：在 class 内定义的函数，`class C { foo() {} }`；
- 生成器函数：用 function _ 定义的函数，`function_ foo(){}`；
- 类：用 class 定义的类，实际上也是函数，`class Foo { constructor() {} }`；
- 异步函数：普通函数、箭头函数和生成器函数加上 async 关键字，

```javascript
async function foo(){
  // code
}
const foo = async () => {
  // code
}
async function foo*(){
  // code
}
```

对普通变量而言，这些函数并没有本质区别，都是遵循了“继承定义时环境”的规则，它们的一个行为差异在于 this 关键字。

### this 关键字的行为

**this 是执行上下文中很重要的一个组成部分。同一个函数调用方式不同，得到的 this 值也不同**（this 是运行时，作用域是定义时）。

#### _例 1_

```javascript
function showThis() {
  console.log(this);
}
const showThis2 = () => {
  console.log(this);
};

var o = {
  showThis: showThis,
  showThis2: showThis2,
};

showThis(); // global
o.showThis(); // o
o.showThis2(); // global
```

1、

普通函数的 this 值由“调用它所使用的引用”决定（谁调用，指向谁）。

我们获取函数的表达式，它实际上返回的并非函数本身，而是一个 **Reference 类型**。

Reference 类型由两部分组成：一个对象和一个属性值。不难理解`o.showThis`产生的 Reference 类型，即由对象 o 和属性“showThis”构成。

当做一些算术运算（或者其他运算时），Reference 类型会被解引用，即获取真正的值（被引用的内容）来参与运算，而类似函数调用、delete 等操作，都需要用到 Reference 类型中的对象。

Reference 类型中的对象被当作 this 值，传入了执行函数时的上下文当中。所以对 this 的解释就是：**调用函数时使用的引用，决定了函数执行时刻的 this 值**。

从运行时的角度来看，this 跟面向对象毫无关联，它是与函数调用时使用的表达式相关。

2、

箭头函数实际上是 lambda 表达式，它的返回值是一个函数, 它不是一个语句，所以它产生的函数实际上是计算出来的而不是声明出来的 当然，我们在声明函数的时候也是有计算过程的，不过如果我们使用 function 来声明闭包，那么它的 this 其实是由 this 的绑定规则所决定的 但是如果我们使用 lambda 表达式来计算一个函数，那么它的 this 就取决于 lambda 表达式被计算时的运行环境。

箭头函数的 this 值不会指向外部对象， 其根源是**箭头函数不会产生新的执行上下文**，因此其 this 值将与外层函数保持一致，如果没有外层函数，则为 global。

箭头函数的 this 指向简单来说取决包裹箭头函数的第一个普通函数的 `this`。

#### _例 2_

```javascript
class C {
  showThis() {
    console.log(this);
  }
}
var o = new C();
var showThis = o.showThis;

showThis(); // undefined
o.showThis(); // o
```

所以生成器函数、异步生成器函数和异步普通函数跟普通函数行为是一致的，异步箭头函数与箭头函数行为是一致的。

### this 关键字的机制

函数能够引用定义时的变量，如上文分析，函数也能记住定义时的 this，因此，函数内部必定有一个机制来保存这些信息。在 JavaScript 标准中，为函数规定了用来保存定义时上下文的私有属性[[Environment]]。

当一个函数执行时，会创建一条新的执行环境记录，记录的外层词法环境（outer lexical environment）会被设置成函数的[[Environment]]（也就是函数执行时会使用函数定义时的变量（在 [[Environment]] 中）。 如果这个变量不存在，则向外层查找，外层指向哪里仍然取决于函数定义之时，如果定义时外部有函数则指向外部函数，没有函数则指向 global。 函数执行之时，无论是以何种形式被调用（全局 or 嵌套函数），变量都会依照定义时的环境被查找出来。也就是说，定义时的代码结构决定了函数的“变量查找规则”，即“作用域链”）。

即**切换上下文**：

```javascript
var a = 1;
foo();

// 在别处(外部文件等)定义了foo：

var b = 2;
function foo() {
  console.log(b); // 2
  console.log(a); // error
}
```

这里的 foo 能够访问 b（定义时词法环境），却不能访问 a（执行时的词法环境），这就是执行上下文的切换机制了。

JavaScript 用一个栈来管理执行上下文，这个栈中的每一项又包含一个链表。

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1615442641594-c9b94c45-2cc0-461a-9954-2dbe83168bae.jpeg#align=left&display=inline&height=489&margin=%5Bobject%20Object%5D&originHeight=489&originWidth=916&size=0&status=done&style=none&width=916)

当函数调用时，会入栈一个新的执行上下文，函数调用结束时，执行上下文被出栈。

而 this 则是一个更为复杂的机制，JavaScript 标准定义了 **[[thisMode]]** 私有属性。[[thisMode]] 私有属性有三个取值：

- lexical：表示从上下文中找 this，这对应了箭头函数。
- global：表示当 this 为 undefined 时，取全局对象，对应了普通函数。
- strict：当严格模式时使用，this 严格按照调用时传入的值，可能为 null 或者 undefined。

```javascript
showThis(); // Reference中的对象是global
(false || showThis)(); // Reference由于运算而被解引用，
// 然后触发this机制[[thisMode]]私有属性的global取值
```

方法的行为跟普通函数有差异，恰恰是因为 class 设计成了**默认按 strict 模式执行**。

```javascript
"use strict";
function showThis() {
  console.log(this);
}

var o = {
  showThis: showThis,
};

showThis(); // undefined，在非严格模式则是global
o.showThis(); // o
```

函数创建新的执行上下文中的词法环境记录时，会根据**[[thisMode]]**来标记新记录的[[ThisBindingStatus]]私有属性。

代码执行遇到 this 时，会逐层检查当前词法环境记录中的[[ThisBindingStatus]]，当找到有 this 的环境记录时获取 this 的值。

所以嵌套的箭头函数中的代码都指向外层 this：

```javascript
var o = {};
o.foo = function foo() {
  console.log(this);
  return () => {
    console.log(this);
    return () => console.log(this);
  };
};

o.foo()()(); // o, o, o
```

### 操作 this 的内置函数(call, bind, apply)

call 和 apply 可以指定函数调用时传入的 this，call 和 apply 作用是一样的，只是传参方式有区别，call 参数是对象+字符串；apply 参数是对象+数组。

```javascript
var o = { a: 1 };
function foo(a, b, c) {
  console.log(this);
  console.log(a, b, c);
}
foo.call({}, 1, 2, 3); // {} 1 2 3
foo.apply(o, [1, 2, 3]); // {a: 1} 1 2 3
```

Function.prototype.bind 它可以生成一个绑定过的函数，这个函数的 this 值固定了参数，不是操作在原函数上而是重新生成了一个新函数：

```javascript
function foo(a, b, c) {
  console.log(this);
  console.log(a, b, c);
}
foo.bind({}, 1, 2, 3)(); // {} 1 2 3
```

PS：call、bind 和 apply 用于不接受 this 的函数类型（如箭头、class）都不会报错，但是它们无法实现改变 this ，不过可以实现传参。
