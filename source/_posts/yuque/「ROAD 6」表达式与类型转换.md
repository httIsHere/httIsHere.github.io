---
title: 「ROAD 6」表达式与类型转换
urlname: dpsto8
date: 2021-08-20 17:13:25 +0800
tags: [ROAD 6]
categories: [大前端]
---

### 表达式

运算符的优先级，为了使代码逻辑更加符合普遍认知。

#### Member（成员访问）

- a.b
- a[b]
- foo`string`
  ![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-08-18_17-13-03.jpg#id=J2SD5&originHeight=284&originWidth=1068&originalType=binary∶=1&status=done&style=none)

```javascript
let a = "httishere";
function foo() {
  console.log(arguments);
}

foo`hello ${a}`;
```

- super.b
- Super[b]
- new target：可以判断当前函数是否是被 new 的方式调用
- new Foo()

#### New

- new Foo：优先级与上述的 new 不同，带括号的前面的 new 的优先级更高，即`new new Foo()`等价于`new (new Foo())` 而非`(new new Foo)()`。
  ![](https://gitee.com/httishere/blog-image/raw/master/img/Xnip2021-08-18_17-26-20.jpg#id=z5XVi&originHeight=166&originWidth=532&originalType=binary∶=1&status=done&style=none)

```javascript
function cls1(s) {
  console.log(s);
}
function cls2(s) {
  console.log(`cls2_${s}`);
  return cls1;
}
new new cls2("httishere")();
```

#### Call

- foo()
- super()
- foo()['b']
- foo().b

#### 右值表达式

- a++
- a--
- ++a
- --a

#### 单目运算

- delete a
- void foo()：在 js 内`void`为运算符，将所有都变成 undefined，如果需要生成一个 undefined 值，可以使用`void 0`。
  [void mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/void)

```javascript
for (let i = 0; i < 10; i++) {
  let btn = document.createElement("button");
  document.body.appendChild(btn);
  btn.innerHTML = i;
  void (function (i) {
    btn.onclick = function () {
      console.log(i);
    };
  })(i);
}

// 实际上也可以使用以下用法
(function (i) {
  btn.onclick = function () {
    console.log(i);
  };
})(i);
// 但是，如果上一行代码末尾未加分号则会产生相应的问题
// 所以推荐使用void来执行立即执行函数
```

- typeof a

```javascript
typeof null; // "object"
```

- +a
- -a
- ~a
- !a：会进行类型转换；
- await a

#### 其他运算

- 指数运算，`**`：`2**3`即 2 的 3 次方，他是唯一的右结合运算符：

```javascript
2 ** (3 ** 2);
// 等价于
2 ** (3 ** 2);
```

- 乘法类，`*, /, %`
- 加法类，`+, -`
- 移位，`<<, >>, >>>`
- 比较，`<, >, <=, >=, instanceof, in`
- 逻辑运算，`&&, ||`
- 三目运算，`?:`
- 等于，`==,!=, ===, !==`
- 位运算，`&, ^, |`

> 运行时的加法：number 的加法，string 的加法。

### 类型转换

[https://www.yuque.com/httishere/running/nhlvq8#ibc7E](https://www.yuque.com/httishere/running/nhlvq8#ibc7E)
