---
title: 「TypeScript」模块化&声明
urlname: xyp3mm
date: '2021-12-23 17:17:36 +0800'
tags:
  - ts
categories:
  - TypeScript
---

## ES6 & Common

### ES6 模块系统

```typescript
// a.ts
export const a = 1;

let b = 2,
  c = 3;
export { b, c };

export interface P {
  x: number;
  y: number;
}

export function f() {}

function g() {}
export { g as G }; // 别名

export default function () {
  console.log("default");
}

export { str as hello } from "./b";

// b.ts
export const str = "es6";

// c.ts
import { a, b, c } from "./a";
import { P } from "./a";
import { f as F } from "./a";
import * as All from "./a";
import myFun from "./a"; // 不加{}表示default

console.log(a, b, c);

myFun();
```

### Common 模块系统

```typescript
// a.node.ts
let node_a = {
  x: 1,
  y: 2,
};

// 整体导出
module.exports = node_a;

// b.node.ts
exports.node_b = 3;

exports.node_c = 4;

// c.node.ts
let node_c1 = require("./a.node");
let node_c2 = require("./b.node");

console.log(node_c1, node_c2); // {x: 1, y: 2} {node_b: 3, node_c: 4}
```

**只允许一个文件内有一个顶级导出（**`**module.exports**`**）。**

### TS 编译

