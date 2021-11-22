---
title: 387.first-unique-character-in-a-string
date: 2021-11-22 14:33:45
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### 描述

> Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.


### 测试用例

```bash
Input: s = "leetcode"
Output: 0

Input: s = "loveleetcode"
Output: 2

Input: s = "aabb"
Output: -1
```

### 题解

依旧是首先收集目标字符串的元素，再根据字符数去匹配目标字符串内字符数为1的字符位置。

```js
var firstUniqChar = function(s) {
    let obj = {}, result = -1; // 用于收集字符

    for(let c of s) {
        obj[c] = obj[c] ? obj[c] + 1 : 1;
    }
    // 确定位置
    for(let i in s) {
        if(obj[s[i]] === 1) {
            result = i;
            break;
        }
    }
    return result;
};
```

### 结果

> Accepted
> 
> 104/104 cases passed (351 ms)
> 
> Your runtime beats 5.3 % of javascript submissions
> 
> Your memory usage beats 5.02 % of javascript submissions (61.8 MB)