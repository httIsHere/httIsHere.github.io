---
title: 237.Delete Node in a Linked List
date: 2021-10-13 16:31:14
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---

### 描述
> Write a function to delete a node in a singly-linked list. You will not be given access to the head of the list, instead you will be given access to the node to be deleted directly.
> It is guaranteed that the node to be deleted is not a tail node in the list.

删除链表中的当前节点。

### 题解

没有头节点，也就无法获取上一个节点，那么思路只能将当前节点作为头节点：
- 复制下一个节点给当前节点
- 将下一个节点作为需要删除的节点

```js
var deleteNode = function(node) {
    node.val = node.next.val;
    node.next = node.next.next;
};
```