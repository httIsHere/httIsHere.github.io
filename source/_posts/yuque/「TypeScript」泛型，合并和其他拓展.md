---
title: 「TypeScript」泛型，合并和其他拓展
urlname: pu3zmq
date: 2021-08-23 17:40:03 +0800
tags: [ts]
categories: [Typescript]
---

### 泛型

> 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```typescript
function createArray(length: number, value: any): Array<any> {
  let result = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

createArray(3, "x"); // ['x', 'x', 'x']
```

上面是用数组泛型来定义返回值的类型，但是一个显而易见的缺陷是，它并没有准确的定义返回值的类型：

`Array<any>` 允许数组的每一项都为任意类型。但是我们预期的是，数组中每一项都应该是输入的 `value` 的类型。

```typescript
function createArray<T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}
createArray<string>(3, "x"); // ['x', 'x', 'x']
```

其中 `T` 用来指代任意输入的类型。

如果在调用时不手动指定具体类型的话，也可以根据类型推论自动推断出来。

#### 多个类型参数

```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

swap([7, "seven"]); // ['seven', 7]
```

#### 泛型约束

在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法：

```typescript
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);
  return arg;
} // error
```

可以对泛型进行约束，只允许这个函数传入那些包含 `length` 属性的变量。这就是泛型约束：

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

如果传入的参数不包含 length 属性，那么在编译阶段就会报错。

多个类型参数之间也可以互相约束：

```typescript
function copyFields<T extends U, U>(target: T, source: U): T {
  for (let id in source) {
    target[id] = (<T>source)[id];
  }
  return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };

copyFields(x, { b: 10, d: 20 });
```

#### 泛型接口

使用接口的方式来定义一个函数需要符合的形状：

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function (source: string, subString: string) {
  return source.search(subString) !== -1;
};
```

```typescript
interface CreateArrayFunc {
  <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function <T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
};

createArray(3, "x"); // ['x', 'x', 'x']
```

```typescript
interface CreateArrayFunc<T> {
  (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function <T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
};

createArray(3, "x"); // ['x', 'x', 'x']
```

#### 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

#### 泛型参数的默认类型

可以为泛型中的类型参数指定默认类型，当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

```typescript
function createArray<T = string>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}
```

### 声明合并

如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型。

#### 函数合并

使用重载定义多个函数类型：

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
```

#### 接口合并

```typescript
interface Alarm {
  price: number;
}
interface Alarm {
  price: string; // 属性名相同，但是类型不一致，会报错
  weight: number;
}
```

**合并的属性的类型必须是唯一的**。

接口中方法的合并，与函数的合并一样：

```typescript
interface Alarm {
  price: number;
  alert(s: string): string;
}
interface Alarm {
  weight: number;
  alert(s: string, n: number): string;
}
```

#### 类的合并

同接口合并规则。

### 拓展

- [Never](http://www.typescriptlang.org/docs/handbook/basic-types.html#never)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Basic](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Basic) Types.html#never)）：永远不存在值的类型，一般用于错误处理函数
- [Variable Declarations](http://www.typescriptlang.org/docs/handbook/variable-declarations.html)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Variable](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Variable) Declarations.html)）：使用 `let` 和 `const` 替代 `var`，这是 [ES6 的知识](http://es6.ruanyifeng.com/#docs/let)`[this](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Functions.html#this)`：箭头函数的运用，这是 [ES6 的知识](http://es6.ruanyifeng.com/#docs/function)[Using Class Types in Generics](http://www.typescriptlang.org/docs/handbook/generics.html#using-class-types-in-generics)（[中文版](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Generics.html#%E5%9C%A8%E6%B3%9B%E5%9E%8B%E9%87%8C%E4%BD%BF%E7%94%A8%E7%B1%BB%E7%B1%BB%E5%9E%8B)）：创建工厂函数时，需要引用构造函数的类类型
- [Best common type](http://www.typescriptlang.org/docs/handbook/type-inference.html#best-common-type)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Type](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Type) Inference.html#最佳通用类型)）：数组的类型推论
- [Contextual Type](http://www.typescriptlang.org/docs/handbook/type-inference.html#contextual-type)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Type](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Type) Inference.html#上下文类型)）：函数输入的类型推论
- [Type Compatibility](http://www.typescriptlang.org/docs/handbook/type-compatibility.html)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Type](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Type) Compatibility.html)）：允许不严格符合类型，只需要在一定规则下兼容即可
- [Advanced Types](http://www.typescriptlang.org/docs/handbook/advanced-types.html#intersection-types)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Advanced](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Advanced) Types.html#交叉类型（intersection-types）)）：使用 `&` 将多种类型的共有部分叠加成一种类型
- [Type Guards and Differentiating Types](http://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Advanced](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Advanced) Types.html#类型保护与区分类型（type-guards-and-differentiating-types）)）：联合类型在一些情况下被识别为特定的类型
- [Discriminated Unions](http://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Advanced](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Advanced) Types.html#可辨识联合（discriminated-unions）)）：使用 `|` 联合多个接口的时候，通过一个共有的属性形成可辨识联合
- [Polymorphic ](http://www.typescriptlang.org/docs/handbook/advanced-types.html#polymorphic-this-types)[this](http://www.typescriptlang.org/docs/handbook/advanced-types.html#polymorphic-this-types)[ types](http://www.typescriptlang.org/docs/handbook/advanced-types.html#polymorphic-this-types)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Advanced](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Advanced) Types.html#多态的 this 类型)）：父类的某个方法返回 `this`，当子类继承父类后，子类的实例调用此方法，返回的 `this` 能够被 TypeScript 正确的识别为子类的实例。
- [Symbols](http://www.typescriptlang.org/docs/handbook/symbols.html)（[中文版](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Symbols.html)）：新原生类型，这是 [ES6 的知识](http://es6.ruanyifeng.com/#docs/symbol)
- [Iterators and Generators](http://www.typescriptlang.org/docs/handbook/iterators-and-generators.html)（[中文版]([https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Iterators](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Iterators) and Generators.html)）：迭代器，这是 [ES6 的知识](http://es6.ruanyifeng.com/#docs/iterator)
- [Namespaces](http://www.typescriptlang.org/docs/handbook/namespaces.html)（[中文版](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Namespaces.html)）：避免全局污染，现在已被 [ES6 Module](http://es6.ruanyifeng.com/#docs/module) 替代
- [Decorators](http://www.typescriptlang.org/docs/handbook/decorators.html)（[中文版](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Decorators.html)）：修饰器，这是 [ES7 的一个提案](http://es6.ruanyifeng.com/#docs/decorator)
- [Mixins](http://www.typescriptlang.org/docs/handbook/mixins.html)（[中文版](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Mixins.html)）：一种编程模式，与 TypeScript 没有直接关系，可以参考 [ES6 中 Mixin 模式的实现](http://es6.ruanyifeng.com/#docs/class#Mixin%E6%A8%A1%E5%BC%8F%E7%9A%84%E5%AE%9E%E7%8E%B0)
