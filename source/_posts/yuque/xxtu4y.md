---
title: 「TS」 TypeScript 学习 01（类型）
urlname: xxtu4y
date: '2020-06-24 16:39:31 +0800'
tags:
  - ts
categories:
  - TypeScript
cover:
---

<!-- more -->

> [TypeScript](http://www.typescriptlang.org/)  是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持，它由 Microsoft 开发，代码[开源于 GitHub](https://github.com/Microsoft/TypeScript)  上。
> 教程参考：[https://ts.xcatliu.com](https://ts.xcatliu.com)

我想每个计算机相关专业的学生刚进入大学学的第一门语言一定是 C。
当我成为一名前端并工作几年，长时间使用 JavaScript 后就会发现这种简洁简便的语言让我渐渐忘掉了一些概念，比如接口（Interfaces）、泛型（Generics）、类（Classes）、枚举类型（Enums），而且在一些工程量庞大的系统项目内使用的一定是 typescript，它增加了代码的可读性和可维护性，大部分的函数只要看类型的定义就可以知道如何使用，现在越来越多的第三方库也在采用 typescript 进行开发。

> `TypeScript`  是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持。
> `TypeScript` 中，使用  :  指定变量的类型，:  的前后有没有空格都可以。

####

### 常用类型&&基本类型：

- 原始数据类型
- 任意值
- 类型推论
- 联合类型
- 对象的类型——接口
- 数组的类型
- 函数的类型
- 类型断言
- 声明文件
- 内置对象

#### 原始数据类型

原始数据类型包括：布尔值、数值、字符串、null、undefined  以及  [ES6 中的新类型 Symbol](http://es6.ruanyifeng.com/#docs/symbol)。

- 布尔值，使用`boolean`定义布尔值类型：

在 TypeScript 中，boolean  是 JavaScript 中的基本类型，而  Boolean  是 JavaScript 中的构造函数。
`new Boolean()`返回的是一个 Boolean 对象。

```typescript
let is_boolean: boolean = false;

let createdByNewBoolean: Boolean = new Boolean(1);

let createdByBoolean: boolean = Boolean(1); // 直接调用 Boolean 也可以返回一个 boolean 类型
```

- 数值，使用`number`定义数值类型：

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

- 字符串，使用`string`定义字符串类型：

```typescript
let myName: string = "Tom";
let myAge: number = 25;

// 模板字符串
let sentence: string = `Hello, my name is ${myName}. I'll be ${
  myAge + 1
} years old next month.`;
```

- 空值，JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用`void`表示没有任何返回值的函数：

```typescript
function alertName(): void {
  alert("My name is Tom");
}

let unusable: void = undefined; // 声明一个 void 类型的变量只能将它赋值为 undefined 和 null
```

- Null & Undefined，在 TypeScript 中，可以使用`null`和`undefined`来定义这两个原始数据类型：

```typescript
let u: undefined = undefined;
let n: null = null;

// 与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 number 类型的变量：
let num: number = undefined;
let u: undefined, v: void;
let _num: number = u;
let __num: number = v; // error
```

#### 任意值

`any`类型，则允许被赋值为任意类型，在任意值上访问任何属性都是允许的，也允许调用任何方法，**变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型。**

```typescript
let _string: any = "string";
_string = 0;

let _any: any = "test";
console.log(_any.name);
console.log(_any.getName());

let _anything; // 相当于let _anything : any;
```

#### 类型推论

如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

```typescript
let my_type = "hhhh"; // 未定义类型，会被推断类型为string
my_type = 1; // error

let my_type; // 定义时未赋值，则类型推断为any
my_type = "string";
my_type = 1;
```

#### 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。
联合类型使用  `|`  分隔每个类型。
注：当不确定当前变量类型时，只能访问此联合类型的所有类型里共有的属性或方法；

```typescript
let my_type: string | number;

my_type.length; // error

my_type.toString(); // ok
```

#### 对象的类型--接口

在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。
在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。
TypeScript 中的接口是一个非常灵活的概念，除了可用于[对类的一部分行为进行抽象](https://ts.xcatliu.com/advanced/class-and-interfaces.html#%E7%B1%BB%E5%AE%9E%E7%8E%B0%E6%8E%A5%E5%8F%A3)以外，也常用于对「对象的形状（Shape）」进行描述。
赋值的时候，变量的形状必须和接口的形状保持一致。

```typescript
interface Person {
  name: string;
  age: number;
}

let Tom: Person = {
  name: "Tom",
  age: 25,
}; // 属性必须完全一致

let Amy: Person = {
  name: "Amy",
}; // error
```

- 可选属性，可以要求不完全一致，但是不可增加未定义属性。

```typescript
interface Animal {
  type: string;
  subType?: string;
}

let lulu: Animal = {
  type: "Cat",
};
```

- 任意属性，**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集，所以类型要保持一致；**

一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型。

```typescript
interface Animal {
	type: string,
  subType?: string,
  count: number,
  [propName: string]: string
}

let lulu: Animal = {
  type: 'Cat',
  count: 1,
  gender: 'male'
} // error, 由于接口内定义了任意属性，所以type，subType，count都是任意属性但子集，但是count的类型为number与任意属性的类型不符


interface Animal {
	type: string,
  subType?: string,
  count: number,
  [propName: string]: string ｜ number
}

let lulu: Animal = {
  type: 'Cat',
  count: 1,
  gender: 'male'
}
```

- 只读属性，可以用  `readonly`  定义只读属性，只能在对象初始化时被赋值，**只读的约束存在于首次\*\***给对象赋值\***\*的时候，而非首次给只读属性赋值的时候**；

```typescript
interface Animal {
  readonly id: number;
  type: string;
  subType?: string;
  count: number;
  [propName: string]: string;
}
```

#### 数组的类型

- 类型 + 方括号」表示法：

```typescript
let fibonacci: number[] = [1, 1, 2, 3, 5];
```

- 数组泛型

```typescript
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

- interface

```typescript
interface NumberArray {
  [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

- 类数组（Array-like Object）不是数组类型，`arguments`  实际上是一个类数组，不能用普通的数组的方式来描述，而应该用接口；

```typescript
function sum() {
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
  } = arguments;
}
```

#### 函数的类型

在 JavaScript 中，有两种常见的定义函数的方式——函数声明（Function Declaration）和函数表达式（Function Expression）；

```typescript
// 函数声明（Function Declaration）
function sum(x, y) {
  return x + y;
}

// 函数表达式（Function Expression）
let mySum = function (x, y) {
  return x + y;
};
```

- 函数声明，表明参数和返回值类型，调用函数时必须传入与形参相同数量的实参；

```typescript
function sum(x: number, y: number): number {
    return x + y;
}

sum(1); // error，参数个数不对
sum(1, 2, 3); // error，参数个数不对

sum('1', 2); // error

sum(1. 2); // ok
```

- 函数表达式

```typescript
let mySum = function (x: number, y: number): number {
  return x + y;
};
// 事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 mySum，是通过赋值操作进行类型推论而推断出来的。
// 如果需要我们手动给 mySum 添加类型

let mySum: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

注：在 TypeScript 的类型定义中，`=>`  用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

- 接口形式定义函数

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function (source: string, subString: string) {
  return source.search(subString) !== -1;
};
```

**可选参数**，可选参数必须接在必需参数后面；

```typescript
function buildName(firstName: string, lastName?: string) {
  if (lastName) {
    return firstName + " " + lastName;
  } else {
    return firstName;
  }
}
let tomcat = buildName("Tom", "Cat");
let tom = buildName("Tom");
```

**默认参数**

```typescript
function buildName(firstName: string = "Cat", lastName?: string) {
  if (lastName) {
    return firstName + " " + lastName;
  } else {
    return firstName;
  }
}
```

**剩余参数，使用**`**...rest**`**获取剩余参数，rest 参数只能是最后一个参数**

```typescript
function push(array: any[], ...items: any[]) {
  items.forEach(function (item) {
    array.push(item);
  });
}

let a = [];
push(a, 1, 2, 3);
```

**重载，重载允许一个函数接受不同数量或类型的参数时，作出不同的处理**

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
// 重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现
```

#### 类型断言

类型断言（Type Assertion）可以用来手动指定一个值的类型。

```typescript
值 as 类型;
or < 类型 > 值;
```

在 tsx 语法（React 的 jsx 语法的 ts 版）中必须使用前者，即  `值 as 类型`。

- 将联合类型断言为其中一个类型

```typescript
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function getName(animal: Cat | Fish) {
  return animal.name;
} // 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，只能访问此联合类型的所有类型中共有的属性或方法

// 使用断言，访问私有方法
function isFish(animal: Cat | Fish) {
  if (typeof (animal as Fish).swim === "function") {
    return true;
  }
  return false;
}
```

注：类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误。
尽量避免断言后调用方法或引用深层属性，以减少不必要的运行时错误

```typescript
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function swim(animal: Cat | Fish) {
  (animal as Fish).swim();
}

const tom: Cat = {
  name: "Tom",
  run() {
    console.log("run");
  },
};
swim(tom); // Uncaught TypeError: animal.swim is not a function`
```

- 将父类断言为具体的子类

```typescript
class ApiError extends Error {
  code: number = 0;
}
class HttpError extends Error {
  statusCode: number = 200;
}

function isApiError(error: Error) {
  if (typeof (error as ApiError).code === "number") {
    return true;
  }
  return false;
}
```

`isApiError`的参数类型是比较抽象的父类  `Error`，这样的话这个函数就能接受  `Error`  或它的子类作为参数了，由于父类  `Error`  中没有  `code`  属性，故直接获取  `error.code`  会报错，需要使用类型断言获取  `(error as ApiError).code`。
也可以使用`instanceof`来进行类型判断：

```typescript
class ApiError extends Error {
  code: number = 0;
}
class HttpError extends Error {
  statusCode: number = 200;
}

function isApiError(error: Error) {
  if (error instanceof ApiError) {
    return true;
  }
  return false;
}
// 但是当ApiError 和 HttpError不是一个真正的类，
// 而只是一个 TypeScript 的接口（interface），
// 就无法使用 instanceof 来做运行时判断了，
// 此时只能使用断言来确定类型
```

- 将任何一个类型断言为`any`

下面我们需要在 window 上添加一个 foo 属性，但是在 ts 运行中会报错，因为 window 上没有 foo 属性。

```typescript
window.foo = 1;

// index.ts:1:8 - error TS2339: Property 'foo' does not exist on type 'Window & typeof globalThis'.
```

此时我们可以使用  `as any`  临时将  `window`  断言为  `any`  类型，在  `any`  类型的变量上，访问任何属性都是允许的：

```typescript
(window as any).foo = 1;
```

- 将`any`断言为一个具体的类型

```typescript
function getCacheData(key: string): any {
  return (window as any).cache[key];
}

// ||

function getCacheData(key: string): any {
  return (window as any).cache[key];
}

interface Cat {
  name: string;
  run(): void;
}

const tom = getCacheData("tom") as Cat;
tom.run();
```

**断言限制 🚫**
只有在  `A`  兼容  `B`，那么  `A`  能够被断言为  `B`，`B`  也能被断言为  `A`。

```typescript
interface Animal {
  name: string;
}
interface Cat {
  name: string;
  run(): void;
}

let tom: Cat = {
  name: "Tom",
  run: () => {
    console.log("run");
  },
};
let animal: Animal = tom;
```

TypeScript 是结构类型系统，类型之间的对比只会比较它们最终的结构，而会忽略它们定义时的关系。
在上面的例子中，`Cat`  包含了  `Animal`  中的所有属性，除此之外，它还有一个额外的方法  `run`。TypeScript 并不关心  `Cat`  和  `Animal`  之间定义时是什么关系，而只会看它们最终的结构有什么关系——所以它与  `Cat extends Animal`  是等价的。

```typescript
interface Animal {
  name: string;
}
interface Cat extends Animal {
  run(): void;
}
```

#### 声明文件

- `declare var` 声明全局变量
- `declare function` 声明全局方法
- `declare class` 声明全局类
- `declare enum` 声明全局枚举类型
- `declare namespace` 声明（含有子属性的）全局对象
- `interface 和 type` 声明全局类型
- `export` 导出变量
- `export namespace` 导出（含有子属性的）对象
- `export default ES6` 默认导出
- `export = commonjs` 导出模块
- `export as namespace` UMD 库声明全局变量
- `declare global` 扩展全局变量
- `declare module` 扩展模块
- `/// <reference />`  三斜线指令

**声明语句**
在使用第三方库时，一般直接使用<script>引入，然后在 js 内直接使用，但是在 ts 内编辑器就 cannot found 了，所以需要使用`declare var`来声明它的类型。

```typescript
declare var jQuery: (selector: string) => any;

jQuery("#foo");
```

`declare var`  并没有真的定义一个变量，只是定义了全局变量  `jQuery`  的类型。

**声明文件**
通常我们会把声明语句放到一个单独的文件（`jQuery.d.ts`）中，这就是声明文件，**声明文件必需以  **`**.d.ts**`**  为后缀**。

```typescript
// src/jQuery.d.ts
declare var jQuery: (selector: string) => any;
```

- `declare var`，`declare function`，`declare class`都比较类似，与`declare var`相似的还有`declare let`和`declare const`。

* `declare class`  语句也只能用来定义类型，不能用来定义具体的实现。

```typescript
// src/Animal.d.ts
declare class Animal {
  name: string;
  constructor(name: string);
  sayHi(): string;
}
// src/index.ts
let cat = new Animal("Tom");

declare class Animal {
  name: string;
  constructor(name: string);
  sayHi() {
    return `My name is ${this.name}`;
  }
  // ERROR: An implementation cannot be declared in ambient contexts.
}
```

- `declare enum`  定义的枚举类型也称作外部枚举（Ambient Enums），仅用来定义类型，而不是具体的值。

```typescript
declare enum Directions {
  Up,
  Down,
  Left,
  Right,
}
```

- `declare namespace`  用来表示全局变量是一个对象，包含很多子属性，在  `declare namespace`  内部，我们直接使用  `function ajax`  来声明函数，而不是使用  `declare function ajax`。类似的，也可以使用  `const`, `class`, `enum`  等语句。

```typescript
// src/jQuery.d.ts

declare namespace jQuery {
  function ajax(url: string, settings?: any): void;
  const version: number;
  class Event {
    blur(eventType: EventType): void;
  }
  enum EventType {
    CustomClick,
  }
}
```

```typescript
jQuery.ajax("/api/get_something");
console.log(jQuery.version);
const e = new jQuery.Event();
e.blur(jQuery.EventType.CustomClick);
```

嵌套 namespace：

```typescript
declare namespace jQuery {
  function ajax(url: string, settings?: any): void;
  namespace fn {
    function extend(object: any): void;
  }
}
```

除了全局变量之外，可能有一些类型我们也希望能暴露出来。在类型声明文件中，我们可以直接使用  `interface`  或  `type`  来声明一个全局的接口或类型。

```typescript
// src/jQuery.d.ts

interface AjaxSettings {
  method?: "GET" | "POST";
  data?: any;
}
declare namespace jQuery {
  function ajax(url: string, settings?: AjaxSettings): void;
}

// 防止命名冲突，尽量减少全局interface和type，可以放置到namespace内部
declare namespace jQuery {
  interface AjaxSettings {
    method?: "GET" | "POST";
    data?: any;
  }
  function ajax(url: string, settings?: AjaxSettings): void;
}

// 使用时需要加上前缀
// src/index.ts
let settings: jQuery.AjaxSettings = {
  method: "POST",
  data: {
    name: "foo",
  },
};
jQuery.ajax("/api/post_something", settings);
```

- 声明合并

假如 jQuery 既是一个函数，可以直接被调用  `jQuery('#foo')`，又是一个对象，拥有子属性  `jQuery.ajax()`，那么我们可以组合多个声明语句，它们会不冲突的合并起来。

```typescript
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
declare namespace jQuery {
  function ajax(url: string, settings?: any): void;
}
// src/index.ts

jQuery("#foo");
jQuery.ajax("/api/get_something");
```

#### 内置对象

内置对象是指根据标准在全局作用域（Global）上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准。

- ECMAScript 内置对象

ECMAScript 标准提供的内置对象有：`Boolean`、`Error`、`Date`、`RegExp` 等。

```typescript
let b: Boolean = new Boolean(1);
let e: Error = new Error("Error occurred");
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

- DOM 和 BOM 内置对象

DOM 和 BOM 提供的内置对象有`Document`、`HTMLElement`、`Event`、`NodeList` 等。

```typescript
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll("div");
document.addEventListener("click", function (e: MouseEvent) {
  // Do something
});
```

- TypeScript 核心库的定义文件

TypeScript 核心库的定义文件中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。

```typescript
Math.pow(10, "2");

// index.ts(1,14): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

interface Math {
  /**
   * Returns the value of a base expression taken to a specified power.
   * @param x The base value of the expression.
   * @param y The exponent value of the expression.
   */
  pow(x: number, y: number): number;
}

document.addEventListener("click", function (e) {
  console.log(e.targetCurrent);
});

// index.ts(2,17): error TS2339: Property 'targetCurrent' does not exist on type 'MouseEvent'.

interface Document
  extends Node,
    GlobalEventHandlers,
    NodeSelector,
    DocumentEvent {
  addEventListener(
    type: string,
    listener: (ev: MouseEvent) => any,
    useCapture?: boolean
  ): void;
}
```
