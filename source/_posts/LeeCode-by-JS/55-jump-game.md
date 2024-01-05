---
title: 55.jump-game
date: 2023-03-01 20:32:39
tags:
    - LeeCode
categories:
    - LeeCode
hidden: true
cateHidden: false
---


### Description

> You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

> Return true if you can reach the last index, or false otherwise.

### Example

> Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.

### Solution

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
    if (nums.length === 1) return true;
    const backtracking = (current) => {
        if (current < nums[0]) return true;
        for (let i = 0; i < current; i++) {
            if (nums[i] >= current - i) {
                return backtracking(i);
            }
        }
        return false;
    }
    return backtracking(nums.length - 1);
}

```
