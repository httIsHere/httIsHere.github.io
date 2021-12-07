---
title: 1984.minimum-difference-between-highest-and-lowest-of-k-scores
date: 2021-12-07 15:46:05
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### Descrption

> You are given a 0-indexed integer array nums, where nums[i] represents the score of the ith student. You are also given an integer k.
> 
> Pick the scores of any k students from the array so that the difference between the highest and the lowest of the k scores is minimized.
> 
> Return the minimum possible difference.


### Examples

```bash
Input: nums = [9,4,1,7], k = 2
Output: 2
Explanation: There are six ways to pick score(s) of two students:
- [9,4,1,7]. The difference between the highest and lowest score is 9 - 4 = 5.
- [9,4,1,7]. The difference between the highest and lowest score is 9 - 1 = 8.
- [9,4,1,7]. The difference between the highest and lowest score is 9 - 7 = 2.
- [9,4,1,7]. The difference between the highest and lowest score is 4 - 1 = 3.
- [9,4,1,7]. The difference between the highest and lowest score is 7 - 4 = 3.
- [9,4,1,7]. The difference between the highest and lowest score is 7 - 1 = 6.
The minimum possible difference is 2.
```

### Solution

**[参考解法](https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/discuss/1612494/C%2B%2BororWell-commentedoror93-faster)**

为了获取到最小的差，所以可以先对数组进行排序，那么目标范围选取是按照排序的顺序的范围内，只有同一区间内的最大和最小的差才可能是最小的。

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minimumDifference = function(nums, k) {
    if(k <= 1) return 0;
    // select k students
    let diff = -1, len = nums.length;
    // 先排序, 不传参数，将不会按照数值大小排序，按照字符编码的顺序进行排序
    nums.sort(function(a,b){
        return a - b;
    });
    for(let i = 0; i + k <= len; i++) {
        let _diff = Math.abs(nums[i] - nums[i + k - 1]);
        diff = diff === -1 ? _diff : (diff < _diff ? diff : _diff);
    }
    return diff;
};
```

### Result

> Accepted
> 
> 118/118 cases passed (176 ms)
> 
> Your runtime beats 5.06 % of javascript submissions
> 
> Your memory usage beats 11.39 % of javascript submissions (45.1 MB)