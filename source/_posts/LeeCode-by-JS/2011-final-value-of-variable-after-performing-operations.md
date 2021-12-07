---
title: 2011.final-value-of-variable-after-performing-operations
date: 2021-12-06 14:51:29
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> There is a programming language with only four operations and one variable X:
> 
> ```
> ++X and X++ increments the value of the variable X by 1.
> --X and X-- decrements the value of the variable X by 1.
> ```
> Initially, the value of X is 0.
> 
> Given an array of strings operations containing a list of operations, return the final value of X after performing all the operations.

### 测试用例

```bash
Input: operations = ["--X","X++","X++"]
Output: 1
Explanation: The operations are performed as follows:
Initially, X = 0.
--X: X is decremented by 1, X =  0 - 1 = -1.
X++: X is incremented by 1, X = -1 + 1 =  0.
X++: X is incremented by 1, X =  0 + 1 =  1.
```

### 题解

不管是X--，--X还是X++，++X，只要判断中间字符的符号。

```js
/**
 * @param {string[]} operations
 * @return {number}
 */
var finalValueAfterOperations = function(operations) {
    let x = 0;
    operations.forEach(item => {
        if(item[1] === '+') {
            x++;
        } else if(item[1] === '-') {
            x--;
        }
    });
    console.log(x)
    return x;
};
```

### 结果

> Accepted
> 
> 259/259 cases passed (88 ms)
> 
> Your runtime beats 28.51 % of javascript submissions
> 
> Your memory usage beats 11.51 % of javascript submissions (40.6 MB)
