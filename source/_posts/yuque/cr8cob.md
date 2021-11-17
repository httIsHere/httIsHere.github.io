---
title: 「TypeScript」接口，数组，函数
urlname: cr8cob
date: '2021-08-17 20:03:16 +0800'
tags:
  - ts
categories:
  - Typescript
---

### 接口（Interface）

使用接口（Interfaces）来定义对象的类型。

> 在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。
> TypeScript 中的接口是一个非常灵活的概念，除了可用于[对类的一部分行为进行抽象](http://ts.xcatliu.com/advanced/class-and-interfaces.html#%E7%B1%BB%E5%AE%9E%E7%8E%B0%E6%8E%A5%E5%8F%A3)以外，也常用于对「对象的形状（Shape）」进行描述。

```typescript
interface List {
  id: number;
  name: string;
}
interface Result {
  data: List[];
}
let result: Result = [{ id: 1, name: "Tom" }]; // result的形状必须与接口一致
```

- 定义的变量比接口少了一些属性或者多一些属性是不允许的；
- **赋值的时候，变量的形状必须和接口的形状保持一致**；

#### 可选属性

```typescript
interface List {
  id: number;
  name: string;
  age?: number; // 可选属性: 该属性可以不存在
}
```

#### 任意属性

一个接口允许有任意的属性：

```typescript
interface List {
  id: number;
  name: string;
  [x: string]: any; // 任意属性取 string 类型的值
}
```

注：**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集**，比如任意属性的类型为 string，那么该接口不能存在 number，boolean 等类型的属性。

#### 只读属性

```typescript
interface List {
  readonly id: number;
  name: string;
}
let tom: List = {
  id: 1,
  name: "Tom",
};
tom.id = 2; // error

let Tony: List = {
  name: "Tony",
};
Tony.id = 2; // error
```

**只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候**。

#### 实践

```typescript
function render(result: Result) {
  result.data.forEach((item) => {
    console.log(item.id, item.name);
  });
}
let result = {
  data: [
    { id: 1, name: "Tom" },
    { id: 2, name: "Amy" },
  ],
};
render(result); // 正常输出

let result2 = {
  data: [
    { id: 1, name: "Tom", gender: "male" },
    { id: 2, name: "Amy" },
  ],
};
render(result2); // 正常输出

render({
  data: [
    { id: 1, name: "Tom", gender: "male" },
    { id: 2, name: "Amy" },
  ],
}); // 则会有类型检验的错误

// 类型断言绕过类型判断
render({
  data: [
    { id: 1, name: "Tom", gender: "male" },
    { id: 2, name: "Amy" },
  ],
} as Result);
```

### 数组

#### 类型+[]

```typescript
let fibonacci: number[] = [1, 1, 2, 3, 5];
```

#### 数组泛型

```typescript
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

#### 接口表示数组

基本不会这么使用。

```typescript
interface NumberArray {
  [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

#### 类数组

函数中的`arguments` 实际上是一个类数组，不能用普通的数组的方式来描述：

```typescript
function sum() {
  let args: number[] = arguments;
} // error

function sum() {
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
  } = arguments;
} // 除了约束当索引的类型是数字时，值的类型必须是数字之外，也约束了它还有 length 和 callee 两个属性。
```

### 函数

> 在 JavaScript 中，有两种常见的定义函数的方式——函数声明（Function Declaration）和函数表达式（Function Expression）。

#### 函数声明

```typescript
function sum(x: number, y: number): number {
  return x + y;
} // 需要对输入输出的类型进行约束

sum(1, 2, 3); // error
sum(1); // error
```

**输入多余的（或者少于要求的）参数，是不被允许的**。

#### 函数表达式

```typescript
let mySum = function (x: number, y: number): number {
  return x + y;
};
```

事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 `mySum`，是通过赋值操作进行类型推论而推断出来的。更精确的写法应该是：

```typescript
let mySum: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```

注：在 TypeScript 的类型定义中，`=>` 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

#### 接口定义函数

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function (source: string, subString: string) {
  return source.search(subString) !== -1;
};
```

#### 可选参数

可选参数必须接在必需参数后面，即**可选参数后面不允许再出现必需参数了**。

```typescript
function buildName(firstName: string, lastName?: string) {}
```

#### 参数默认值

```typescript
function buildName(firstName: string, lastName: string = "Cat") {
  return firstName + " " + lastName;
}
```

#### 剩余参数（rest 参数）

```typescript
function push(array: any[], ...items: any[]) {
  items.forEach(function (item) {
    array.push(item);
  });
}
let a = [];
push(a, 1, 2, 3);
```

注：rest 参数只能是最后一个参数。

#### 重载

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
```
