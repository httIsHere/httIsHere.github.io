---
title: 2000.reverse-prefix-of-word
date: 2021-12-06 16:23:13
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given a 0-indexed string word and a character ch, reverse the segment of word that starts at index 0 and ends at the index of the first occurrence of ch (inclusive). If the character ch does not exist in word, do nothing.
> 
> - For example, if word = "abcdefd" and ch = "d", then you should reverse the segment that starts at 0 and ends at 3 (inclusive). The resulting string will be "dcbaefd".
> 
> Return the resulting string.


### 测试用例

```bash
Input: word = "abcdefd", ch = "d"
Output: "dcbaefd"
Explanation: The first occurrence of "d" is at index 3. 
Reverse the part of word from 0 to 3 (inclusive), the resulting string is "dcbaefd".
```

### 题解

```js
/**
 * @param {string} word
 * @param {character} ch
 * @return {string}
 */
var reversePrefix = function(word, ch) {
    let _num = -1; // the index of ch
    let i = 0;
    word = word.split('');
    while(i < word.length) {
        if(word[i] === ch) {
            _num = i;
            break;
        }
        i++;
    }
    for(let i = 0; i < _num / 2; i++) {
        let temp = word[i];
        word[i] = word[_num - i];
        word[_num - i] = temp;
    }
    return word.join('');
};
```

### 结果

> Accepted
> 
> 112/112 cases passed (76 ms)
> 
> Your runtime beats 60.98 % of javascript submissions
> 
> Your memory usage beats 46.34 % of javascript submissions (39 MB)