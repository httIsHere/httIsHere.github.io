---
title: 「ROAD 6」对象
urlname: arrmd9
date: 2021-08-27 16:23:27 +0800
tags: [ROAD 6]
categories: [大前端]
---

> 并非数据存储的工具，每个对象都是唯一的。
>
> 也可以看[重学前端的对象篇](https://www.yuque.com/httishere/running/wev3mi)。

### 三要素

- `Identifier`：唯一性（唯一标识）;
- `state`：状态（描述对象）;
- `behavior`：行为（状态的改变）;

#### 小练习：

狗咬人，“咬”的行为如何使用对象抽象。

从客观出发，人的状态改变的（受伤），所以“咬”是人的行为。

> 在设计对象的状态和行为时，需要遵循“**行为改变状态**”的原则。

### JS 内的对象

`Object - [Property][Property][Property] - [prototype]`。

#### 属性：统一抽象对象状态和行为

> 运行时。

##### 数据属性：描述状态（也可以用于描述行为）；

- value：就是属性的值。
- writable：决定属性能否被赋值。
- enumerable：决定 for in 能否枚举该属性。
- configurable：决定该属性能否被删除或者改变特征值。

##### 访问器属性：描述行为；

- getter：函数或 undefined，在取属性值时被调用。
- setter：函数或 undefined，在设置属性值时被调用。
- enumerable：决定 for in 能否枚举该属性。
- configurable：决定该属性能否被删除或者改变特征值。

访问某个属性时，如果实例对象本身没有，则会继续访问对象的原型，直到原型为空或者找到为止。

#### API

- `{}` / `.` / `[]` / `Object.defineProperty`
- `Object.create` / `Object.setPrototypeOf` / `Object.getPtototypeOf`
  - Object.create 根据指定的原型创建新对象，原型可以是 null；
  - Object.getPrototypeOf 获得一个对象的原型；
  - Object.setPrototypeOf 设置一个对象的原型；
- `new` / `class` / `extends`：基于类的面向对象；
- `new` / `function` / `prototype`：运行时是原型（四不像机制 😆），最好不要使用；

#### 函数对象 Function Object

特殊的行为：`[[call]]`。

> 在 JS 内使用 function 关键字、箭头运算符或者 Function 构造器创建的对象，都会有`[[call]]`行为。

在使用`foo()`来讲对象作为函数调用时，会访问到`[[call]]`这个行为。

#### 特殊对象总结

【练习】
