---
title: 「JS」Some points
urlname: bvs01g
date: '2021-02-23 09:29:32 +0800'
tags:
  - js
categories:
  - JavaScript
---

#### 原始类型

原始类型存储的都是值，是没有函数可以调用的。
`'1'.toString()` ，其实在这种情况下，`'1'`  已经不是原始类型了，而是被强制转换成了  `String`类型也就是对象类型，所以可以调用  `toString`  函数。
`null`并不是对象类型，这是一个遗留 bug。

#### 对象类型

函数传参是传递对象指针的副本。
`typeof`判断原始类型时除了`null`其他都可以正确判断，判断对象类型时除了`function`其他都为`object`。
想判断一个对象的正确类型，可以考虑使用  `instanceof`，因为内部机制是通过原型链来判断的。

```javascript
const Person = function () {};
const p1 = new Person();
p1 instanceof Person; // true

var str = "hello world";
str instanceof String; // false

var str1 = new String("hello world");
str1 instanceof String; // true
```

对象在转换类型的时候，会调用内置的 `[[ToPrimitive]]` 函数，对于该函数来说，算法逻辑一般来说如下：

- 如果已经是原始类型了，那就不需要转换了
- 调用 `x.valueOf()`，如果转换为基础类型，就返回转换的值
- 调用 `x.toString()`，如果转换为基础类型，就返回转换的值
- 如果都没有返回原始类型，就会报错

#### this

谁调用了函数，谁就是  `this`，`this`就是函数所处的作用域。
在全局域上调用，`this`就是`window`。
对于  `new`  的方式来说，`this`  被永远绑定在了实例化对象上。

```javascript
function foo() {
  console.log(this.a);
}
var a = 1;
foo(); // => 1

const obj = {
  a: 2,
  foo: foo,
};
obj.foo(); // => 2

const c = new foo(); // => undefined
```

还有箭头函数其实是没有  `this`  的，箭头函数中的  `this`  只取决包裹箭头函数的第一个普通函数的  `this`。另外对箭头函数使用  `bind`  这类函数是无效的。
对于普通函数，不管我们给函数  `bind`  几次，函数中的  `this`  永远由第一次  `bind`  决定。
`new`  的方式优先级最高，接下来是  `bind`  这些函数，然后是  `obj.foo()`  这种调用方式，最后是  `foo`  这种调用方式，同时，箭头函数的  `this`  一旦被绑定，就不会再被任何方式所改变。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1614046497785-d7ea7875-a854-494a-b25c-5b1fccccb258.png#height=531&id=ZjQd4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=531&originWidth=744&originalType=binary∶=1&size=35164&status=done&style=none&width=744)

#### == vs ===

对于  `==`  来说，如果对比双方的类型**不一样**的话，就会进行**类型转换。**
会先判断是否在对比 `null` 和 `undefined`，是的话就会返回 `true`

```javascript
1 == '1' // => true
null == undefined // => true
[] == ![] // => true ???
```

!运算符的优先级大于 ==，所以实际上这里还涉及到!的运算。
这个比较简单！会将后面的值转化为布尔值。即![]变成!Boolean([]), 也就是!true,也就是 false。
实际上是对比 `[] == false;`
运用上面的顺序，false 是布尔值，所以转化为数值 Number(flase), 为 0。
对比`[] == 0;`
满足第三条规则[] 是对象（数组也属于对象），0 不是对象。所以 ToPrimitive([])是""
对比`"" == 0;`
满足第二条规则，"" 是字符串，0 是数值，对比 Number("") == 0, 也就是 0 == 0。
所以得出 `[] == ![]`
**所以在使用时尽量使用**`**===**`**。**
**​**

#### 闭包

