---
title: 326.power-of-three
date: 2021-10-21 16:18:37
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given an integer n, return true if it is a power of three. Otherwise, return false.
> 
> An integer n is a power of three, if there exists an integer x such that n == 3x.

### 题解

#### 1. 循环 （简单）

```js
var isPowerOfThree_by_loop = function(n) {
    if(n <= 0) return false;

    while(n > 1) {
        if(n % 3 === 0) {
            n = n / 3;
        } else return false;
    }
    return true;
};
```

#### 2. 对数

主要用到的是换底公式：$\log_a{b}$ = $\frac{log_c{b}}{log_c{a}}$。

所以如果n是3的对数，那么$\log_3{n}$就是整数，即将其换底$\frac{log{n}}{log{3}}$为整数。

```js
var isPowerOfThree = function(n) {
    // 之前有个2次方的判断是：!(n & (n - 1))
    if(n <= 0) return false;
    // 对数
    let tem = Math.log10(n) / Math.log10(3);
    // 如果是整数
    return (tem - Math.floor(tem)) === 0
};
```