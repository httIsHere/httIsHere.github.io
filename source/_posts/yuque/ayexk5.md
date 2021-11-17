---
title: 「Daily Keyword」super
urlname: ayexk5
date: '2021-08-26 19:11:25 +0800'
tags:
  - Daily Keyword
categories:
  - Daily
---

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1629978419016-829b2e70-dd37-4164-ac6f-b0a50120b7d5.png#clientId=ubdb8219d-e5d5-4&from=paste&height=301&id=u2466a3b1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=601&originWidth=804&originalType=binary∶=1&size=328744&status=done&style=none&taskId=uf53500d3-7e8c-44a2-b6d6-67dd2f42910&width=402)

> 参考：[super](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super)，[What is super() in JavaScript?](https://css-tricks.com/what-is-super-in-javascript/)

#### 用法：

```javascript
super([arguments]);
// 调用 父对象/父类 的构造函数

super.functionOnParent([arguments]);
// 调用 父对象/父类 上的方法
```

> **super**关键字用于访问和调用一个对象的父对象上的函数。
> 在构造函数中使用时，super 关键字将单独出现，并且必须**在使用 this 关键字之前使用**。super 关键字也可以用来调用父对象上的函数。

####

#### 使用：

```javascript
class Polygon {
  constructor(height, width) {
    this.name = "Rectangle";
    this.height = height;
    this.width = width;
    console.log(height, width);
  }
}
class Square extends Polygon {
  constructor(length) {
    super(length, length);
  }
}
let sqare = new Square(30);
// 30 30

class Square2 extends Polygon {
  constructor(length) {
    this.height = length; // Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
    super(length, length);
    this.name = "Square";
  }
}
```

调用父类的方法：

```javascript
class Rectangle {
  constructor() {}
  static logNbSides() {
    return "I have 4 sides";
  }
}

class Square extends Rectangle {
  constructor() {}
  static logDescription() {
    return super.logNbSides() + " which are all equal";
  }
}
Square.logDescription(); // 'I have 4 sides which are all equal'
```

#### 注意：

##### 不能删除 super 上的属性

```javascript
class Base {
  constructor() {}
  foo() {}
}
class Derived extends Base {
  constructor() {}
  delete() {
    delete super.foo; // this is bad
  }
}
```

##### super.prop 不能覆写不可写属性：

```javascript
class X {
  constructor() {
    Object.defineProperty(this, "prop", {
      configurable: true,
      writable: false, // read only
      value: 1,
    });
  }
}

class Y extends X {
  constructor() {
    super();
  }
  foo() {
    super.prop = 2; // Cannot overwrite the value.
  }
}
```
