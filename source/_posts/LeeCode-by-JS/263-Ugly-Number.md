---
title: 263.Ugly Number
date: 2021-10-15 11:55:23
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5.
> 
> Given an integer n, return true if n is an ugly number.
> 丑数就是只包含质因数 2, 3, 5 的正整数。

### 测试用例

```
Input: n = 6
Output: true
Explanation: 6 = 2 × 3
```

### 题解

```js
var isUgly = function(n) {
    if(n <= 0) return false;
    // 只能被2，3和5整除

    // 除掉所有2
    while(n % 2 === 0) {
        n /= 2;
    }
    // 除掉所有3
    while(n % 3 === 0) {
        n /= 3;
    }
    // 除掉所有5
    while(n % 5 === 0) {
        n /= 5;
    }
    return n === 1;
};
```