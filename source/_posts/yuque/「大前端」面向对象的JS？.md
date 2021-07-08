---
title: 「大前端」面向对象的JS？
urlname: wev3mi
date: 2021-03-11 14:04:26 +0800
tags: [js]
categories: [Javascript]
---

## 面对对象 or 基于对象

> Object：一切事物的总称。
> 基于对象：语言和宿主的基础设施由对象来提供，并且 JavaScript 程序即是一系列互相通讯的对象集合。

对象的特点（标识性、状态和行为）：

- 对象具有唯一标识性：即使完全相同的两个对象，也并非同一个对象。（一般而言，各种语言的对象唯一标识性都是用内存地址来体现的）
- 对象有状态：对象具有状态，同一对象可能处于不同状态之下。
- 对象具有行为：即对象的状态，可能因为它的行为产生变迁。

**JavaScript 中对象独有的特色是：对象具有高度的动态性，这是因为 JavaScript 赋予了使用者在运行时为对象添改状态和行为的能力。**

### 数据属性和访问器属性（getter/setter）

#### 数据属性

- value：就是属性的值。
- writable：决定属性能否被赋值。
- enumerable：决定 for in 能否枚举该属性。
- configurable：决定该属性能否被删除或者改变特征值。

#### 访问器

- getter：函数或 undefined，在取属性值时被调用。
- setter：函数或 undefined，在设置属性值时被调用。
- enumerable：决定 for in 能否枚举该属性。
- configurable：决定该属性能否被删除或者改变特征值。

可以使用内置函数`getOwnPropertyDescriptor`来查看属性特征：

```javascript
var o = { a: 1 };
o.b = 2;
// a和b皆为数据属性
Object.getOwnPropertyDescriptor(o, "a");
// {value: 1, writable: true, enumerable: true, configurable: true}
Object.getOwnPropertyDescriptor(o, "b");
// {value: 2, writable: true, enumerable: true, configurable: true}
```

使用`Object.defineProperty`改变属性特征或者自定义访问器属性（**与 Vue 的双向绑定实现原理相关**）：

```javascript
var o = { a: 1 };
Object.defineProperty(o, "b", {
  value: 2,
  writable: false,
  enumerable: false,
  configurable: true,
});
//a和b都是数据属性，但特征值变化了
Object.getOwnPropertyDescriptor(o, "a");
// {value: 1, writable: true, enumerable: true, configurable: true}
Object.getOwnPropertyDescriptor(o, "b");
// {value: 2, writable: false, enumerable: false, configurable: true}
o.b = 3;
console.log(o.b); // 2，不能被重新赋值
```

在创建对象时，也可以使用 get 和 set 关键字来创建访问器属性：

```javascript
var o = {
  get a() {
    return 1;
  },
};

console.log(o.a); // 1
```

**JavaScript 对象的具体设计：具有高度动态性的属性集合。**

面向对象的三个特征，封装，继承，多态。

对于面向对象的思考还需要学习很多！！！

### 结语：

JavaScript 是面向对象的，但是又和主流的面向对象不同，最主要的区别在于 JS 具有高度动态性，可以在运行时对对象进行属性的添加和更改。

## 面向对象

### 原型

JS 是基于原型来描述对象，不同于其他基于类的编程语言，“基于原型”的编程看起来更为提倡程序员去关注一系列**对象实例的行为**，而后才去关心如何将这些对象，划分到最近的使用方式相似的原型对象，而不是将它们分成类（理解“基于原型”的编程思想是深入理解 JavaScript 的关键所在--原型：一系列对象行为的集合，原型更强调的是行为）。

基于原型的面向对象系统通过“复制”的方式来创建新对象，并不真的去复制一个原型对象，而是使得新对象持有一个**原型的引用**。

- 所有对象都有私有字段[[prototype]]，就是对象的原型
- 访问某个属性时，如果实例对象本身没有，则会继续访问对象的原型，直到原型为空或者找到为止

ES6 提供了一系列内置函数，可以直接访问操纵原型：

- Object.create 根据指定的原型创建新对象，原型可以是 null；
- Object.getPrototypeOf 获得一个对象的原型；
- Object.setPrototypeOf 设置一个对象的原型。

```javascript
var cat = {
  say() {
    console.log("meow~");
  },
  jump() {
    console.log("jump");
  },
};

var tiger = Object.create(cat, {
  say: {
    writable: true,
    configurable: true,
    enumerable: true,
    value: function () {
      console.log("roar!");
    },
  },
});

var anotherCat = Object.create(cat);

anotherCat.say(); // meow~

var anotherTiger = Object.create(tiger);

anotherTiger.say(); // roar!
```

