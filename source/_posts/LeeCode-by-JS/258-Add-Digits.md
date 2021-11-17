---
title: 258.Add Digits
date: 2021-10-15 11:02:42
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### 描述

> Given an integer num, repeatedly add all its digits until the result has only one digit, and return it.
> 给定一个非负整数 num，反复将各个位上的数字相加，直到结果为一位数。

### 测试用例

```bash
Input: num = 38
Output: 2
Explanation: The process is
38 --> 3 + 8 --> 11
11 --> 1 + 1 --> 2 
Since 2 has only one digit, return it.
```

### 题解

#### 1. 简单循环暴力解法

```js
var addDigits = function(num) {
    if(num < 10) return num;

    while(num >= 10) {
        let sum = 0, cur = num;
        while(cur >= 10) {
            sum += cur % 10;
            cur = Math.floor(cur / 10);
        }
        sum += cur;
        num = sum;
    }
    return num;
};
```

#### 2. Do it without any loop/recursion in O(1) runtime

[参考解法](https://blog.csdn.net/weixin_44485744/article/details/104114182)

```js
var addDigits = function(num) {
    // ! 38 = 3*10 + 8 = 3*9 + 3 + 8(各位相加为 3 + 8,即减小了9的3倍)
    // 每次都减少9的倍数
    return (num - 1) % 9 + 1;
}
```