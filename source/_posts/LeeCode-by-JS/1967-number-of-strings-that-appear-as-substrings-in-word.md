---
title: 1967.number-of-strings-that-appear-as-substrings-in-word
date: 2021-12-16 10:12:53
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### Description

> Given an array of strings patterns and a string word, return the number of strings in patterns that exist as a substring in word.
> 
> A substring is a contiguous sequence of characters within a string.


### Examples

```bash
Input: patterns = ["a","abc","bc","d"], word = "abc"
Output: 3
Explanation:
- "a" appears as a substring in "abc".
- "abc" appears as a substring in "abc".
- "bc" appears as a substring in "abc".
- "d" does not appear as a substring in "abc".
3 of the strings in patterns appear as a substring in word.

Input: patterns = ["a","b","c"], word = "aaaaabbbbb"
Output: 2
Explanation:
- "a" appears as a substring in "aaaaabbbbb".
- "b" appears as a substring in "aaaaabbbbb".
- "c" does not appear as a substring in "aaaaabbbbb".
2 of the strings in patterns appear as a substring in word.
```

### Solution

用String的`indexOf`很容易就能解决。

```js
var numOfStrings = function(patterns, word) {
    let num = 0;
    for(let i = 0; i < patterns.length; i++) {
        if(word.indexOf(patterns[i]) > -1) {
            num += 1;
        }
    }
    return num;
}
```

如果自己实现`indexOf`方法：

```js
    function myIndexOf(str, word) {
        let _str = str.split(''), num = -1, _l = +word.length; // word.length需要转成Number
        for(let i in _str) {
            if(_str[i] === word[0]) {
                let flag = true, limit = Number(i) + _l;
                for(let j = i; j < limit; j++) {
                    if(_str[j] !== word[j - i]) {
                        flag = false;
                        break;
                    }
                }
                if(flag) {
                    num = i;
                    break;
                }
            }
        }
        return num;
    }
```


### Result

> Accepted
> 
> 82/82 cases passed (146 ms)
> 
> Your runtime beats 5.83 % of javascript submissions
> 
> Your memory usage beats 89.81 % of javascript submissions (39.6 MB)