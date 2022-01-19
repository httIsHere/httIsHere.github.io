---
title: 1979.find-greatest-common-divisor-of-array
date: 2021-12-10 14:09:54
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### Description

> Given an integer array nums, return the greatest common divisor of the smallest number and largest number in nums.
> 
> The greatest common divisor of two numbers is the largest positive integer that evenly divides both numbers.


### Examples

```bash
Input: nums = [2,5,6,9,10]
Output: 2
Explanation:
The smallest number in nums is 2.
The largest number in nums is 10.
The greatest common divisor of 2 and 10 is 2.
```

### Solution

```js
var findGCD = function(nums) {
    let min = nums[0], max = nums[0], gcd = 0;
    for(let i = 1; i < nums.length; i++) {
        if(nums[i] < min) {
            min = nums[i];
        } else if(nums[i] > max) {
            max = nums[i];
        }
    }
    for(let i = 1; i <= min && i <= max; i++) {
        if(min % i === 0 && max % i === 0) {
            gcd = i;
        }
    }
    return gcd;
};
```

### Result

> Accepted
> 
> 215/215 cases passed (76 ms)
> 
> Your runtime beats 78.57 % of javascript submissions
> 
> Your memory usage beats 50.34 % of javascript submissions (40.2 MB)