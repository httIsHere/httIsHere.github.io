---
title: 338.Counting Bits
date: 2021-11-01 17:06:27
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.
> 
> 给定一个整数 n，返回一个长度为 n + 1 的数组 ans，使得对于每个 i (0 <= i <= n)，ans[i] 是 i 的二进制表示中 1 的数量。

### 测试用例

```bash
Input: n = 2 
Output: [0,1,1]
Explanation:
0 --> 0 # 0个1
1 --> 1 # 1个1
2 --> 10 # 1个1

Input: n = 5
Output: [0,1,1,2,1,2]
Explanation:
0 --> 0 # 0个1
1 --> 1 # 1个1
2 --> 10 # 1个1
3 --> 11 # 2个1
4 --> 100 # 1个1
5 --> 101 # 2个1
```

### 题解

#### `&`运算符（按位与）

以特定的方式的方式组合操作数中对应的位 如果对应的位都为1，那么结果就是1， 如果任意一个位是0 则结果就是0。

```bash
# 1 & 3的结果为1
1的二进制表示为 0 0 0 0 0 0 1
3的二进制表示为 0 0 0 0 0 1 1
根据 & 的规则 得到的结果为 0 0 0 0 0 0 0 1，十进制表示就是1
```

#### `n - 1`

一个二进制的数减1，就是将这个二进制**最右边的那个1**变成0，然后它后边的所有位置都变成1（即将最右边的那个1和后面的所有数反转）。

举例：`0011 0100`，减1，(n-1)后变成：`0011 0011`。

所以`n & (n - 1)`会将有0的位置都变成0，所以就是在原来的基础上去掉了一个1（**最右边的那个1**）。

`0011 0100` & `0011 0011` 即 `0011 0000`。

#### 代码

```js
var countBits = function(n) {
    let count = 0, ans = [];
    for(let i = 0; i <= n; i++) {
        let j = i;
        while(j) {
            count++;
            j &= (j - 1);
        }
        ans.push(count);
        count = 0;
    }
    return ans
};
```

### 结果

> Accepted
> 
> 15/15 cases passed (92 ms)
> 
> Your runtime beats 92.07 % of javascript submissions
> 
> Your memory usage beats 44.7 % of javascript submissions (45.2 MB)