![](https://gitee.com/httishere/blog-image/raw/master/img/20211223103720.png#id=p8Wqx&originHeight=233&originWidth=496&originalType=binary∶=1&status=done&style=none)

#### target 语言

##### ES3

```bash
tsc ./src/es6/b.ts -t es3
```

```javascript
// b.js
"use strict";
exports.__esModule = true;
exports.str = void 0;
exports.str = "es6";
```

##### ES5

```bash
tsc ./src/es6/b.ts -t es5
```

```javascript
// b.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.str = void 0;
exports.str = "es6";
```

**最后的模块系统也是 common 模块。**

##### ES6

```bash
tsc ./src/es6/b.ts -t es6
```

```javascript
export const str = "es6";
```

**模块系统也是 ES6 模块。**

#### module

##### amd

```bash
tsc ./src/es6/b.ts -m amd
```

```javascript
// b.js
define(["require", "exports"], function (require, exports) {
  "use strict";
  exports.__esModule = true;
  exports.str = void 0;
  exports.str = "es6";
});
```

##### umd

```bash
tsc ./src/es6/b.ts -m umd
```

```javascript
// b.js
(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports"], factory);
  }
})(function (require, exports) {
  "use strict";
  exports.__esModule = true;
  exports.str = void 0;
  exports.str = "es6";
});
```

### ES6 与 Common 混用

例子：

```typescript
// node/c.node.ts
let node_c1 = require("./a.node");
let node_c2 = require("./b.node");

let node_c3 = require("../es6/a"); // 在es6内此处导出的应该就是默认导出

console.log(node_c1, node_c2);

node_c3(); // 实际：TypeError: node_c3 is not a function
```

![](https://gitee.com/httishere/blog-image/raw/master/img/20211223110136.png#id=CA6AN&originHeight=146&originWidth=392&originalType=binary∶=1&status=done&style=none)

所以如果要使用需要`node_c3.default()`。

所以在实际情况下尽量不要将 ES6 模块与 Common 进行混用。

或是使用 ts 提供的导出`export =`，导入`import X =`：

```typescript
// es6/d.ts
export = function () {
  console.log("I'm default");
};
// 且该文件不能再有其他导出

// node/c.node.ts
import node_c4 = require("../es6/d");
node_c4();
```

## 命名空间 namespace

尽量在全局环境下使用，用于隔离作用域。

在其他文件引用该命名空间文件，`/// <reference path = "a.ts" />`。

编译后会被编译成一个**立即执行函数**，并创建了一个闭包，导出的成员会被挂到全局变量下。

```typescript
// a.ts
namespace Shape {
  const pi = Math.PI;
  export function square(x: number) {
    return x * x;
  }
}

Shape.square(1);
```

编译后：

```javascript
var Shape;
(function (Shape) {
  var pi = Math.PI;
  function square(x) {
    return x * x;
  }
  Shape.square = square; // 导出的成员
})(Shape || (Shape = {}));
Shape.square(1);
```

### 命名空间别名

```typescript
import square = Shape.square;
square(1);
```

## 声明合并

将重名的声明合并为同一个声明。

### 接口声明合并

接口的非函数的成员应该是唯一的。 如果它们不是唯一的，那么它们必须是相同的类型。 如果两个接口中同时声明了同名的非函数成员且它们的类型不同，则编译器会报错。

对于函数成员，每个同名函数声明都会被当成这个函数的一个重载。 同时需要注意，当接口`A`与后来的接口`A`合并时，后面的接口具有更高的优先级。

**不同文件内重名的声明也会发生声明合并。**

```typescript
interface MA {
  x: number;
  foo(x: number): number;
}

interface MA {
  y: number;
  foo(s: string): string;
}

let merge_a: MA = {
  x: 1,
  y: 1,
  foo(p: any): any {},
};
```

如果签名里有一个参数的类型是*单一*的字符串字面量（比如，不是字符串字面量的联合类型），那么它将会被提升到重载列表的**最顶端**。

```typescript
interface MA {
  x: number;
  foo(x: number): number;
  foo(x: "a"): number;
}

interface MA {
  y: number;
  foo(s: string): string;
  foo(s: "b"): string;
}

// 合并后
interface MA {
  x: number;
  y: number;
  foo(x: "a"): number;
  foo(s: "b"): string;
  foo(x: number): number;
  foo(s: string): string;
}
```

### 命名空间声明合并

命名空间内导出的成员不可重复。

```typescript
namespace Shape {
  export function square(x: number) {
    return x * x;
  }
  export function rectangle(x: number, y: number) {
    return x * y;
  }
}
namespace Shape {
  const pi = Math.PI;
  export function circle(r: number) {
    return pi * r * r;
  }
  // error
  export function square(x: number) {
    return x * x;
  }
}
```

![](https://gitee.com/httishere/blog-image/raw/master/img/20211223143509.png#id=kqphw&originHeight=221&originWidth=771&originalType=binary∶=1&status=done&style=none)

命名空间可以和函数以及类合并，相当于给函数和类添加属性，**注意命名空间的声明不能位于与之合并的类或者函数之前**。

也可以和枚举进行合并。

## 声明文件

在使用非 TS 编写的类库时，需要书写其声明文件暴露 API。

安装相应的声明文件。

```bash
npm i jquery
# 声明文件
npm i @types/jquery -D
```

在使用第三方类库之前，可以先[查询是否有声明文件](https://www.typescriptlang.org/dt/search?search=)。

![](https://gitee.com/httishere/blog-image/raw/master/img/20211223160358.png#id=xShuu&originHeight=496&originWidth=1230&originalType=binary∶=1&status=done&style=none)

或者自己[编写声明文件](https://definitelytyped.org/guides/contributing.html)。

### 全局库

```javascript
// global-lib.js
function globalLib(options) {
  console.log(options);
}

globalLib.version = "1.0.0";
globalLib.doSomething = function () {
  console.log("global lib does something");
};
```

```typescript
// global-lib.d.ts
declare function globalLib(options: globalLib.Options): void;

declare namespace globalLib {
  const version: string;
  function doSomething(): void;
  interface Options {
    [key: string]: any;
  }
}
```

### 模块类库

```javascript
// module-lib.js
function moduleLib(options) {
  console.log(options);
}

moduleLib.version = "1.0.0";
moduleLib.doSomething = function () {
  console.log("module lib does something");
};

module.exports = moduleLib;
```

```typescript
// module-lib.d.ts
declare function moduleLib(options: ModuleLib.Options): void;

interface Options {
  [key: string]: any;
}

declare namespace moduleLib {
  const version: string;
  function doSomething(): void;
}

export = moduleLib;
```

### umd 类库

```javascript
// umd-lib.js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof module.exports === "object" && module.exports) {
    module.exports = factory();
  }
})(this, function () {
  return {
    version: "1.0.0",
    doSomething() {
      console.log("umd lib does something");
    },
  };
});
```

```typescript
// umd-lib.d.ts
declare namespace umdLib {
  const version: string;
  function doSomething(): void;
}

export as namespace umdLib;

export = umdLib;
```

### 给外部组件添加自定义方法

```typescript
import moment from "moment";
declare module "moment" {
  export function myFunction(): void;
}
moment.myFunction = () => console.log("moment my function");
moment.myFunction();
```

### 给全局变量添加方法

```typescript
declare global {
  namespace globalLib {
    function doAnything(): void;
  }
}
globalLib.doAnything = () => console.log("global doAnything");
globalLib.doAnything();
```
