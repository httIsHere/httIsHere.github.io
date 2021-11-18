---
title: 345.reverse-vowels-of-a-string
date: 2021-11-18 14:12:50
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given a string s, reverse only all the vowels in the string and return it.
> 
> The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both cases.

### 测试用例

```bash
Input: s = "leetcode"
Output: "leotcede"
```

### 题解

使用首尾指针循环，并交换对应的元音字母。

```js
var reverseVowels = function (s) {
  // 列举元音字母
  let vowels = ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"];
  let l = s.length， i = 0, j = l - i - 1;
  // & js字符串字符不能直接赋值，强制转换成数组
  s = s.split('');
  while (i < j) {
    // 当前字母是否为元音字母
    let is_i = vowels.indexOf(s[i]) > -1,
      is_j = vowels.indexOf(s[j]) > -1;
    if (is_i && is_j) {
      let temp = s[j];
      s[j] = s[i];
      s[i] = temp;
      i++, j--;
    } else if (!is_i) {
      i++;
    } else if (!is_j) {
      j--;
    }
  }
  return s.join('');
};
```

### 结果

> Accepted
> 
> 480/480 cases passed (104 ms)
> 
> Your runtime beats 47.29 % of javascript submissions
> 
> Your memory usage beats 51.31 % of javascript submissions (45.3 MB)