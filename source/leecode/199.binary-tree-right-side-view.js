/*
 * @lc app=leetcode id=199 lang=javascript
 *
 * [199] Binary Tree Right Side View
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
    const findRight = (root, level) => {
        if(!root) return
        if(result.length <= level) result.push(root.val)
        else result[level] = root.val
        findRight(root.left, level + 1)
        findRight(root.right, level + 1)
    }

    let result = []
    findRight(root, 0)
    console.log(result)
    return result
};
// @lc code=end

