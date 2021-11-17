---
title: 「TypeScript」断言，声明文件，内置对象
urlname: rkgfw0
date: '2021-08-17 20:44:26 +0800'
tags:
  - ts
categories:
  - Typescript
---

### 断言

> 类型断言（Type Assertion）可以用来手动指定一个值的类型。

#### 语法

```typescript
(值 as 类型) < 类型 > 值;
```

注：在 tsx 语法（React 的 jsx 语法的 ts 版）中必须使用前者，即 `值 as 类型`，否则会产生歧义，因为如 `<Foo>` 的语法在 tsx 中表示的是一个 `ReactNode`。

#### 作用（不能滥用）

- 在使用联合类型进行属性访问时：

```typescript
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function isFish(animal: Cat | Fish) {
  if (typeof (animal as Fish).swim === "function") {
    return true;
  }
  return false;
}
```

- 将父类断言为具体的子类

```typescript
interface ApiError extends Error {
  code: number;
}
interface HttpError extends Error {
  statusCode: number;
}

function isApiError(error: Error) {
  if (typeof (error as ApiError).code === "number") {
    return true;
  }
  return false;
}
```

- 将任何一个类型断言为 any

```typescript
window.foo = 1;
// Property 'foo' does not exist on type 'Window & typeof globalThis'.

(window as any).foo = 1; // 在 any 类型的变量上，访问任何属性都是允许的。
```

- 将 any 断言为某一具体类型

```typescript
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

#### 限制

```typescript
interface Animal {
  name: string;
}
interface Cat {
  name: string;
  run(): void;
}
```

`Cat` 包含了 `Animal` 中的所有属性，除此之外，它还有一个额外的方法 `run`。TypeScript 只会看它们最终的结构有什么关系——所以它与 `Cat extends Animal` 是等价的：

```typescript
interface Animal {
  name: string;
}
interface Cat extends Animal {
  run(): void;
}
```

当 `Animal` 兼容 `Cat` 时，它们就可以互相进行类型断言了：

```typescript
function testAnimal(animal: Animal) {
  return animal as Cat;
}
function testCat(cat: Cat) {
  return cat as Animal;
}
```

#### 双重断言

- 任何类型都可以被断言为 any
- any 可以被断言为任何类型

那么是否可以使用双重断言 `as any as Foo` 来将任何一个类型断言为任何另一个类型呢？

在语法上时可以的，但是很可能会导致运行时的错误，所以**不到万不得已，不要使用双重断言**。

#### 类型断言 vs 类型转换

> 类型断言只会影响 TypeScript 编译时的类型，类型断言语句在编译结果中会被删除。

编译之后并不会有很大的类型约束，所以类型断言不是类型转换，它不会真的影响到变量的类型，所以若要进行类型转换，需要直接调用类型转换的方法。

#### 类型断言 vs 类型声明

```typescript
const tom = getCacheData("tom") as Cat;

const tom: Cat = getCacheData("tom");
```

产生的结果也几乎是一样的——`tom` 在接下来的代码中都变成了 `Cat` 类型。

但是：

```typescript
interface Animal {
  name: string;
}
interface Cat {
  name: string;
  run(): void;
}

const animal: Animal = {
  name: "tom",
};
let tom = animal as Cat; // 由于 Animal 兼容 Cat，故可以将 animal 断言为 Cat 赋值给 tom

let tom: Cat = animal; // error，不能将父类的实例赋值给类型为子类的变量
```

核心区别

- `animal` 断言为 `Cat`，只需要满足 `Animal` 兼容 `Cat` 或 `Cat` 兼容 `Animal` 即可
- `animal` 赋值给 `tom`，需要满足 `Cat` 兼容 `Animal` 才行

#### 类型断言 vs 泛型

```typescript
function getCacheData<T>(key: string): T {
  return (window as any).cache[key];
}

interface Cat {
  name: string;
  run(): void;
}

