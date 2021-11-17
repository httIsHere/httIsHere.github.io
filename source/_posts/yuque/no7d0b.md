---
title: 「大前端」表达式
urlname: no7d0b
date: '2021-05-21 16:09:51 +0800'
tags:
  - js
categories:
  - Javascript
---

在执行过程中，真正能干活的就只有表达式语句，其它语句的作用都是产生各种结构，来控制表达式语句执行，或者改变表达式语句的意义。

> 表达式语句实际上就是一个表达式，它是由运算符连接变量或者直接量构成的。

一般来说，表达式语句要么是函数调用，要么是赋值，要么是自增、自减。

#### PrimaryExpression 主要表达式

包含了各种“直接量”，直接量就是直接用某种语法写出来的具有特定类型的值。

```javascript
"abc";
123;
null;
true;
false;
```

还能够直接量的形式定义对象，针对函数、类、数组、正则表达式等特殊对象类型，JavaScript 提供了语法层面的支持。在语法层面，function、{ 和 class 开头的表达式语句与声明语句有语法冲突，所以，我们要想使用这样的表达式，必须加上括号来回避语法冲突。

```javascript
({});
(function () {});
(class {});
[];
/abc/g;
```

Primary Expression 还可以是 this 或者变量，在语法上，把变量称作“标识符引用”。

```javascript
this;
myVar;
```

#### MemberExpression 成员表达式

通常是用于访问对象成员的。

```javascript
a.b;
a["b"];
new.target;
super.b;

f`a${b}c`; // 标签模版

new Cls(); // 不带参数的new运算
```

用标识符的属性访问和用字符串的属性访问。new.target 是个新加入的语法，用于判断函数是否是被 new 调用，super 则是构造函数中，用于访问父类的属性的语法。

**f`a${b}c`**带函数的模板，这个带函数名的模板表示把模板的各个部分算好后传递给一个函数。

```javascript
function f() {console.log(arguments}
f`a${b}c`; // Arguments[Array(2), 2, ...] => {0: ["a", "b"], 1: 2}
f`a${a}b${a}c`; // {0: ["a", "b", "c"], 1: 2, 2: 2}
f`a${a}b${a}${c}cc`; // {0: ["a", "b", "", "cc"], 1: 2, 2: 2, 3: 3}
```

`${b}`会将其他分割成数组作为函数第一个参数，然后将`${}`内的值作为之后的参数。

`new Cls();`另一个是带参数列表的 new 运算，注意，不带参数列表的 new 运算优先级更低，不属于 Member Expression。

#### NewExpression NEW 表达式

Member Expression 加上 new 就是 New Expression（当然，不加 new 也可以构成 New Expression，JavaScript 中默认独立的高优先级表达式都可以构成低优先级表达式）。这里的 New Expression 特指没有参数列表的表达式。(**有点没太看懂？？？**)

```javascript
new new Cls(1);
||
\/
new (new Cls(1)); or new (new Cls)(1);
```

实际上`new new Cls(1);`等价的是第一种：

```javascript
class Cls {
  constructor(n) {
    console.log("cls", n);
    return class {
      constructor(n) {
        console.log("returned", n);
      }
    };
  }
}

new new Cls(1)();
// cls 1
// returned undefined
```

所以 1 被当做调用 Cls 时的参数传入了。

#### CallExpression 函数调用表达式

基本形式是 Member Expression 后加一个括号里的参数列表，或者可以用上 super 关键字代替 Member Expression。

Member Expression 中的某一子结构具有函数调用，那么整个表达式就成为了一个 Call Expression。

```javascript
a.b(c);
super();

// 一些变形
a.b(c)(d)(e);
a.b(c)[3];
a.b(c).d;
a.b(c)`xyz`;
```

#### LeftHandSideExpression 左值表达式

New Expression 和 Call Expression 统称 LeftHandSideExpression，左值表达式。左值表达式就是可以放到等号左边的表达式。

#### AssignmentExpression 赋值表达式

```javascript
a = b;
a = b = c = d; // 从右往左赋值
a += b; // *=、/=、%=、+=、-=、<<=、>>=、>>>=、&=、^=、|=、**=都可以这么使用
```

#### Expression 表达式

在 JavaScript 中，表达式就是用逗号运算符连接的赋值表达式，比赋值运算优先级更低的就是逗号运算符了。

```javascript
(a = b), (b = 1), null;
```

### Final

1. 所有运算符的优先级
   一元(delete,~,!等)>算术>关系>位移>二进制位运算>逻辑>条件>赋值>逗号。
   [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators)
1. `react`源码内变量声明的意图？

```javascript
var validateFormat = function () {};

{
  validateFormat = function (format) {
    if (format === undefined) {
      throw new Error("invariant requires an error message argument");
    }
  };
}
```
