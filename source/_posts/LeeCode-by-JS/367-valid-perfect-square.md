---
title: 367.valid-perfect-square
date: 2021-11-19 10:16:04
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given a positive integer num, write a function which returns True if num is a perfect square else False.
> 
> Follow up: Do not use any built-in library function such as sqrt.

### 测试用例

```bash
Input: num = 16
Output: true
```

### 题解

暴力循环。

```js
var isPerfectSquare = function(num) {
    if(num === 1) return true;
    let n = Math.floor(num / 2);
    for(let i = 1; i <= n; i++) {
        if(num === i * i) {
            return true;
        }
    }
    return false;
};
```

### 结果

> Accepted
> 
> 70/70 cases passed (1640 ms)
> 
> Your runtime beats 19.81 % of javascript submissions
> 
> Your memory usage beats 11.62 % of javascript submissions (39.1 MB)