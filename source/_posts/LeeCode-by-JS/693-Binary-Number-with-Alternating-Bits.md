---
title: Bits
date: 2023-02-27 21:26:51
tags:
    - LeeCode
categories:
    - LeeCode
hidden: true
cateHidden: false
---

### Description

> Given a positive integer, check whether it has alternating bits: namely, if two adjacent bits will always have different values.

### Example

> Input: n = 5
Output: true
Explanation: The binary representation of 5 is: 101

### Solution


```js
/**
 * @param {number} n
 * @return {boolean}
 */
var hasAlternatingBits = function(n) {
    let pre = -1;
    while(n) {
        if(pre === n % 2) return false;
        pre = n % 2;
        n = parseInt(n /2);
    }
    return true;
};
```

### Result 

Accepted
204/204 cases passed (49 ms)
Your runtime beats 99.37 % of javascript submissions
Your memory usage beats 9.46 % of javascript submissions (42.5 MB)