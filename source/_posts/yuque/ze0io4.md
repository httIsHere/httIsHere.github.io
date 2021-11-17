---
title: 「Daily Keyword」instanceof
urlname: ze0io4
date: '2021-08-27 09:40:20 +0800'
tags:
  - Daily Keyword
categories:
  - Daily
---

> 参考：[instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)

> ​ 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

​

#### 用法

```javascript
object instanceof constructor(构造函数);
```

> 用来检测 constructor.prototype 是否存在于参数 object 的原型链上。

```javascript
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const auto = new Car("Honda", "Accord", 1998);

auto instanceof Car; // true
```

#### 注意

- 表达式 `obj instanceof Foo` 返回 true，则并不意味着该表达式会永远返回 true，因为`Foo.prototype`属性的值有可能会改变，改变之后的值很有可能不存在于 obj 的原型链上，这时原表达式的值就会成为 false。

```javascript
function C() {}

var o = new C();

o instanceof C;
// true，因为 Object.getPrototypeOf(o) === C.prototype

C.prototype = {};
var o2 = new C();

o2 instanceof C; // true

o instanceof C;
// false，C.prototype 指向了一个空对象,这个空对象不在 o 的原型链上.
```

- 在改变对象 obj 的原型链的情况下原表达式的值可能也会改变，虽然在目前的 ES 规范中，我们只能读取对象的原型而不能改变它，但借助于非标准的 `__proto__`伪属性，是可以实现的。比如执行`obj.__proto__ = {}`之后，`obj instanceof Foo`就会返回 false 了。

​

​
