/**
 * // Definition for a Node.
 * function Node(val, left, right, next) {
 *    this.val = val === undefined ? null : val;
 *    this.left = left === undefined ? null : left;
 *    this.right = right === undefined ? null : right;
 *    this.next = next === undefined ? null : next;
 * };
 */

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