[「JS」闭包](https://www.yuque.com/httishere/serhyu/hr2ubu?view=doc_embed)函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的变量，那么函数 B 就是闭包。

```javascript
function A() {
  let a = 1;
  window.B = function () {
    console.log(a);
  };
}
A();
B(); // 1
```

循环内异步事件处理：

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
// 6 6 6 6 6
// 使用let解决（推荐）
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
// 1 2 3 4 5
// 使用闭包解决
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
// 1 2 3 4 5
```

在 for 循环中使用 var，因为 var 是全局变量，所以循环结束后值会被覆盖掉。
let 有自己的作用域块，所以在 for 循环表达式中使用 let 其实就等价于在代码块中使用 let，`for (let i = 1; i <= 5; i++) { 循环体 }`在每次执行循环体之前，JS 引擎会把 i 在循环体的上下文中重新声明及初始化一次。

#### 浅拷贝 vs 深拷贝

深拷贝：这个新变量里的值都是从原来的变量中复制而来，并且和原来的变量没有关联。
浅拷贝：新变量中存在一些仍然与原来的变量有关联的值。

浅拷贝的实现：

- `Object.assign`：`let b = Object.assign({}, a);`
- `...`：`let b = { ...a };`

但是只能解决第一层问题。
深拷贝的实现：一般使用`JSON.parse(JSON.stringify(object))`，但是该方法会忽略 `undefined`，会忽略 `symbol`，不能序列化函数，不能解决循环引用的对象。
推荐：**lodash 的深拷贝函数**。

#### 原型

在一个实例对象中可以通过  `__proto__`找到一个原型对象，在该对象中定义了很多函数让我们来使用。
原型的  `constructor`  属性指向构造函数，构造函数又通过  `prototype`  属性指回原型，但是并不是所有函数都具有这个属性，`Function.prototype.bind()`就没有这个属性。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1614065706606-ab42b62d-2a07-45e3-9803-8567e9a5c042.png#height=781&id=HgNjp&margin=%5Bobject%20Object%5D&name=image.png&originHeight=781&originWidth=618&originalType=binary∶=1&size=241194&status=done&style=none&width=618)
其实原型链就是多个对象通过  `__proto__`  的方式连接了起来。为什么  `obj`  可以访问到  `valueOf`  函数，就是因为  `obj`  通过原型链找到了  `valueOf`  函数。

- `Object` 是所有对象的原型，所有对象都可以通过 `__proto__` 找到它。
- `Function` 是所有函数的原型，所有函数都可以通过 `__proto__` 找到它。
- 函数的 `prototype` 是一个对象。
- 对象的 `__proto__` 属性指向原型， `__proto__` 将对象和原型连接起来组成了原型链。

#### new

1. 新生成了一个对象
1. 链接到原型
1. 绑定 this
1. 返回新对象

#### 执行上下文

全局执行上下文，函数执行上下文，eval 执行上下文。

#### 模块化

好处：1. 解决命名冲突 2. 提供复用性 3. 提高代码可维护性。
AMD&CMD

```javascript
// AMD
define(["./a", "./b"], function (a, b) {
  // 加载模块完毕可以使用
  a.do();
  b.do();
});
// CMD
define(function (require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require("./a");
  a.doSomething();
});
```

#### 防抖

防抖和节流的作用都是防止函数多次调用。每次触发函数的间隔小于 wait，防抖的情况下只会调用一次，而节流的 情况会每隔一定时间（参数 wait）调用函数。

```javascript
// func是用户传入需要防抖的函数
// wait是等待时间
const debounce = (func, wait = 50) => {
  // 缓存一个定时器id
  let timer = 0;
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};
// 不难看出如果用户调用该函数的间隔小于wait的情况下，上一次的时间还未到就被清除了，并不会执行函数
```

```javascript
/**
 *
 * @param {*} func 要进行debouce的函数
 * @param {*} wait 等待时间,默认500ms
 * @param {*} immediate 是否立即执行
 */
function debounce(func, wait = 500, immediate = false) {
  let timeout; // 定时器
  return function () {
    let _this = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      let callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) func.apply(_this, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(_this, args);
      }, wait);
    }
  };
}
```

#### 节流

多次触发，间隔时间段执行。

```javascript
/**
 * @param {Function} func
 * @param {Int} wait
 * @param {Object} options
 */
function throttle(func, wait = 500, options) {
  let timeout, context, args;
  let previous = 0;
  if (!options) options = { leading: false, trailing: true };

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}
```

`options`

- `leading`：函数在每个等待时延的开始被调用，默认值为 false；
- `trailing`：函数在每个等待时延的结束被调用，默认值是 true；

场景：

- leading-false，trailing-true：默认情况，即在延时结束后才会调用函数；
- leading-true，trailing-true：在延时开始时就调用，延时结束后也会调用；
- leading-true, trailing-false：只在延时开始时调用；
