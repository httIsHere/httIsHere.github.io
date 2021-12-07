---
title: 392.is-subsequence
date: 2021-11-23 10:00:51
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given two strings s and t, return true if s is a subsequence of t, or false otherwise.
> 
> A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., "ace" is a subsequence of "abcde" while "aec" is not).

### 测试用例

```bash
Input: s = "abc", t = "ahbgdc"
Output: true

Input: s = "axc", t = "ahbgdc"
Output: false
```

### 题解

该题要比[[383] Ransom Note 赎金信](/2021/11/22/LeeCode-by-JS/383-ransom-note/)多了严格顺序的要求。

所以通过最后的索引位置进行判断。

```js
var isSubsequence = function(s, t) {
        let _s = 0; // 索引
        for(let i = 0; i < t.length; i++) {
            if(s[_s] === t[i]) {
                _s++;
            }
        }
        return _s >= s.length;
};
```

### 结果

> Accepted
> 
> 17/17 cases passed (89 ms)
> 
> Your runtime beats 23.25 % of javascript submissions
> 
> Your memory usage beats 68.04 % of javascript submissions (38.9 MB)