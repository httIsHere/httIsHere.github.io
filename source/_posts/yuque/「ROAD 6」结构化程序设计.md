---
title: 「ROAD 6」结构化程序设计
urlname: un7o7p
date: 2021-09-01 11:26:32 +0800
tags: [ROAD 6]
categories: [大前端]
---

### JS 执行粒度 Realm

- JS Context => Realm（粒度比宏任务更大）
- 宏任务
- 微任务
- 函数调用
- 语句/声明
- 表达式
- 直接量/变量/this…

如果使用 GLOBAL 变量对象是不需要用到 Realm。

在 JS 内，函数表达式和对象直接量均会创建对象，使用`.`做隐式转换也会创建对象，这些对象都是有原型的，如果没有 Realm 我们就不知道它们的原型是什么了。

```javascript
let x = new Object();
// vs
let y = {};
```

#### 获取所有 GLOBAL 对象

```javascript
var objects = [
  eval,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
  Array,
  Date,
  RegExp,
  Promise,
  Proxy,
  Map,
  WeakMap,
  Set,
  WeakSet,
  Function,
  Boolean,
  String,
  Number,
  Symbol,
  Object,
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
  ArrayBuffer,
  // SharedArrayBuffer, // 所有主流浏览器均默认于2018年1月5日禁用SharedArrayBuffer
  DataView,
  Float32Array,
  Float64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Uint8ClampedArray,
  Atomics,
  JSON,
  Math,
  Reflect,
];

var queue = [];
var set = new Set();

while (objects.length) {
  let current = objects.shift();
  if (set.has(current)) continue;
  set.add(current), queue.push(current);

  for (let p of Object.getOwnPropertyNames(current)) {
    let property = Object.getOwnPropertyDescriptor(current, p);
    if (
      property.hasOwnProperty("value") &&
      ((property.value != null && typeof property.value === "object") ||
        typeof property.value === "object") &&
      property.value instanceof Object
    ) {
      set.add(property.value), queue.push(property.value);
    }

    if (property.hasOwnProperty("get") && typeof property.get === "function") {
      set.add(property.get), queue.push(property.get);
    }

    if (property.hasOwnProperty("set") && typeof property.set === "function") {
      set.add(property.set), queue.push(property.set);
    }
  }
}
```

### 宏任务&微任务

两个角色：宿主环境和 JS 引擎。

- **宏任务：宿主发起的任务；**
- **微任务：JS 引擎发起的任务；**

JS 是单线程执行的。

宏任务内部会有一个微任务列表，在执行下一个宏任务之前，会把上一个宏任务内的微任务全部完成。

#### 分析异步执⾏的顺序：

- ⾸先我们分析**有多少个宏任务**；
- 在每个宏任务中，分析有多少个微任务；
- 根据调⽤次序，确定宏任务中的微任务执⾏次序；
- 根据宏任务的触发规则和调⽤次序，确定宏任务的执⾏次序；
- 确定整个顺序。

```javascript
setTimeout(() => {
  console.log(this.a);
}, 0);
new Promise((resolve) => resolve()).then(() => (this.a = 3));
// 3
```

思考下面代码的执行顺序：

```javascript
async function foo() {
  console.log(-2)
  await new Promise(resolve => resolve());
  console.log(-1)
}
new Promise(resolve => (console.log(0), resolve())).then(() => {
  console.log(1);
  new Promise(resolve => resolve()).then(() => console.log(1.5));
})
setTimeout(() => {
    console.log(2);
    new Promise(resolve => resolve()).then(() => console.log(3))
}, 0)
console.log(4)
console.log(5)
foo()˛
```

会先在一个微任务内执行完所有的同步代码。

宏任务 1:

- 微任务 1：0，4，5，-2（同步代码）
  - 入队：1，-1
- 微任务 2：1
  - 入队：1.5
- 微任务 3：-1
- 微任务 4：1.5

宏任务 2:

- 微任务 1：2
- 微任务 2：3

### 函数调用（Execution Context）

**执行上下文栈（Execution Context Stack）**。

在函数调用时会进行栈 push，函数执行完毕就会 pop。

- code evaluation state
- Function
- Script or Module
- Generator
- Realm
- Lexical Environment（词法环境）
- Variable Environment（变量环境）

#### Lexical Environment

- this（箭头函数声明的时候就被绑定了？）
- new.target
- super
- 变量

#### Variable Environment

> 历史遗留包袱，仅仅用于处理 var 声明。

#### Environment Record

![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-09-01_11-00-50.jpg#id=ilPmw&originHeight=430&originWidth=842&originalType=binary∶=1&status=done&style=none)

![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-09-01_11-04-45.jpg#id=ZaDKY&originHeight=276&originWidth=1084&originalType=binary∶=1&status=done&style=none)

### 拓展

在 js 内，逗号表达式永远只返回最后一个值。

```javascript
let param = 1, 2, 3;
console.log(param) // 3

let param2 = 1, function() {return this.q};
console.log(param2) // function
```