const tom = getCacheData<Cat>("tom");
tom.run();
```

通过给 `getCacheData` 函数添加了一个泛型 `<T>`，我们可以更加规范的实现对 `getCacheData` 返回值的约束，这也同时去除掉了代码中的 `any`，是最优的一个解决方案。

## #这一块好难，后面回来继续

### 声明文件

#### 声明语句

在使用第三库的时候，往往是不知道第三方的方法或者变量的类型的，所以此时需要使用 `declare var` 来定义它的类型：

```typescript
declare var jQuery: (selector: string) => any;

jQuery("#foo");
```

**声明语句中只能定义类型，切勿在声明语句中定义具体的实现。**

#### 声明文件

通常我们会把声明语句放到一个单独的文件，如`jQuery.d.ts`。

**声明文件必需以 `.d.ts` 为后缀。**

ts 会解析项目中所有的 `*.ts` 文件，当然也包含以 `.d.ts` 结尾的文件。所以当我们将 `jQuery.d.ts` 放到项目中时，其他所有 `*.ts` 文件就都可以获得 `jQuery` 的类型定义了。

#### 书写声明文件

##### 全局变量

> 通过 `<script>` 标签引入第三方库，注入全局变量

主要是使用：

- `declare var`：声明全局变量
  与 `declare let` 类似，但是若是使用 `declare const`则次时代饿全局变量是一个常量，不允许被修改；
- `declare function`：声明全局方法

```typescript
declare function jQuery(selector: string): any;
```

- 也可以支持函数重载：

```typescript
declare function jQuery(domReadyCallback: () => any): any;
```

- `declare class`：声明全局类

```typescript
declare class Animal {
  name: string;
  constructor(name: string);
  sayHi(): string;
}
```

- `declare class` 语句也只能用来定义类型，不能用来定义具体的实现。
- `declare enum`：声明全局枚举类型

```typescript
declare enum Directions {
  Up,
  Down,
  Left,
  Right,
}
```

- `declare enum` 仅用来定义类型，而不是具体的值。
- `declare namespace`：声明（含有子属性的）全局对象
  随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的 `namespace`，而推荐使用 ES6 的模块化方案了，但是在声明文件中，`declare namespace` 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性。

```typescript
declare namespace jQuery {
  function ajax(url: string, settings?: any): void;
}
```

- 在 `declare namespace` 内部，我们直接使用 `function ajax` 来声明函数，而不是使用 `declare function ajax`。类似的，也可以使用 `const`, `class`, `enum` 等语句。
  如果对象拥有深层的层级，则需要用嵌套的 `namespace` 来声明深层的属性的类型：

```typescript
declare namespace jQuery {
  function ajax(url: string, settings?: any): void;
  namespace fn {
    function extend(object: any): void;
  }
}
```

- `interface 和 type`：声明全局类型
  可以直接使用 `interface` 或 `type` 来声明一个全局的接口或类型：

```typescript
interface AjaxSettings {
  method?: "GET" | "POST";
  data?: any;
}
```

- 暴露在最外层的 `interface` 或 `type` 会作为全局类型作用于整个项目中，故最好将他们放到 `namespace` 下：

```typescript
declare namespace jQuery {
  interface AjaxSettings {
    method?: "GET" | "POST";
    data?: any;
  }
  function ajax(url: string, settings?: AjaxSettings): void;
}
```

##### npm 包

> 一般我们通过 `import foo from 'foo'` 导入一个 npm 包，这是符合 ES6 模块规范的。

尝试给一个 npm 包创建声明文件之前，需要先看看它的声明文件是否已经存在：

1. 与该 npm 包绑定在一起。判断依据是 `package.json` 中有 `types` 字段，或者有一个 `index.d.ts` 声明文件。这种模式不需要额外安装其他包，是最为推荐的，所以以后我们自己创建 npm 包的时候，最好也将声明文件与 npm 包绑定在一起。
1. 发布到 `@types` 里。我们只需要尝试安装一下对应的 `@types` 包就知道是否存在该声明文件，安装命令是 `npm install @types/foo --save-dev`。这种模式一般是由于 npm 包的维护者没有提供声明文件，所以只能由其他人将声明文件发布到 `@types` 里了。

以上两种方式都没有找到对应的声明文件，那么我们就需要自己为它写声明文件了：

1. 创建一个 `node_modules/@types/foo/index.d.ts` 文件，存放 `foo` 模块的声明文件。这种方式不需要额外的配置，但是 `node_modules` 目录不稳定，代码也没有被保存到仓库中，无法回溯版本，有不小心被删除的风险，故不太建议用这种方案，一般只用作临时测试。
1. 创建一个 `types` 目录，专门用来管理自己写的声明文件，将 `foo` 的声明文件放到 `types/foo/index.d.ts` 中。这种方式需要配置下 `tsconfig.json` 中的 `paths` 和 `baseUrl` 字段。

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "baseUrl": "./",
    "paths": {
      "*": ["types/*"]
    }
  }
}
```

