---
title: 「大前端」JS Type
urlname: nhlvq8
date: 2021-03-08 09:43:00 +0800
tags: [js]
categories: [Javascript]
---

- 为什么有的编程规范要求用 void 0 代替 undefined？
- 字符串有最大长度吗？
- 0.1 + 0.2 不是等于 0.3 么？为什么 JavaScript 里不是这样的？
- ES6 新加入的 Symbol 是个什么东西？
- 为什么给对象添加的方法能用在基本类型上？

> 运行时类型是代码实际执行过程中我们用到的类型。所有的类型数据都会属于 7 个类型之一。从变量、参数、返回值到表达式中间结果，任何 JavaScript 代码运行过程中产生的数据，都具有运行时类型。

### 类型

- Undefined
- Null
- Boolean
- String
- Number
- Symbol
- Object

#### q1: 为什么有的编程规范要求用 void 0 代替 undefined？

void 运算符通常只用于获取`undefined`的原始值，一般使用`void(0)`（等同于`void 0`），因为 `JavaScript` 的代码 `undefined` 是一个变量，而并非是一个关键字，这是 `JavaScript` 语言公认的设计失误之一，所以为了避免无意中被篡改，建议使用`void 0`来获取 undefined 值。

#### q2: 字符串有最大长度吗？

String 的最长长度是`2^53 - 1`，String 的意义并非“字符串”，而是字符串的 UTF16 编码，我们字符串的操作 charAt、charCodeAt、length 等方法针对的都是 UTF16 编码。所以，字符串的最大长度，实际上是受字符串的编码长度影响的。
JavaScript 中的字符串是永远无法变更的，一旦字符串构造出来，无法用任何方式改变字符串的内容，所以字符串具有值类型的特征。

```javascript
let aa = "string";
aa[0] = "S";
aa; // string
```

#### q3: 0.1 + 0.2 不是等于 0.3 么？为什么 JavaScript 里不是这样的？

根据双精度浮点数的定义，非整数 Number 无法使用==/===进行比较，正确的比较方法是使用 JS 提供的最小精度值：

```javascript
Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON;
```

#### q4: ES6 新加入的 Symbol 是个什么东西？

ES6 内引入的新类型，是一切非字符串的对象 key 的集合。

> **symbol** 是一种**基本数据类型** （[primitive data type](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)）。`Symbol()`函数会返回**symbol**类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的 symbol 注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法："`new Symbol()`"。

```javascript
var mySymbol = Symbol("my symbol");
```

可以使用 Symbol 的某些属性实现一些功能，比如可以使用`Symbol.iterator`(迭代器)来自定义`for...of`在对象上的行为：

```javascript
var o = new Object();

o[Symbol.iterator] = function () {
  var v = 0;
  return {
    next: function () {
      return { value: v++, done: v > 10 };
    },
  };
};

for (var v of o) console.log(v); // 0 1 2 3 ... 9
```

#### q5: 为什么给对象添加的方法能用在基本类型上？

对象的定义是“属性的集合”。属性分为数据属性和访问器属性，二者都是 key-value 结构，key 可以是字符串或者 Symbol 类型。
JavaScript 中的“类”仅仅是运行时对象的一个私有属性，而 JavaScript 中是无法自定义类型的（TypeScript 解决了 JavaScript 的类型问题）。

3 与 new Number(3) 是完全不同的值，它们一个是 Number 类型， 一个是对象类型。

```javascript
3 === new Number(3); // false，产生新的对象
3 === Number(3); // true，强制进行类型转换
```

Number、String 和 Boolean，三个构造器是两用的，当跟 new 搭配时，它们产生对象，当直接调用时，它们表示强制类型转换。

运算符提供了**装箱操作**，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法。

```javascript
Symbol.prototype.hello = () => console.log("hello");
var a = Symbol("a");
console.log(typeof a); //symbol，a并非对象
a.hello(); //hello，有效
```

### 类型转换

#### StringToNumber

在不传入第二个参数的情况下，parseInt 只支持 16 进制前缀“0x”，而且会忽略非数字字符，也不支持科学计数法。在一些古老的浏览器环境中，parseInt 还支持 0 开头的数字作为 8 进制前缀，这是很多错误的来源。所以在任何环境下，都建议传入 parseInt 的第二个参数，而 parseFloat 则直接把原字符串作为十进制来解析，它不会引入任何的其他进制。

**在进行字符串到数字的类型转换时尽量使用 Number()进行转换。**

#### NumberToString

当 Number 绝对值较大或者较小时，字符串表示则是使用科学计数法表示的。

#### 装箱转换

每一种基本类型 Number、String、Boolean、Symbol 在对象中都有对应的类，所谓装箱转换，正是把基本类型转换为对应的对象。

全局的 Symbol 函数无法使用 new 来调用，但我们仍可以利用装箱机制来得到一个 Symbol 对象，我们可以利用一个函数的 call 方法来强迫产生装箱。

```javascript
var symbolObject = function () {
  return this;
}.call(Symbol("a"));

console.log(typeof symbolObject); //object
console.log(symbolObject instanceof Symbol); //true
console.log(symbolObject.constructor == Symbol); //true
```

```javascript
var symbolObject = Object(Symbol("a"));
```

每一类装箱对象皆有私有的 Class 属性，这些属性可以用 Object.prototype.toString 获取：

```javascript
console.log(Object.prototype.toString.call(symbolObject)); //[object Symbol]
```

#### 拆箱转换

在 JavaScript 标准中，规定了 ToPrimitive 函数，它是对象类型到基本类型的转换。

对象到 String 和 Number 的转换都遵循“先拆箱再转换”的规则，拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型。如果 valueOf 和 toString 都不存在，或者没有返回基本类型，则会产生类型错误 TypeError。

先执行 valueOf 还是 toSting 取决于你的后续操作。

```javascript
var o = {
  valueOf: () => {
    console.log("valueOf");
    return {};
  },
  toString: () => {
    console.log("toString");
    return {};
  },
};
o * 2; // valueOf toSring TypeError

String(o); // toString valueOf TypeError

var o = {
  valueOf: () => {
    console.log("valueOf");
    return {};
  },
  toString: () => {
    console.log("toString");
    return {};
  },
};

o[Symbol.toPrimitive] = () => {
  console.log("toPrimitive");
  return "hello";
};
o + ""; // toPrimitive hello
```

#### 其他规范类型

- List 和 Record： 用于描述函数传参过程。
- Set：主要用于解释字符集等。
- Completion Record：用于描述异常、跳出等语句执行过程。
- Reference：用于描述对象属性访问、delete 等。
- Property Descriptor：用于描述对象的属性。
- Lexical Environment 和 Environment Record：用于描述变量和作用域。
- Data Block：用于描述二进制数据。

#### 实践

不用原生的 Number 和 parseInt，用 JavaScript 代码实现 String 到 Number 的转换，该怎么做呢？

```javascript
let num = "12345";
+num;
```
