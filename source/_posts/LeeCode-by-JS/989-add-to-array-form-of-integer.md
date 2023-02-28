---
title: 989.add-to-array-form-of-integer
date: 2023-02-28 23:02:21
tags:
    - LeeCode
categories:
    - LeeCode
hidden: true
cateHidden: false
---

### Description

> The array-form of an integer num is an array representing its digits in left to right order.

For example, for num = 1321, the array form is [1,3,2,1].
Given num, the array-form of an integer, and an integer k, return the array-form of the integer num + k.

### Example

> Input: num = [1,2,0,0], k = 34
Output: [1,2,3,4]
Explanation: 1200 + 34 = 1234

### Solution

```js
/**
 * @param {number[]} num
 * @param {number} k
 * @return {number[]}
 */
var addToArrayForm = function(num, k) {
    let result = []
    for(let i = num.length - 1; i >= 0; i--) {
        result.push((num[i] + k) % 10);
        k = parseInt((num[i] + k) / 10);
    }
    while(k) {
        result.push(k % 10);
        k = parseInt(k / 10);
    }
    return result.reverse()
};
```