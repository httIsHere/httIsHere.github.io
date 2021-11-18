---
title: 349.intersection-of-two-arrays
date: 2021-11-18 14:39:54
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given two integer arrays nums1 and nums2, return an array of their intersection.
> 
> Each element in the result must be unique and you may return the result in any order.

### 测试用例

```bash
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [9,4]
Explanation: [4,9] is also accepted.
```

### 题解

暴力循环。

```js
var intersection = function(nums1, nums2) {
    let intersection_arr = new Set(), result = [];
    let set1 = new Set(nums1), set2 = new Set(nums2);
    set1.forEach(n1 => {
        set2.forEach(n2 => {
            if(n1 === n2) {
                intersection_arr.add(n1);
            }
        })
    })
    intersection_arr.forEach(n => {
        result.push(n)
    })
    return result;
};
```

### 结果

> Accepted
> 
> 55/55 cases passed (100 ms)
> 
> Your runtime beats 27.44 % of javascript submissions
> 
> Your memory usage beats 42.4 % of javascript submissions (40.4 MB)