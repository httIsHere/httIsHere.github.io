---
title: 1961.check-if-string-is-a-prefix-of-array
date: 2021-12-16 11:22:51
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### Description

> Given a string s and an array of strings words, determine whether s is a prefix string of words.
> 
> A string s is a prefix string of words if s can be made by concatenating the first k strings in words for some positive k no larger than words.length.
> 
> Return true if s is a prefix string of words, or false otherwise.

### Examples

```bash
Input: s = "iloveleetcode", words = ["i","love","leetcode","apples"]
Output: true
Explanation:
s can be made by concatenating "i", "love", and "leetcode" together.

Input: s = "iloveleetcode", words = ["apples","i","love","leetcode"]
Output: false
Explanation:
It is impossible to make s using a prefix of arr.
```


### Solution

```js
var isPrefixString = function(s, words) {
    let str = '';
    for(let i = 0; i < words.length; i++) {
        str = str.concat(words[i]);
        if(s === str) {
            return true;
        }
    }
    return false;
};
```

### Result

> Accepted
> 
> 349/349 cases passed (106 ms)
> 
> Your runtime beats 17.91 % of javascript submissions
> 
> Your memory usage beats 91.04 % of javascript submissions (39.8 MB)