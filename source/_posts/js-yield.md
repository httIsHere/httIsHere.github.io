---
title: 「js」 yield关键词
date: 2020-04-19 16:11:03
tags:
  - js
categories:
  - js
---

> yield 关键字用来暂停和恢复一个生成器函数（(function\* 或遗留的生成器函数）。

- yield 是 ES6 的新关键字，使生成器函数执行暂停，yield 关键字后面的表达式的值返回给生成器的调用者。它可以被认为是一个基于生成器的版本的 return 关键字。
- yield 关键字实际返回一个 IteratorResult（迭代器）对象，它有两个属性，value 和 done，value 属性是对 yield 表达式求值的结果，而 done 是 false，表示生成器函数尚未完全完成。
- yield 无法单独工作，需要配合 generator(生成器)的其他函数，如 next，懒汉式操作，展现强大的主动控制特性。

### 语法

> [rv] = yield [expression];

- expression

  定义通过迭代器协议从生成器函数返回的值。如果省略，则返回 undefined。

- rv

  返回传递给生成器的 next()方法的可选值，以恢复其执行。

### 使用

生成器函数的声明例子:

```js
function* countAppleSales() {
  var saleList = [3, 7, 5];
  for (var i = 0; i < saleList.length; i++) {
    yield saleList[i];
  }
}
var appleStore = countAppleSales(); // Generator { }
console.log(appleStore); // countAppleSales {<closed>}
console.log(appleStore.next()); // { value: 3, done: false }
console.log(appleStore.next()); // { value: 7, done: false }
console.log(appleStore.next()); // { value: 5, done: false }
console.log(appleStore.next()); // { value: undefined, done: true }
```

- yield 并不能直接生产值，而是产生一个等待输出的函数
- 除 IE 外，其他所有浏览器均可兼容（包括 win10 的 Edge）
- 某个函数包含了 yield，意味着这个函数已经是一个 Generator
- 如果 yield 在其他表达式中，需要用()单独括起来
- yield 表达式本身没有返回值，或者说总是返回 undefined(由 next 返回)
- next()可无限调用，但既定循环完成之后总是返回 undeinded

注意不要在判断中调用 next, 这个本身也是在消耗 next 迭代:

```js
// 每次调用next都会被消耗, 所以下面一个循环会消耗两次next
while (!appleStore.next().done) {
  appleStore.next();
}
```

### 深入理解

```js
function* test(x) {
  let y = 2 * (yield x + 1);
  let z = yield y / 3;
  console.log(`x = ${x}, y = ${y}, z = ${z}`);
  return x + y + z;
}
var a_test = test(5);
a_test.next(); // {value: 6, done: false}
a_test.next(); // {value: NaN, done: false}
a_test.next(); // x = 5, y = NaN, z = undefined {value: NaN, done: false}

var b_test = test(5);
b_test.next(); // {value: 6, done: false}
b_test.next(6); // {value: 4, done: false}
b_test.next(7); // x = 5, y = 12, z = 7 {value: 24, done: true}
```

**next() 传参是对 yield 整体的传参，否则 yield 类似于 return**

#### a_test

1. x 恒为 5, 第一次调用可得到对应的一个 yield 返回值: yield (x + 1), 相当于 return x + 1;
2. 第二次调用无参数传入, y = 2 \* undefined 即为 NaN, 所以无法得到 z;
3. 同上;

#### b_test

1. x 恒为 5, 第一次调用可得到对应的一个 yield 返回值: yield (x + 1), 相当于 return x + 1;
2. 第二次调用, 传入 6, yield (x + 1) = 入参, y = 2 \* 6 = 12, 并得到第二个 yield 返回: yield (y / 3) 即 4;
3. 第三次调用, 传入 7, yield (y / 3) = 入参, 所以 z = 7, 并得到返回值(x + y + z) = 24;

#### next()函数及参数

在 js 中，虽然借鉴了 python 的函数，但是也进行了自己的改造，由于没有 send()函数，所以无法直接传递 yield 的值。

next()可以带一个参数，该参数会被认为是上一个 yield 整体的返回值，稍后将在代码中展示。

在某种程度上，next()可以直接当做 send()使用

它的意义在于，可以**在不同阶段从外部直接向内部注入不同的值来调整函数**的行为(这一点是其他循环很难做到的，或要付出较大的代价才可以做到)

参考: [深入理解 js 中的 yield](https://www.jianshu.com/p/36c74e4ca9eb)

### 相关 function\*

> function\* 定义一个生成器函数 (generator function)，它返回一个 Generator 对象。

生成器函数在执行时能暂停，后面又能从暂停处继续执行。

调用一个生成器函数并不会马上执行它里面的语句，而是返回一个这个生成器的 迭代器 （ iterator ）对象。当这个迭代器的 next() 方法被首次（后续）调用时，其内的语句会**执行到第一个（后续）出现 yield 的位置**为止，yield 后紧跟迭代器要返回的值。或者如果用的是 yield\*（多了个星号），则表示将执行权移交给另一个生成器函数（当前生成器暂停执行）。

调用 next()方法时，如果传入了参数，那么这个参数会传给上一条执行的 yield 语句左边的变量。

#### yield*

```js
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i){
  yield i;
  yield* anotherGenerator(i);// 移交执行权, 执行完回来
  yield i + 10;
}

var gen = generator(10);

console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // 13
console.log(gen.next().value); // 20
```

#### 生成器函数不能当构造器使用

```js
function* f() {}
var obj = new f; // throws "TypeError: f is not a constructor"
```