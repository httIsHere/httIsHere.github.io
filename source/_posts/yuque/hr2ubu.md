---
title: 「JS」闭包
urlname: hr2ubu
date: '2020-10-13 09:37:32 +0800'
tags:
  - js
categories:
  - JavaScript
---

> 闭包是指有权访问另外一个函数作用域的变量的函数。——《JavaScript 高级程序设计》

闭包的特点首先是函数，其次是它可以访问到父级作用域的变量对象，即使父级函数完成调用后"**理应出栈销毁**"。

> 闭包是指那些能够访问自由变量的函数。——MDN

教程：[前端进击的巨人（三）：从作用域走进闭包](https://segmentfault.com/a/1190000017948999)

创建闭包的常见方式，就是在一个函数内部创建另一个函数。
一般闭包的出现：

- **函数作为参数传递**
- **函数作为返回值传递**

```javascript
function foo() {
  var fooVal = "2019";
  var bar = function () {
    console.log(fooVal); // bar中使用到了自由变量fooVal
  };
  return bar; // 函数作为参数返回
}

var getValue = foo();
getValue(); // 2019
```

通过闭包，我们在外部环境也可以获取到变量`fooVal`，虽然`foo()`函数执行完成了，但它并没从函数调用栈中销毁，其变量对象存储仍然可以通过`getValue()`能被访问到。
`**bar**`之所以还能够访问这个变量，是因为内部函数的作用域链中包含`foo()`的作用域。
![](https://cdn.nlark.com/yuque/0/2020/png/250093/1603071589551-06a0d76c-c935-4ec5-a86e-0ad36f703498.png#height=362&id=lQNvY&margin=%5Bobject%20Object%5D&name=&originHeight=362&originWidth=800&originalType=binary∶=1&size=0&status=done&style=none&width=800)
为什么`foo`执行完成没有出栈？
​

> 当某个函数被调用时，会创建一个执行环境（execution context）及相应的作用域链。然后，使用 arguments 和其他命名参数的值来初始化函数的活动对象（activation object）。但在作用域链中，外部函数的活动对象始终处于第二位，外部函数的外部函数的活动对象处于第三位，……直至作为作用域链终点的全局执行环境。

```javascript
function compare(value1, value2) {
  if (value1 < value2) {
    return -1;
  } else if (value1 > value2) {
    return 1;
  } else {
    return 0;
  }
}
var result = compare(5, 10);
```

全局环境内有 compare 和 result 两个变量对象。
![截屏2020-10-19 上午10.13.38.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1603073630621-14fadda5-8c75-4bc8-89f7-5c2d2a54aea9.png#height=694&id=b1YBl&margin=%5Bobject%20Object%5D&name=%E6%88%AA%E5%B1%8F2020-10-19%20%E4%B8%8A%E5%8D%8810.13.38.png&originHeight=694&originWidth=1716&originalType=binary∶=1&size=103808&status=done&style=none&width=1716)
**由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存。过度使用闭包可能会导致内存占用过多。**
**​**

```javascript
function createFunctions() {
  var result = new Array();
  for (var i = 0; i < 10; i++) {
    result[i] = function () {
      return i;
    };
  }
  return result;
}
```

每个匿名函数的作用域链中都保存着 createFunctions() 函数的活动对象，所以它们引用的都是同一个变量 i 。 当 createFunctions()函数返回后，变量 i 的值是 10，此时每个函数都引用着保存变量 i 的同一个变量对象，所以在每个函数内部 i 的值都是 10。
通过创建另一个匿名函数：
÷
