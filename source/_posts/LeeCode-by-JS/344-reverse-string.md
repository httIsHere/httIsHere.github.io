---
title: 344.reverse-string
date: 2021-11-17 15:45:46
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Write a function that reverses a string. The input string is given as an array of characters s.
> 
> You must do this by modifying the input array in-place with O(1) extra memory.

### 测试用例

```bash
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
```

### 题解

进行数组内的元素交换。

```js
var reverseString = function(s) {
    let n = Math.floor(s.length / 2), l = s.length;
    for(let i = 0; i < n; i++) {
        let temp = s[i];
        s[i] = s[l - i - 1];
        s[l - i - 1] = temp;
    }
};
```

### 结果

> Accepted
> 
> 477/477 cases passed (168 ms)
> 
> Your runtime beats 15.06 % of javascript submissions
> 
> Your memory usage beats 5.18 % of javascript submissions (50.4 MB)