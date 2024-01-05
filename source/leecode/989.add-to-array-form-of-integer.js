/*
 * @lc app=leetcode id=989 lang=javascript
 *
 * [989] Add to Array-Form of Integer
 */

// @lc code=start
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
// @lc code=end

addToArrayForm([2, 7], 18111)