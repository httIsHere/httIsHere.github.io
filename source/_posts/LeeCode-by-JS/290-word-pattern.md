---
title: 290.word-pattern
date: 2021-10-21 14:50:02
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given a pattern and a string s, find if s follows the same pattern.
> 
> Here follow means a full match, such that there is a bijection between a letter in pattern and a non-empty word in s.

### 测试用例

```bash
# 1
Input: pattern = "abba", s = "dog cat cat dog"
Output: true

# 2
Input: pattern = "abba", s = "dog cat cat fish"
Output: false

# 3
Input: pattern = "aaaa", s = "dog cat cat dog"
Output: false

# 4
Input: pattern = "abba", s = "dog dog dog dog"
Output: false
```

### 题解

需要检查字符和单词之间的映射关系（条件是唯一1对1映射）。

```js
var wordPattern = function(pattern, s) {
    // 和之前的字符映射类似
    let tep = {}, flag = true;
    let _s = s.split(' ');
    if(pattern.length !== _s.length) return false;
    for(let i = 0; i < pattern.length; i++) {
        if(!tep[pattern[i]]) tep[pattern[i]] = _s[i];
        else if(tep[pattern[i]] !== _s[i]) return false;
        // 检查是否存在映射关系
        Object.keys(tep).forEach(item => {
            if(tep[item] === _s[i] && item !== pattern[i]) {
                flag = false;
                return;
            }
        });
        if(!flag) return false;
    }
    return true;
};
```

### 结果

> Accepted
> 
> 36/36 cases passed (94 ms)
> 
> Your runtime beats 30.47 % of javascript submissions
> 
> Your memory usage beats 65.61 % of javascript submissions (38.5 MB)