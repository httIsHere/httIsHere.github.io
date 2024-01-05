/*
 * @Author: Tina Huang
 * @Date: 2023-03-03 13:55:11
 * @LastEditors: Tina Huang
 * @LastEditTime: 2023-03-03 14:18:25
 * @Description:
 */
/*
 * @lc app=leetcode id=117 lang=javascript
 *
 * [117] Populating Next Right Pointers in Each Node II
 */

// @lc code=start

// Definition for a Node.
// function Node(val, left, right, next) {
//   this.val = val === undefined ? null : val;
//   this.left = left === undefined ? null : left;
//   this.right = right === undefined ? null : right;
//   this.next = next === undefined ? null : next;
// }

/**
 * @param {Node} root
 * @return {Node}
 */
var connect = function (root) {
  if (!root) return root;

  let queue = [root], index = 0;
  let tempQueue = [];

  // each level 每一层
  while(queue.length) {
    let curr = queue[index]
    let { left, right } = curr;
    if(left) tempQueue.push(left)
    if(right) tempQueue.push(right)
    if(index === queue.length - 1) {
        curr.next = null;
        queue = tempQueue
        tempQueue = []
        index = 0
    } else {
        curr.next = queue[++index]
    }
  }

  return root;
};
// @lc code=end
let test_case = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
      left: null,
      right: null,
    },
    right: {
      val: 5,
      left: null,
      right: null,
    },
  },
  right: {
    val: 3,
    left: null,
    right: { val: 7, left: null, right: null, next: null },
    next: null,
  },
  next: null,
};

// let re = connect(test_case)

// console.log(JSON.stringify(re))