如果在 anotherTiger 上想要访问其原型的属性，可以使用`Object.getPrototypeOf`方法：

```javascript
Object.getPrototypeOf(Object.getPrototypeOf(anotherTiger)).say(); // meow~
```

自定义 Object.prototype.toString 的行为，以下代码展示了使用 Symbol.toStringTag 来自定义 Object.prototype.toString 的行为：

```javascript
var o = {};
o + ""; // "[object Object]"
o[Symbol.toStringTag] = "MyObject";
console.log(o + ""); // "[object MyObject]"
```

`new`运算接受一个构造器和一组调用参数，实际上做了几件事：

- 以构造器的 prototype 属性（注意与私有字段[[prototype]]的区分）为原型，创建新对象；
- 将 this 和调用参数传给构造器，执行（`Constructor.apply(obj, arguments)`）；
- 如果构造器返回的是对象，则返回，否则返回第一步创建的对象。

new 构造器的两种方式：一是在构造器中添加属性，二是在构造器的 prototype 属性上添加属性。

```javascript
// 直接在构造器中修改 this，给 this 添加属性。
function c1() {
  this.p1 = 1;
  this.p2 = function () {
    console.log(this.p1);
  };
}
var o1 = new c1();
o1.p2();
Object.getPrototypeOf(o1); // {constructor: ƒ}，实际添加的是this的属性非原型属性

// 修改构造器的 prototype 属性指向的对象，它是从这个构造器构造出来的所有对象的原型。
function c2() {}
c2.prototype.p1 = 1;
c2.prototype.p2 = function () {
  console.log(this.p1);
};

var o2 = new c2();
o2.p2();
Object.getPrototypeOf(o2); // {p1: 1, p2: ƒ, constructor: ƒ}
```

### ES6 中的类

在标准中删除了所有[[class]]相关的私有属性描述，类的概念正式从属性升级成语言的基础设施，从此，基于类的编程方式成为了 JavaScript 的官方编程范式。

```javascript
class Rectangle {
  constructor(height, width) {
    // 不建议将数据属性定义在构造器外
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

类中定义的方法和属性会被写在原型对象之上。

#### extends

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + " makes a noise.");
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // call the super class constructor and pass in the name parameter
    // 调用父类具有相同形参的构造方法，super()相当于Parent.prototype.constructor.call(this)
  }

  speak() {
    console.log(this.name + " barks.");
  }
}

let d = new Dog("Mitzie");
d.speak(); // Mitzie barks.
```

当我们使用类的思想来设计代码时，应该尽量使用 class 来声明类，而不是用旧语法，拿函数来模拟对象（规范代码）。

### 结语

理解运行时的原型系统都是很有必要的一件事。

prototype 属性和私有字段[prototype]的区别？

