---
title: 374.guess-number-higher-or-lower
date: 2021-11-19 11:15:59
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> We are playing the Guess Game. The game is as follows:
> 
> I pick a number from 1 to n. You have to guess which number I picked.
> 
> Every time you guess wrong, I will tell you whether the number I picked is higher or lower than your guess.
> 
> You call a pre-defined API int guess(int num), which returns 3 possible results:
> 
>   - -1: The number I picked is lower than your guess (i.e. pick < num).
> 
>   - 1: The number I picked is higher than your guess (i.e. pick > num).
> 
>   - 0: The number I picked is equal to your guess (i.e. pick == num).
> 
> Return the number that I picked.

### 测试用例

```bash
Input: n = 10, pick = 6
Output: 6
```

### 题解

二分查找。

```js
// guess是一个前置API
var guessNumber = function (n) {
  let min = 1,
    max = n, mid;
  while (min <= max) {
    mid = Math.floor((min + max) / 2);
    switch (guess(mid)) {
      case -1:
        max = mid - 1;
        break;
      case 1:
        min = mid + 1;
        break;
      case 0:
        return mid;
    }
  }
};
```

### 结果

> Accepted
> 
> 25/25 cases passed (68 ms)
> 
> Your runtime beats 90.8 % of javascript submissions
> 
> Your memory usage beats 15.01 % of javascript submissions (38.8 MB)