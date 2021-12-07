---
title: 2006.count-number-of-pairs-with-absolute-difference-k
date: 2021-12-06 15:32:26
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given an integer array nums and an integer k, return the number of pairs (i, j) where i < j such that |nums[i] - nums[j]| == k.
> 
> The value of |x| is defined as:
> 
> - x if x >= 0.
> - -x if x < 0.

### 测试用例

```bash
Input: nums = [1,2,2,1], k = 1
Output: 4
Explanation: The pairs with an absolute difference of 1 are:
- [1,2,2,1]
- [1,2,2,1]
- [1,2,2,1]
- [1,2,2,1]
```

### 题解

暴力双重循环。

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var countKDifference = function(nums, k) {
    let sum = 0, i = 0, j = 1;
    for(let i = 0; i < nums.length - 1; i++) {
        for(let j = i + 1; j < nums.length; j++) {
            if(Math.abs(nums[i] - nums[j]) === k) {
                sum++;
            }
        }
    }
    return sum;  
};
```

### 结果

> Accepted
> 
> 237/237 cases passed (80 ms)
> 
> Your runtime beats 77.23 % of javascript submissions
> 
> Your memory usage beats 23.12 % of javascript submissions (40.7 MB)