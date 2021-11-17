---
title: 292.nim-game
date: 2021-10-21 15:27:23
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### 描述

> You are playing the following Nim Game with your friend:
> 
> Initially, there is a heap of stones on the table.
> 
> You and your friend will alternate taking turns, and you go first.
> 
> On each turn, the person whose turn it is will remove 1 to 3 stones from the heap. The one who removes the last stone is the winner.
> 
> Given n, the number of stones in the heap, return true if you can win the game assuming both you and your friend play optimally, otherwise return false.

 
### 测试用例

 ```bash
Input: n = 4
Output: false
Explanation: These are the possible outcomes:
1. You remove 1 stone. Your friend removes 3 stones, including the last stone. Your friend wins.
2. You remove 2 stones. Your friend removes 2 stones, including the last stone. Your friend wins.
3. You remove 3 stones. Your friend removes the last stone. Your friend wins.
In all outcomes, your friend wins.
 ```

### 题解

 因为我先拿a（[1,3]）个，所以如果总数是4n（4的倍数），那么对方每次拿4-a个，他就一定可以赢我（对方很聪明）。
 所以如果总数是4的倍数，那么我肯定会输。

  *（这个游戏最重要的就是先拿的吃亏）*

 ```js
 var canWinNim = function(n) {
    // 所有的情况内，是否存在赢的可能性
    return n % 4 !== 0
 }
 ```

### 结果

> Accepted
> 
> 60/60 cases passed (92 ms)
> 
> Your runtime beats 30.82 % of javascript submissions
> 
> Your memory usage beats 48.2 % of javascript submissions (38.6 MB)