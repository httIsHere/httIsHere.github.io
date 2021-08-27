---
title: 「TypeScript」基本数据类型
urlname: rhx3w1
date: 2021-08-16 21:23:46 +0800
tags: [ts]
categories: [Typescript]
---

类型检查，语言扩展，工具属性。

#### 类型基础：

- 强类型和弱类型
  - 强类型：不允许改变变量的数据类型，除非强制类型转换；
  - 弱类型：变量可以被赋予为不同的变量类型；
- 动态类型语言和静态类型语言
  - 静态类型语言：在**编译阶段**确定所有变量的类型（对类型要求严格，可以立即发现错误，运行时性能好，自文档化）；
  - 动态类型语言：在**执行阶段**确定所有变量的类型（对类型要求宽松，不能及时察觉 bug，运行时性能差，可读性差）；

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1629201781685-ea175f59-f835-492b-b38d-86db3b3bae78.jpeg#align=left&display=inline&height=560&margin=%5Bobject%20Object%5D&originHeight=560&originWidth=1030&size=0&status=done&style=none&width=1030)

项目构建问题：

- `Cannot find module 'webpack-cli/bin/config-yargs'`：安装 webpack-cli 3.\* 版本；
- `loaderContext.getOptions is not a function`：loader 版本过高；

### 基本数据类型

#### ES6 数据类型

- Boolean
- Number
- String
- Array
- Function
- Object
- Symbol
- undefined
- null

#### TS 数据类型

- 以上基本类型
- void
- any
- never
- 元祖（不允许越界访问）
- 枚举（一组有名字的常量集合）
- 高级类型

##### 类型注解（类型约束）

> 相当于强类型语言中的类型声明，`(变量/函数):type`。

```typescript
/*
 * @Author: your name
 * @Date: 2021-08-16 20:50:56
 * @LastEditTime: 2021-08-16 21:22:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Note/src/datatype.ts
 */
let bool: boolean = false;
let number: number = 0;
let string: string = "";
let arr1: number[] = [1, 2, 3];
let arr2: Array<number> = [4, 5, 6];
// 联合类型
let arr3: Array<number | string> = [];
// 元祖
let tuple: [number, string] = [0, "1"];

let add = (x: number, y: number): number => x + y;
let compute = (x: number, y: number) => number;
compute = (a, b) => a - b;

let obj: object = { x: 1, y: 2 };
// obj.x = 5; // error
let obj1: { x: number; y: number } = { x: 1, y: 2 };
obj1.x = 5;

let s1: symbol = Symbol();
let s2 = Symbol();
s1 === s2; // false

let un: undefined = undefined;
let nu: null = null;
// un = 1 // error

// void
let noReturn = () => {};

// any
let x;
x = 1;
x = "1";
x = [];

// never: 永远不会有返回值
let error = () => {
  throw new Error("error");
};

// 枚举
enum Role {
  Reporter,
  Developer,
  Manager,
  Guest,
}
Role.Reporter; // 默认从0开始

enum Role2 {
  a = 1,
  b = 2,
  c = 3,
  d = 4,
  e = 5,
}

enum Char {
  a = "a",
  b = "b",
  c = "c",
}

enum Many {
  a,
  b = Char.b,
  c = 1 + 2,
  d = Math.random(),
  e = "123".length,
}

let aa: Role = 123;
let bb: Role2 = 21;
// aa === bb // false, 不同的枚举类型无法比较
```

注意：

- `undefined` 和 `null` 是所有类型的子类型，即 `undefined` 类型的变量，可以赋值给 `number` 类型的变量；
- **声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值**；
- 如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型，**如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型**；

```typescript
let myFavoriteNumber = "seven";
myFavoriteNumber = 7; // error

let myFavoriteNumber;
myFavoriteNumber = "seven";
myFavoriteNumber = 7;
```

- 在使用联合类型时，**只能访问此联合类型的所有类型里共有的属性或方法**，联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型；
