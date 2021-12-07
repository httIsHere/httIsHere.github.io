---
title: 1995.count-special-quadruplets
date: 2021-12-07 10:52:55
mathjax: true
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given a 0-indexed integer array nums, return the number of distinct quadruplets (a, b, c, d) such that:
> 
> - nums[a] + nums[b] + nums[c] == nums[d], and
> - a < b < c < d

### 测试用例

```bash
Input: nums = [1,1,1,3,5]
Output: 4
Explanation: The 4 quadruplets that satisfy the requirement are:
- (0, 1, 2, 3): 1 + 1 + 1 == 3
- (0, 1, 3, 4): 1 + 1 + 3 == 5
- (0, 2, 3, 4): 1 + 1 + 3 == 5
- (1, 2, 3, 4): 1 + 1 + 3 == 5
```

### 题解

```js
var countQuadruplets = function (nums) {
  if (nums.length < 4) return 0;
  let sum = 0,
    len = nums.length;
  // 后面至少保留3位
  for (let i = 0; i < len - 3; i++) {
    for (let j = i + 1; j < len - 2; j++) {
      for (let k = j + 1; k < len - 1; k++) {
        let _sum = nums[i] + nums[j] + nums[k];
        let r = len - 1;
        while (k < r) {
          if (_sum === nums[r]) {
            sum++;
          }
          r--;
        }
      }
    }
  }
  return sum;
};
```

### 结果

> Accepted
> 
> 211/211 cases passed (436 ms)
> 
> Your runtime beats 5.19 % of javascript submissions
> 
> Your memory usage beats 5.19 % of javascript submissions (46.4 MB)