---
title: 1974.minimum-time-to-type-word-using-special-typewriter
date: 2021-12-10 11:57:32
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### Description

> There is a special typewriter with lowercase English letters 'a' to 'z' arranged in a circle with a pointer. A character can only be typed if the pointer is pointing to that character. The pointer is initially pointing to the character 'a'.
> 
> ![](https://gitee.com/httishere/blog-image/raw/master/img/chart.jpeg)
> Each second, you may perform one of the following operations:
> 
> - Move the pointer one character counterclockwise or clockwise.
> - Type the character the pointer is currently on.
> 
> Given a string word, return the minimum number of seconds to type out the characters in word.

### Examples

```bash
Input: word = "abc"
Output: 5
Explanation: 
The characters are printed as follows:
- Type the character 'a' in 1 second since the pointer is initially on 'a'.
- Move the pointer clockwise to 'b' in 1 second.
- Type the character 'b' in 1 second.
- Move the pointer clockwise to 'c' in 1 second.
- Type the character 'c' in 1 second.

Input: word = "zjpc"
Output: 34
Explanation:
The characters are printed as follows:
- Move the pointer counterclockwise to 'z' in 1 second.
- Type the character 'z' in 1 second.
- Move the pointer clockwise to 'j' in 10 seconds.
- Type the character 'j' in 1 second.
- Move the pointer clockwise to 'p' in 6 seconds.
- Type the character 'p' in 1 second.
- Move the pointer counterclockwise to 'c' in 13 seconds.
- Type the character 'c' in 1 second.
```

### Solution

计算两个字符之间的移动距离，取最小。

```js
/**
 * @param {string} word
 * @return {number}
 */
var minTimeToType = function(word) {
    let move_num = 0, // 当前字符与目标字符的距离
        seconds = 0; // 总使用时间
    let current_ch = 'a';
    for(let ch of word) {
        seconds++;
        let tar = ch.charCodeAt(), cur = current_ch.charCodeAt();
        move_num = Math.abs(tar - cur);
        if(move_num > 13) {
            move_num = 26 - move_num;
        }
        seconds += move_num;
        current_ch = ch;
        move_num = 0;
    }
    return seconds;
};
```

### Result

> Accepted
> 
> 134/134 cases passed (88 ms)
> 
> Your runtime beats 29.85 % of javascript submissions
> 
> Your memory usage beats 14.93 % of javascript submissions (40.9 MB)