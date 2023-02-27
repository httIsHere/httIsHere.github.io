/*
 * @lc app=leetcode id=693 lang=javascript
 *
 * [693] Binary Number with Alternating Bits
 */

// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var hasAlternatingBits = function(n) {
    let pre = -1;
    while(n) {
        if(pre === n % 2) return false;
        pre = n % 2;
        n = parseInt(n /2);
    }
    return true;
};
// @lc code=end

console.log(hasAlternatingBits(7))
