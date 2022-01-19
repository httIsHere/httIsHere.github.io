---
title: 「TypeScript」高级类型
urlname: uht9di
date: '2021-12-21 16:08:22 +0800'
tags:
  - ts
categories:
  - Typescript
---

> TS 为了保障语言的灵活性所引入的语言特性。

### 交叉类型&联合类型

#### 交叉类型

使用`&`连接。

```typescript
interface Dog {
  run(): void;
}
interface Cat {
  jump(): void;
}

// 必须实现所有属性，相当于并集
let pet: Dog & Cat = {
  run() {},
  jump() {},
};
```

#### 联合类型

声明的类型并不确定，可以为多个类型中的一个。

```typescript
let hoc_a: number | string = 1;

let hoc_a: number | string = "a";
```

##### 字面量联合类型

```typescript
let hoc_b: "a" | "b" | "c";
let hoc_c: 1 | 2 | 3;
```

##### 类的联合类型

其实只能访问公有的属性。

可以利用共有属性设计相应的类型保护区块。

![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-12-22_15-52-34.jpg#id=vBFmt&originHeight=561&originWidth=940&originalType=binary∶=1&status=done&style=none)

```typescript
function getArea(s: Shape): number {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "circle":
      return Math.PI * s.r * s.r;
    case "rectangle":
      return s.width * s.height;
    default:
      return ((e: never) => {
        throw new Error(e);
      })(s); // never检测上述分支是否全部覆盖
  }
}
```

### 索引类型

实现一个从对象内获取一些属性的值的方法。

```typescript
let hoc_obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
};

function getValues(obj: any, keys: string[]) {
  return keys.map((key) => obj[key]);
}

console.log(getValues(hoc_obj, ["a", "b"])); // [1, 2]
console.log(getValues(hoc_obj, ["a", "f"])); // [1, undefined]
```

> keyof T 表示类型 T 的所有公共属性的字面量的联合类型。

将上面函数进行一定的改造，使其能对类型进行保护。

```typescript
// keyof
interface Obj {
  a: number;
  b: string;
}

let key: keyof Obj;

// T[K]
let value: Obj["a"];
// T extends U

// 配合泛型约束
function getValues_1<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map((key) => obj[key]);
}
console.log(getValues_1(hoc_obj, ["a", "f"]));
// 不能将类型“"f"”分配给类型“"a" | "b" | "c" | "d" | "e"”
```

### 映射类型

提供从旧类型中创建新类型的方式，允许将一个类型映射成另外一个类型。

```typescript
type ReadOnlyObj = Readonly<Obj>; // 只读类型

type PartialObj = Partial<Obj>; // 可选类型

type PickObj = Pick<Obj, "a" | "b">; // 选择属性

type RecordObj = Record<"x" | "y", Obj>; // 新增类型
```

### 条件类型

由条件表达式所决定的类型。

```typescript
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type T1 = TypeName<string>;
type T2 = TypeName<string[]>;
type T3 = TypeName<string | string[]>;

type Diff<T, U> = T extends U ? never : T;

type T4 = Diff<"a" | "b" | "c", "a" | "e">; // type T4 = "b" | "c"
// 先拆解：Diff<'a', 'a' | 'e'> | Diff<'b', 'a' | 'e'> | Diff<'c', 'a' | 'e'>
// never | 'b' | 'c'
// 'b' | 'c'

type NotNull<T> = Diff<T, undefined | null>;
type T5 = NotNull<string | number | undefined | null>;
```

上述就是 TS 的两个内置类型：

- Diff -> `Exclude<T, U>`
- NotNull -> `NoNullable<T>`
- `Extract<T, U>`，抽取相同的类型

```typescript
type T6 = Extract<"a" | "b" | "c", "a" | "e">; // type T6 = "a"
```
