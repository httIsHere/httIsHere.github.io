---
title: 「大前端」语句
urlname: ang4as
date: '2021-03-11 14:04:54 +0800'
tags:
  - js
categories:
  - Javascript
---

比较常见的语句包括变量声明、表达式、条件、循环等。

## Completion 类型

q: 在 try 中有 return 语句，finally 中的内容还会执行吗？

```javascript
function foo() {
  try {
    return 0;
  } catch (err) {
  } finally {
    console.log("a");
  }
}

console.log(foo()); // a 0
```

虽然 return 执行了，但是函数并没有立即返回，又执行了 finally 里面的内容。

```javascript
function foo() {
  try {
    return 0;
  } catch (err) {
  } finally {
    return 1;
  }
}

console.log(foo()); // 1
```

finally 中的 return “覆盖”了 try 中的 return。在一个函数中执行了两次 return。

这一机制的基础正是 JavaScript 语句执行的完成状态，我们用一个标准类型来表示：Completion Record（我在类型一节提到过，Completion Record 用于描述异常、跳出等语句执行过程）。

Completion Record 表示一个语句执行完之后的结果，它有三个字段：

- [[type]] 表示完成的类型，有 break continue return throw 和 normal 几种类型；
- [[value]] 表示语句的返回值，如果语句没有，则是 empty；
- [[target]] 表示语句的目标，通常是一个 JavaScript 标签（标签在后文会有介绍）。

JavaScript 正是依靠语句的 Completion Record 类型，方才可以在语句的复杂嵌套结构中，实现各种控制。

### 语句的分类

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1615445223702-799e3ef7-c111-4ed4-9e2b-47168c33f138.jpeg#align=left&display=inline&height=872&margin=%5Bobject%20Object%5D&originHeight=872&originWidth=555&size=0&status=done&style=none&width=555)

#### 普通的语句

不带控制能力的语句称为普通语句。普通语句有下面几种：

- 声明类语句
  - var 声明
  - const 声明
  - let 声明
  - 函数声明
  - 类声明
- 表达式语句
- 空语句
- debugger 语句

这些语句在执行时，从前到后顺次执行（我们这里先忽略 var 和函数声明的预处理机制），没有任何分支或者重复执行逻辑。

普通语句执行后，会得到 [[type]] 为 normal 的 Completion Record，JavaScript 引擎遇到这样的 Completion Record，会继续执行下一条语句（这些语句中，只有表达式语句会产生 [[value]]，但是从引擎控制的角度，这个 value 并没有什么用处）。

在 Chrome 等浏览器的控制台内输入一个`var a = 1`的语句，往往会得到一个 undefined 的输出，这就是语句的 Completion Record 的[[value]]。

#### 语句块

语句块就是拿大括号括起来的一组语句，它是一种语句的复合结构，可以嵌套。

语句块本身并不复杂，需要注意的是语句块内部的语句的 Completion Record 的[[type]] 如果不为 normal，会打断语句块后续的语句执行。

return 语句可能产生 return 或者 throw 类型的 Completion Record。

内部为普通语句的语句块：

```javascript
{
  var i = 1; // normal, empty, empty
  i++; // normal, 1, empty
  console.log(i); //normal, undefined, empty
} // normal, undefined, empty
```

加入 return：

```javascript
{
  var i = 1; // normal, empty, empty
  return i; // return, 1, empty
  i++;
  console.log(i);
} // return, 1, empty
```

在 block 中插入了一条 return 语句，就会产生了一个非 normal 记录，那么整个 block 会成为非 normal。这个结构就保证了非 normal 的完成类型可以穿透复杂的语句嵌套结构，产生控制效果。

#### 控制类语句

控制型语句带有 if、switch 关键字，它们会对不同类型的 Completion Record 产生反应。

控制类语句分成两部分，一类是对其内部造成影响，如 if、switch、while/for、try。

另一类是对外部造成影响如 break、continue、return、throw。

这两类语句的配合，会产生控制代码执行顺序和执行逻辑的效果。

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1615445223714-4291ff93-7e23-48f4-a44b-69ab8dcc847b.png#align=left&display=inline&height=463&margin=%5Bobject%20Object%5D&originHeight=463&originWidth=840&size=0&status=done&style=none&width=840)

穿透：如 break 只对循环、switch-case 有用，如果在 if 代码块内，break 的作用可以理解成穿透 if 代码块，去外面寻找最新的循环（switch）。

消费：正好在这个条件下起作用了，比方 break 在 for 循环内被执行了，跳出循环。

特殊处理：例如开头的例子，finally 中的内容必须保证执行，所以 try/catch 执行完毕，即使得到的结果是非 normal 型的完成记录，也必须要执行 finally。而当 finally 执行也得到了非 normal 记录，则会使 finally 中的记录作为整个 try 结构的结果。

#### 带标签的语句

Completion Record 中的 target 涉及了 JavaScript 中的一个语法，带标签的语句。

实际上，任何 JavaScript 语句是可以加标签的，在语句前加冒号即可：`firstStatement: var i = 1;`

大部分时候，这个东西类似于注释，没有任何用处。唯一有作用的时候是：与完成记录类型中的 target 相配合，**用于跳出多层循环**。

```javascript
outer: while (true) {
  inner: while (true) {
    break outer;
  }
}
console.log("finished");

let a = 0;
outer: while (a++ < 10) {
  console.log(`outer: ${a}`);
  inner: while (a++ < 5) {
    console.log(`inner: ${a}`);
    if (a === 3) break outer; // 若不带outer，则自动跳出最近的一层循环体
  }
}
console.log("finished");
// outer: 1
// inner: 2
// inner: 3
// finished
```

break/continue 语句如果后跟了关键字，会产生带 target 的完成记录。一旦完成记录带了 target，那么只有拥有对应 label 的循环语句会消费它。

普通场景下：

> break 语句可以跳出当前循环； break 语句通常配合 if，在满足条件时提前结束整个循环； break 语句总是跳出最近的一层循环； continue 语句可以提前结束本次循环，进入下次循环； continue 语句通常配合 if，在满足条件时提前结束本次循环。