npm 包的声明文件主要有以下几种语法：

- `export` 导出变量
  在 npm 包的声明文件中，使用 `declare` 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。需要在声明文件中使用 `export` 导出，然后在使用方 `import` 导入后，才会应用到这些类型声明。

```typescript
// types/foo/index.d.ts
export const name: string;
export function getName(): string;

// 或者
declare const name: string;
declare function getName(): string;
export { name, getName };

// index.ts
import { name, getName } from "foo";
```

- `export namespace` 导出（含有子属性的）对象

```typescript
export namespace foo {
  const name: string;
  namespace bar {
    function baz(): string;
  }
}

import { foo } from "foo";
```

- `export default` ES6 默认导出
  在 ES6 模块系统中，使用 `export default` 可以导出一个默认值，使用方可以用 `import foo from 'foo'` ：

```typescript
export default function foo(): string;
import foo from "foo";
```

- **注：只有 `function`、`class` 和 `interface` 可以直接默认导出，其他的变量需要先定义出来，再默认导出。**

```typescript
export default Directions;

declare enum Directions {
  Up,
  Down,
  Left,
  Right,
}
```

- `export =` commonjs 导出模块

```typescript
// 整体导出
module.exports = foo;
// 单个导出
exports.bar = bar;
```

```typescript
// 方式1
// 整体导入
const foo = require("foo");
// 单个导入
const bar = require("foo").bar;

// 方式2
// 整体导入
import * as foo from "foo";
// 单个导入
import { bar } from "foo";

// 方式3，ts官方推荐
// 整体导入
import foo = require("foo");
// 单个导入
import bar = foo.bar;
```

##### UMD 库

既可以通过 `<script>` 标签引入，又可以通过 `import` 导入的库，称为 UMD 库。

相比于 npm 包的类型声明文件，我们需要额外声明一个全局变量，为了实现这种方式，ts 提供了一个新语法 `export as namespace`。

`export as namespace`

一般使用 `export as namespace` 时，都是先有了 npm 包的声明文件，再基于它添加一条 `export as namespace` 语句，即可将声明好的一个变量声明为全局变量：

```typescript
export as namespace foo;
export = foo;

declare function foo(): string;
declare namespace foo {
  const bar: number;
}
```

### 内置对象

> 内置对象是指根据标准在全局作用域（Global）上存在的对象。
> [TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)

#### ECMAScript 的内置对象

`Boolean`、`Error`、`Date`、`RegExp` 等。

```typescript
let b: Boolean = new Boolean(1);
let e: Error = new Error("Error occurred");
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

#### DOM 和 BOM 的内置对象

`Document`、`HTMLElement`、`Event`、`NodeList` 等。

```typescript
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll("div");
document.addEventListener("click", function (e: MouseEvent) {
  // Do something
});
```

#### [TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)

定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。

当在使用一些常用的方法的时候，TypeScript 实际上已经做了很多类型判断的工作了：

```typescript
Math.pow(10, "2"); // error

document.addEventListener("click", function (e) {
  console.log(e.targetCurrent);
}); // error
//  e 被推断成了 MouseEvent，而 MouseEvent 是没有 targetCurrent 属性的，所以报错了。
```

**注：TypeScript 核心库的定义中不包含 Node.js 部分。**

#### 用 TypeScript 写 Node.js

Node.js 不是内置对象的一部分，如果需要用 TypeScript 写 Node.js，则需要引入第三方声明文件：

```bash
npm install @types/node --save-dev
```
