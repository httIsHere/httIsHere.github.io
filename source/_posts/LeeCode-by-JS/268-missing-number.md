---
title: 268.missing number
date: 2021-10-18 14:49:02
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.
> 
> 查找给定范围内缺少的数字。

### 测试用例

```bash
Input: nums = [3,0,1]
Output: 2
Explanation: n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.

Input: nums = [0,1]
Output: 2
Explanation: n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range since it does not appear in nums.
```

### 题解

因为元素范围是[0,n]的连续数字，通过计算理想范围的“和”和实际数字的“和”进行对比。

```js
var missingNumber = function(nums) {
    if(nums.length === 1 && nums[0] === 0) return 1;
    let min_num = -1, max_num = 0, sum = 0, range_sum = 0;
    // 计算当前数字的和，记录最小值和最大值
    for(let i = 0; i < nums.length; i++) {
        if(nums[i] === 0) min_num = nums[i];
        else if(nums[i] >= max_num) max_num = nums[i];
        sum += nums[i];
    }
    if(min_num === -1) return 0;
    // 计算理想数据范围的和
    range_sum = (1 + max_num) * max_num / 2;
    return range_sum - sum ? range_sum - sum : max_num + 1;
};
```

### 结果

> Accepted
> 
> 122/122 cases passed (107 ms)
> 
> Your runtime beats 35.98 % of javascript submissions
> 
> Your memory usage beats 80.34 % of javascript submissions (40.9 MB)