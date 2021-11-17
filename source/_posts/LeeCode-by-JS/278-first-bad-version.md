---
title: 278.First Bad Version
date: 2021-10-18 15:25:34
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.
> 
> Suppose you have n versions [1, 2, ..., n] and you want to find out the first bad one, which causes all the following ones to be bad.
> 
> You are given an API bool isBadVersion(version) which returns whether version is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.

### 测试用例

```bash
Input: n = 5, bad = 4
Output: 4
Explanation:
call isBadVersion(3) -> false
call isBadVersion(5) -> true
call isBadVersion(4) -> true
Then 4 is the first bad version.
```

### 题解

二分法。

```js
var solution = function(isBadVersion) {
    /**
     * @param {integer} n Total versions
     * @return {integer} The first bad version
     */
    return function(n) {
        // 二分法
        let left = 1, right = n;
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if(isBadVersion(mid)) right = mid;
            else left = mid + 1;
        }
        return left;
    };
};
```

### 结果

> Accepted
> 
> 22/22 cases passed (105 ms)
> 
> Your runtime beats 28.07 % of javascript submissions
> 
> Your memory usage beats 64.6 % of javascript submissions (38.5 MB)