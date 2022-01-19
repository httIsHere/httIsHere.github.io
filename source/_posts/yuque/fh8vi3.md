---
title: 「TypeScript」类型检查机制
urlname: fh8vi3
date: '2021-12-21 16:06:07 +0800'
tags:
  - ts
categories:
  - Typescript
---

### 类型检查机制

辅助开发，提高开发效率。

- 类型推断
- 类型兼容性
- 类型保护

#### 类型推断

不需要指定变量类型（韩式的返回值类型），ts 可以根据某些规则自动推断类型。

- 基础类型推断

```typescript
let a = 1; // 推断为Number
```

- 最佳通用类型推断

```typescript
let a = [1, null]; // 会尽可能推断为符合当前所有类型的类型
```

- 上下文推断
  类型断言

```typescript
window.onkeydown = (event) => {
  event.button; // 报错，因为button不是键盘事件，而是鼠标事件
};
```

```typescript
interface Foo {
  bar: number;
}
let foo = {} as Foo; // 但不能滥用
```

#### 类型兼容性

> 兼容：当一个类型可以被赋值给另一个类型。
> X 兼容 Y：X（目标类型） = Y（源类型）

```typescript
let s: string = "";
s = null;
```

- 接口兼容性，源类型必须拥有目标类型的必要属性

```typescript
interface X {
  a: any;
  b: any;
}
interface Y {
  a: any;
  b: any;
  c: any;
}
let x: X = { a: 1, b: 1 };
let y: Y = { a: 1, b: 2, c: 3 };
x = y;
```

- 函数兼容性
  需要满足三个条件：

```typescript
type Handler = (a: number, b: number) => void;
function hor(handler: Handler) {
  return handler;
}
```

- 目标函数的参数个数要多于源函数的参数个数，`let handler = (a: number) => {}`，存在可选参数/剩余参数时，固定参数可兼容可选参数和剩余参数，可选参数不兼容固定参数和剩余参数。
- 参数类型必须匹配
- 目标函数的返回类型必须要与源函数的返回类型或者子类型
- 枚举兼容

```typescript
enum Fruit {
  Apple,
  Banana,
}
enum Color {
  Red,
  Yellow,
}
let fruit: Fruit.Apple = 3;
let no: number = Fruit.Apple; // 枚举和number可以相互兼容
let color: Color.Red = Fruit.Apple; // 报错，不兼容
```

- 类兼容性
  **静态成员和构造函数不参与比较**。
  如果类内存在私有成员，即便成员名称相同也不可兼容，除了父类子类之前。

```typescript
class A {
  constructor(p: number, q: number) {}
  id: number = 1;
}
class B {
  static s = 1;
  constructor(p: number) {}
  id: number = 2;
}
let a = new A(1, 2);
let b = new B(1);
a = b; // 可兼容
b = a; // 可兼容

class C extends A {}
let c = new C(2, 3);
a = c;
```

- 泛型兼容
  只有类型参数 T 在被类型成员使用时可能会影响实例的兼容性。
  泛型函数也是类似的，只要参数类型不被使用，那么实例就可以被兼容。

```typescript
interface Empty<T> {}
let obj_1: Empty<number> = {};
let obj_2: Empty<string> = {};
obj_1 = obj_2; // 兼容

interface Empty<T> {
  value: T;
}
let obj_1: Empty<number> = {};
let obj_2: Empty<string> = {};
obj_1 = obj_2; // 报错
```

> 结构之间兼容：成员少的兼容成员多的
>
> 函数之间兼容：参数多的兼容参数少的

#### 类型保护

```typescript
enum Type {
  Strong,
  Weak,
}

class Java {
  helloJava() {
    console.log("hello Java");
  }
}

class JavaScript {
  helloJavaScript() {
    console.log("hello JavaScript");
  }
}

function getLang(type: Type) {
  let lang = type === Type.Strong ? new Java() : new JavaScript();
  // 需要进行类型断言
  if ((lang as Java).helloJava) (lang as Java).helloJava;
  if ((lang as JavaScript).helloJavaScript)
    (lang as JavaScript).helloJavaScript;

  return lang;
}
```

在多个地方进行类型断言，不利于代码的可读性。

> **类型保护**：
> TS 能在特定的区块中保证变了属于某种确定的类型。
> 可以在此区块中放心地引用此类型的属性，或者调用此类型的方法。

- 使用`instanceOf`

```typescript
if (lang instanceof Java) {
  lang.helloJava();
} else {
  lang.helloJavaScript();
}
```

- 使用`in`关键字

```typescript
if ("helloJava" in lang) {
  lang.helloJava();
} else {
  lang.helloJavaScript();
}
```

- 使用`type of`，判断基本类型

```typescript
function getLang(x: string | number) {
  if (typeof x === "string") {
    console.log(x.length);
  } else {
    console.log(x + 100);
  }
  return lang;
}
```

- 类型保护函数

```typescript
// 类型保护函数
function isJava(lang: Java | JavaScript): lang is Java {
  return (lang as Java).helloJava !== undefined;
}
```
