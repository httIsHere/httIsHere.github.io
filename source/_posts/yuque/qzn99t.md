---
title: 「TypeScript」类型别名，字面量，元组，枚举
urlname: qzn99t
date: '2021-08-20 14:52:43 +0800'
tags:
  - ts
categories:
  - TypeScript
---

### 类型别名

> 给一个类型起个新名字，类型别名常用于联合类型。

```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}
```

### 字符串字面量类型

> 用来约束取值只能是某几个字符串中的一个。

```typescript
type EventNames = "click" | "scroll" | "mousemove";
function handleEvent(ele: Element, event: EventNames) {
  // do something
}

handleEvent(document.getElementById("hello"), "scroll"); // success
handleEvent(document.getElementById("world"), "dblclick"); // error，event 不能为 'dblclick'
```

注：**类型别名与字符串字面量类型都是使用 **`**type**`** 进行定义。**

### 元组

> 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

```typescript
let tom: [string, number] = ["Tom", 25];
```

当直接对元组类型的变量进行初始化或者赋值时：

```typescript
let tom: [string, number];
tom = ["Tom", 25];
tom = ["Tom"]; // error，需要提供所有元组类型中指定的项。

tom.push(true); // error，当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型
```

### 枚举

> 用于取值被限定在一定范围内的场景。

#### 默认赋值

默认从 0 开始赋值：

```typescript
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
Days["Sun"] === 0; // true
```

#### 手动赋值

未手动赋值的枚举项会接着上一个枚举项递增：

```typescript
enum Days {
  Sun = 7,
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

Days["Sat"] === 6; // true

// 手动赋值的枚举项也可以为小数或负数，依旧以1递增
enum Days {
  Sun = 7,
  Mon = 1.5,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
Days["Tue"]; // 2.5
```

如果未手动赋值的枚举项与手动赋值的重复，则后赋值的会覆盖前赋值：

```typescript
enum Days {
  Sun = 3,
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
Days["Sun"]; // 3
Days["Wed"]; // 3
Days[3]; // Wed
Days[3] === "Sun"; // false
```

所以需要注意**不要出现赋值覆盖**的情况。

#### 常数项和计算所得项

> 枚举项有两种类型：常数项（constant member）和计算所得项（computed member）。

以上两种情况就是常数项。

计算所得项：

```typescript
enum Color {
  Red,
  Green,
  Blue = "blue".length,
}
```

但是**如果紧接在计算所得项后面的是未手动赋值的项，那么它就会因为无法获得初始值而报错**：

```typescript
enum Color {
  Red = "red".length,
  Green,
  Blue,
}

// index.ts(1,33): error TS1061: Enum member must have initializer.
// index.ts(1,40): error TS1061: Enum member must have initializer.
```

> 当满足以下条件时，枚举成员被当作是常数：
>
> - 不具有初始化函数并且之前的枚举成员是常数。在这种情况下，当前枚举成员的值为上一个枚举成员的值加 `1`。但第一个枚举元素是个例外。如果它没有初始化方法，那么它的初始值为 `0`。
> - 枚举成员使用常数枚举表达式初始化。常数枚举表达式是 TypeScript 表达式的子集，它可以在编译阶段求值。当一个表达式满足下面条件之一时，它就是一个常数枚举表达式：
>   - 数字字面量
>   - 引用之前定义的常数枚举成员（可以是在不同的枚举类型中定义的）如果这个成员是在同一个枚举类型中定义的，可以使用非限定名来引用
>   - 带括号的常数枚举表达式
>   - `+`, `-`, `~` 一元运算符应用于常数枚举表达式
>   - `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^` 二元运算符，常数枚举表达式做为其一个操作对象。若常数枚举表达式求值后为 NaN 或 Infinity，则会在编译阶段报错

> 所有其它情况的枚举成员被当作是需要计算得出的值。

#### 常数枚举 `const enum`

它会在编译阶段被删除，并且不能包含计算成员。

```typescript
const enum Directions {
  Up,
  Down,
  Left,
  Right,
}
```

#### 外部枚举 `declare enum`

```typescript
declare enum Directions {
  Up,
  Down,
  Left,
  Right,
}
```

`declare` 定义的类型只会用于编译时的检查，编译结果中会被删除。
