---
title: 「大前端」语句2
urlname: der7kb
date: '2021-05-20 16:08:21 +0800'
tags:
  - js
categories:
  - JavaScript
---

在 JavaScript 标准中，把语句分成了两种：**普通语句和声明型语句**。

普通语句：
![](https://cdn.nlark.com/yuque/0/2021/png/250093/1621498112415-48c5e3fb-b3b7-49dd-8576-3798b9f3e004.png#height=786&id=pJH2G&originHeight=786&originWidth=564&originalType=binary∶=1&size=0&status=done&style=none&width=564)
声明语句：
![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1621498112365-7e6e4499-1bc7-4c56-9800-157fb6196f9f.jpeg#height=625&id=OzISm&originHeight=625&originWidth=1043&originalType=binary∶=1&size=0&status=done&style=none&width=1043)

#### 语句块

语句块就是一个花括号区域，需要注意的是，语句块会产生作用域。

#### 空语句

就是单独的一个分号`;`，空语句的存在仅仅是从语言设计完备性的角度考虑，允许插入多个分号而不抛出错误。

#### for in 循环

for in 循环枚举对象的属性，这里体现了属性的 enumerable 特征。

```javascript
let o = { a: 10, b: 20 };
Object.defineProperty(o, "c", { enumerable: false, value: 30 });

for (let p in o) console.log(p); // a b
```

属性 c 位不可枚举类型，所以不会被获取到。

#### for of and for await of

```javascript
for (let e of [1, 2, 3, 4, 5]) console.log(e); // 1 2 3 4 5
```

它背后的机制是 iterator 机制，可以给任何一个对象添加 iterator，使它可以用于 for of 语句：

```javascript
let o = {
  [Symbol.iterator]: () => ({
    _value: 0,
    next() {
      if (this._value == 10)
        return {
          done: true,
        };
      else
        return {
          value: this._value++,
          done: false,
        };
    },
  }),
};
for (let e of o) console.log(e);
```

在实际操作中，我们一般不需要这样定义 iterator，我们可以使用 generator function。

```javascript
function* foo() {
  yield 0;
  yield 1;
  yield 2;
  yield 3;
}
for (let e of foo()) console.log(e);
```

```javascript
// 定义了一个异步生成器函数，异步生成器函数每隔一秒生成一个数字，这是一个无限的生成器。
function sleep(duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, duration);
  });
}
async function* foo() {
  i = 0;
  while (true) {
    await sleep(1000);
    yield i++;
  }
}
for await (let e of foo()) console.log(e);
```

#### return

return 语句用于函数中，它终止函数的执行，并且指定函数的返回值。

#### break & continue

break 语句用于跳出循环语句或者 switch 语句，continue 语句用于结束本次循环并继续循环（在循环内使用）。

带标签的 break 和 continue 可以控制自己被外层的哪个语句结构消费，这可以跳出复杂的语句结构。

```javascript
outer: for (let i = 0; i < 100; i++)
  inner: for (let j = 0; j < 100; j++) if (i == 50 && j == 50) break outer;
outer: for (let i = 0; i < 100; i++)
  inner: for (let j = 0; j < 100; j++) if (i >= 50 && j == 50) continue outer;
```

#### debugger

通知调试器在此断点。在没有调试器挂载时，它不产生任何效果。

#### var

使用时注意：

- 声明同时必定初始化；
- 尽可能在离使用的位置近处声明；
- 不要在意重复声明。

```javascript
var x = 1,
  y = 2;
doSth(x, y);

for (var x = 0; x < 10; x++) doSth2(x);
```

#### let & const

let 和 const 的作用范围是 if、for 等结构型语句。

```javascript
const a = 2;
if (true) {
  const a = 1;
  console.log(a); // 1
}
console.log(a); // 2
```

注：let 和 const 声明虽然看上去是执行到了才会生效，但是实际上，它们还是会被预处理。如果当前作用域内有声明，就无法访问到外部的变量。

```javascript
const a = 2;
if (true) {
  console.log(a); //抛错
  const a = 1;
}
```

在执行到 const 语句前，我们的 JavaScript 引擎就已经知道后面的代码将会声明变量 a，从而不允许我们访问外层作用域中的 a。

#### class

声明特征跟 const 和 let 类似，都是作用于块级作用域，预处理阶段则会屏蔽外部变量。

class 内部，可以使用 constructor 关键字来定义构造函数。还能定义 getter/setter 和方法。

```javascript
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  // Getter
  get area() {
    return this.calcArea();
  }
  // Method
  calcArea() {
    return this.height * this.width;
  }
}
```

class 默认内部的函数定义都是 strict 模式的。

#### 函数声明

```javascript
function foo() {}

function* foo() {
  yield 1;
  yield 2;
  yield 3;
}

async function foo() {
  await sleep(3000);
}

async function* foo() {
  await sleep(3000);
  yield 1;
}
```

生成器函数可以理解为返回一个序列的函数，它的底层是 iterator 机制。

async 函数是可以暂停执行，等待异步操作的函数，它的底层是 Promise 机制。

Final：请找出所有具有 Symbol.iterator 的原生对象，并且看看它们的 for of 遍历行为。

```javascript
Object.getOwnPropertyNames(window).filter((prop) => {
  return (
    window[prop] &&
    window[prop].prototype &&
    window[prop].prototype[Symbol.iterator]
  );
})[
  ("Array",
  "String",
  "Uint8Array",
  "Int8Array",
  "Uint16Array",
  "Int16Array",
  "Uint32Array",
  "Int32Array",
  "Float32Array",
  "Float64Array",
  "Uint8ClampedArray",
  "BigUint64Array",
  "BigInt64Array",
  "Map",
  "Set",
  "URLSearchParams",
  "TouchList",
  "TextTrackList",
  "TextTrackCueList",
  "StyleSheetList",
  "StylePropertyMapReadOnly",
  "StylePropertyMap",
  "SVGTransformList",
  "SVGStringList",
  "SVGPointList",
  "SVGNumberList",
  "SVGLengthList",
  "RadioNodeList",
  "RTCStatsReport",
  "PluginArray",
  "Plugin",
  "NodeList",
  "NamedNodeMap",
  "MimeTypeArray",
  "MediaList",
  "Headers",
  "HTMLSelectElement",
  "HTMLOptionsCollection",
  "HTMLFormElement",
  "HTMLFormControlsCollection",
  "HTMLCollection",
  "HTMLAllCollection",
  "FormData",
  "FileList",
  "DataTransferItemList",
  "DOMTokenList",
  "DOMStringList",
  "DOMRectList",
  "CSSUnparsedValue",
  "CSSTransformValue",
  "CSSStyleDeclaration",
  "CSSRuleList",
  "CSSNumericArray",
  "CSSKeyframesRule",
  "AudioParamMap",
  "KeyboardLayoutMap",
  "MIDIInputMap",
  "MIDIOutputMap",
  "MediaKeyStatusMap",
  "XRInputSourceArray",
  "XRAnchorSet",
  "CustomStateSet",
  "webkitSpeechGrammarList",
  "EventCounts",
  "SourceBufferList",
  "_",
  "$",
  "jQuery")
];
```

有很多宿主环境提供的全局对象有 Symbol.iterator 属性，归类一下：String, Array, TypedArray, Map and Set 这五大类。
