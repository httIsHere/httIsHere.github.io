---
title: 383.ransom-note
date: 2021-11-22 14:05:20
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### 描述

> Given two stings ransomNote and magazine, return true if ransomNote can be constructed from magazine and false otherwise.
> 
> Each letter in magazine can only be used once in ransomNote.

### 测试用例

```bash
Input: ransomNote = "aa", magazine = "ab"
Output: false

Input: ransomNote = "aa", magazine = "aab"
Output: true
```

### 题解

首先收集目标字符串内的字符，再去原字符串内进行映射。

```js
var canConstruct = function(ransomNote, magazine) {
    // 收集ransomNote
    let ransomNote_arr = {}, flag = true;
    for(let i = 0; i < ransomNote.length; i++) {
        ransomNote_arr[ransomNote[i]] = ransomNote_arr[ransomNote[i]] ? ransomNote_arr[ransomNote[i]] + 1 : 1;
    }
    for(let i = 0; i < magazine.length; i++) {
        if(ransomNote_arr[magazine[i]]) {
            ransomNote_arr[magazine[i]]--;
        }
    }
    Object.keys(ransomNote_arr).forEach(c => {
        if(ransomNote_arr[c]) {
            flag = false;
            return;
        }
    });
    return flag;
};
```

### 结果

> Accepted
> 
> 126/126 cases passed (104 ms)
> 
> Your runtime beats 55.2 % of javascript submissions
> 
> Your memory usage beats 49.44 % of javascript submissions (42 MB)