[https://time.geekbang.org/column/article/79539](https://time.geekbang.org/column/article/79539) 还需继续加油！！！

## 对象分类

JavaScript 的对象机制并非简单的属性集合 + 原型，就是 JS 的对象机制并非只有属性集合和原型。

- 宿主对象（host Objects）：由 JavaScript 宿主环境提供的对象，它们的行为完全由宿主环境决定。
- 内置对象（Built-in Objects）：由 JavaScript 语言提供的对象。
  - 固有对象（Intrinsic Objects ）：由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。
  - 原生对象（Native Objects）：可以由用户通过 Array、RegExp 等内置构造器或者特殊语法创建的对象。
  - 普通对象（Ordinary Objects）：由{}语法、Object 构造器或者 class 关键字定义类创建的对象，它能够被原型继承。

### 宿主对象

最经典的就是 window，window 上又有很多属性，如 document。

全局对象 window 上的属性，一部分来自 JavaScript 语言，一部分来自浏览器环境。

### 内置对象

#### 固有对象

随着 JavaScript 运行时创建而自动创建的对象实例，类似基础库的角色。我们前面提到的“类”其实就是固有对象的一种。

#### 原生对象

能够通过语言本身的构造器创建的对象，基本如下：

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1615442679231-3f4e7505-8b6f-4e26-815b-d91776d7f090.png#align=left&display=inline&height=375&margin=%5Bobject%20Object%5D&originHeight=375&originWidth=988&size=0&status=done&style=none&width=988)

几乎所有这些构造器的能力都是无法用纯 JavaScript 代码实现的，它们也无法用 class/extend 语法来继承。

#### （这部分需要研究研究！！）用对象来模拟函数与构造器：函数对象与构造器对象

- 函数对象的定义是：具有[[call]]私有字段的对象；
- 构造器对象的定义是：具有私有字段[[construct]]的对象。

JavaScript 用对象模拟函数的设计代替了一般编程语言中的函数，它们可以像其它语言的函数一样被调用、传参。任何宿主只要提供了“具有[[call]]私有字段的对象”，就可以被 JavaScript 函数调用语法支持。

任何对象只需要实现[[call]]，它就是一个函数对象，可以去作为函数被调用（函数是一类拥有[call] 属性的对象 至于 call 的实现与行为是引擎层面决定的）。

**对于宿主和内置对象来说，它们实现[[call]]（作为函数被调用）和[[construct]]（作为构造器被调用）不总是一致的**。比如内置对象 Date 在作为构造器调用时产生新的对象，作为函数时，则产生字符串：

```javascript
new Date(); // Mon Mar 08 2021 23:16:53 GMT+0800 (中国标准时间) (对象)
Date(); // "Mon Mar 08 2021 23:17:01 GMT+0800 (中国标准时间)" (字符串)
```

_相关_：【面试题】为啥 new date( ) 和 date( ) 表现不一致？

在 ES6 之后 => 语法创建的函数仅仅是函数，它们无法被当作构造器使用。

对于用户使用 function 语法或者 Function 构造器创建的对象来说，[[call]]和[[construct]]行为总是相似的，它们执行同一段代码。

```javascript
function f() {
  return 1;
}
var v = f(); // 把f作为函数调用
var o = new f(); // 把f作为构造器调用
```

**[[construct]]的执行过程如下**：

- 以 Object.prototype 为原型创建一个新对象；
- 以新对象为 this，执行函数的[[call]]；
- 如果[[call]]的返回值是对象，那么，返回这个对象，否则返回第一步创建的新对象。

如果我们的构造器**返回了一个新的对象**，那么 new 创建的新对象就变成了一个构造函数之外完全无法访问的对象，这一定程度上可以实现“私有”。

```javascript
function cls() {
  this.a = 100;
  return {
    getValue: () => this.a,
  };
}
var o = new cls(); // 相当于 var a = {getValue: () => this.a}，这里的this指向cls
o.getValue(); //100
o.a; // undefined
//a在外面永远无法访问到

function cls2() {
  this.a = 100;
  return {
    getValue() {
      return this.a;
    },
  };
}
var oo = new cls2();
oo.getValue();
// undefined，这里就是和this相关了，此时getValue内的this指向oo，但是oo并没有a属性，所以此时this.a为undefined
```

### 特殊行为对象

- Array：Array 的 length 属性根据最大的下标自动发生变化。
- Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。
- String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
- Arguments：arguments 的非负整数型下标属性跟对应的变量联动。
- 模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。
- 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。
- bind 后的 function：跟原来的函数相关联。

### 不使用 new 关键字获得对象

```javascript
var o = {},
  oo = function () {};
// 1. 利用字面量
var a = [],
  b = {},
  c = /abc/g;
// 2. 利用dom api
var d = document.createElement("p");
// 3. 利用JavaScript内置对象的api
var e = Object.create(null);
var f = Object.assign({ k1: 3, k2: 8 }, { k3: 9 });
var g = JSON.parse("{}");
// 4.利用装箱转换
var h = Object(undefined),
  i = Object(null),
  k = Object(1),
  l = Object("abc"),
  m = Object(true);
```

### 获取所有固有对象

```javascript
var set = new Set();
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
  SharedArrayBuffer,
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
objects.forEach((o) => set.add(o));

for (var i = 0; i < objects.length; i++) {
  var o = objects[i];
  for (var p of Object.getOwnPropertyNames(o)) {
    var d = Object.getOwnPropertyDescriptor(o, p);
    if (
      (d.value !== null && typeof d.value === "object") ||
      typeof d.value === "function"
    )
      if (!set.has(d.value)) set.add(d.value), objects.push(d.value);
    if (d.get) if (!set.has(d.get)) set.add(d.get), objects.push(d.get);
    if (d.set) if (!set.has(d.set)) set.add(d.set), objects.push(d.set);
  }
}
```
