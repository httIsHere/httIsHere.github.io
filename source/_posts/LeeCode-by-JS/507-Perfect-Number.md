---
title: 507.Perfect-Number
date: 2021-11-02 14:51:33
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> A perfect number is a positive integer that is equal to the sum of its positive divisors, excluding the number itself. A divisor of an integer x is an integer that can divide x evenly.
> 
> Given an integer n, return true if n is a perfect number, otherwise return false.

### 测试用例

```bash
Input: num = 28
Output: true
# Explanation: 28 = 1 + 2 + 4 + 7 + 14
# 1, 2, 4, 7, and 14 are all divisors of 28.
```

### 题解

完全数刚好等于他所有质子的和。

所以需要求出该数所有的质子。

```js
var checkPerfectNumber = function (num) {
  let sum = 0;
  // 完全数除以自己一半，求余肯定会大于0，所以用num/2
  for (let j = 1; j <= num / 2; j++) {
    if (num % j === 0) {
      sum += j;
    }
  }
  return sum === num;
};
```

### 结果

> Accepted
> 
> 98/98 cases passed (1776 ms)
> 
> Your runtime beats 57.95 % of javascript submissions
> 
> Your memory usage beats 47.02 % of javascript submissions (38.8 MB)