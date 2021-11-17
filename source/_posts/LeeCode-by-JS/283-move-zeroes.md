---
title: 283.move zeroes
date: 2021-10-21 14:25:44
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.
> 
> Note that you must do this in-place without making a copy of the array.
> 
> 将数组内的所有零移至数组末尾。

### 测试用例

```bash
Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]
```

### 题解

将数组内的0用非0数字进行覆盖，再根据数组内0的个数对数组后几位进行置0。

```js
var moveZeroes = function(nums) {
    if(nums.length <= 1) return nums;
    let zero_num = 0;
    for(var i = 0; i < nums.length; i++) {
        if(nums[i] !== 0) {
            // 覆盖0
            nums[zero_num] = nums[i];
            zero_num++;
        }
    }
    for(let i = zero_num; i < nums.length; i++) {
        nums[i] = 0;
    }
    return nums;
};
```