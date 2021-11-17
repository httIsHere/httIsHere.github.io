---
title: 235.Lowest Common Ancestor of a Binary Search Tree
date: 2021-10-13 16:31:14
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述

> Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes in the BST.
> According to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).”


查找二叉搜索树的最近公共祖先。

### 题解

#### 1. 极其暴力

我的主要逻辑流程，将子节点的状态判断累积到父节点。

```js
/*
 * @lc app=leetcode id=235 lang=javascript
 *
 * [235] Lowest Common Ancestor of a Binary Search Tree
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    let result = null;

    if(root.val === p.val || root.val === q.val) return root;

    root = getChild(root);
    if(!result && root.has_q && root.has_q) {
        result = root;
    }

    console.log(result)
    return result;

    function getChild(root) {
        if(!root) return null;
        if(root.has_p && root.has_q) {
            result = root;
            return root;
        }
        if(root.val === q.val) root.has_q = true;
        if(root.val === p.val) root.has_p = true;
        let child_left = getChild(root.left);
        let child_right = getChild(root.right);
        if((child_left && child_left.has_q && child_left.has_p)) {
            result = child_left;
            return root;
        }
        if((child_right && child_right.has_q && child_right.has_p)) {
            result = child_right;
            return root;
        }
        if((child_left && child_left.has_p) || (child_right && child_right.has_p)) {
            root.has_p = true;
        }
        if((child_left && child_left.has_q) || (child_right && child_right.has_q)) {
            root.has_q = true;
        }
        if(child_left) {
            // 标记当前节点
            child_left.val === p.val && (root.has_p = true);
            child_left.val === q.val && (root.has_q = true);
        }
        if(child_right) {
            child_right.val === p.val && (root.has_p = true);
            child_right.val === q.val && (root.has_q = true);
        }
        return root;
    }
};
// @lc code=end

let root, q, p;
q = {val: 4}, p = {val: 2};
node3 = {val: 3, left: null, right: null};
node5 = {val: 5, left: null, right: null};
node4 = {val: 4, left: node3, right: node5};
node0 = {val: 0, left: null, right: null};
node2 = {val: 2, left: node0, right: node4};
node7 = {val: 7, left: null, right: null};
node9 = {val: 9, left: null, right: null};
node8 = {val: 8, left: node7, right: node9};
root = { val: 6, left: node2, right: node8}


lowestCommonAncestor(root, p, q)
```

#### 2. 参考解法

> 1）两个节点均在root的左子树，此时对root->left递归求解
> 2）两个节点均在root的右子树，此时对root->right递归求解；
> 3）两个节点分别位于root的左右子树，此时为root。

```js
var lowestCommonAncestor = function(root, p, q) {
    if(!root) return root;

    if(p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);
    if(p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
    return root;
}
```