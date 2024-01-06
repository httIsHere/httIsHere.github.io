/*
 * @lc app=leetcode id=55 lang=javascript
 *
 * [55] Jump Game
 */

// @lc code=start
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
// @lc code=end


canJump([3,2,1,0,4])
