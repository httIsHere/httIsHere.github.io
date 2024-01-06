/*
 * @lc app=leetcode id=22 lang=javascript
 *
 * [22] Generate Parentheses
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    if(n === 1) return ["()"];
    // 相当于左括号和右括号的比较

    let res = [];
    equalLeftAndRight(n, n, "", res);
    return res;

    function equalLeftAndRight(left, right, out, res) {
        if(left < 0 || right < 0 || left > right) return;
        if(left === 0 && right === 0) {
            return res.push(out);
        }
        equalLeftAndRight(left - 1, right, `${out}(`, res);
        equalLeftAndRight(left, right - 1, `${out})`, res);
    }
};
// @lc code=end

let n = 3;
generateParenthesis(n);

