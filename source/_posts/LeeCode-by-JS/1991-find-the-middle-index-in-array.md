---
title: 1991.find-the-middle-index-in-array
date: 2021-12-07 15:07:39
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### Description

> Given a 0-indexed integer array nums, find the leftmost middleIndex (i.e., the smallest amongst all the possible ones).
> 
> A middleIndex is an index where `nums[0] + nums[1] + ... + nums[middleIndex-1] == nums[middleIndex+1] + nums[middleIndex+2] + ... + nums[nums.length-1]`.
> 
> If `middleIndex == 0`, the left side sum is considered to be 0. Similarly, if `middleIndex == nums.length - 1`, the right side sum is considered to be 0.
> 
> Return the leftmost middleIndex that satisfies the condition, or -1 if there is no such index.


### Examples

```bash
Input: nums = [2,3,-1,8,4]
Output: 3
Explanation:
The sum of the numbers before index 3 is: 2 + 3 + -1 = 4
The sum of the numbers after index 3 is: 4 = 4

Input: nums = [2,5]
Output: -1
Explanation:
There is no valid middleIndex.
```

### Solution

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMiddleIndex = function(nums) {
    if(nums.length <= 1) return 0;
    let mid_index = 0;
    while(mid_index < nums.length) {
        let l = 0, r = 0;
        for(let i = 0; i < nums.length; i++) {
            if(i < mid_index) l += nums[i];
            if(i > mid_index) r += nums[i];
        }
        if(l === r) {
            return mid_index;
        }
        mid_index++;
    }
    return -1;
};
```

### Result

> Accepted
> 
> 294/294 cases passed (88 ms)
> 
> Your runtime beats 28.21 % of javascript submissions
> 
> Your memory usage beats 23.59 % of javascript submissions (40.9 MB)