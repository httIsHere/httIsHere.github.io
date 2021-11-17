---
title: 206.Reverse Linked List
date: 2021-10-13 16:31:14
tags:
    - LeeCode
categories: 
    - LeeCode
hidden: true
cateHidden: false
---


### 描述

> Given the head of a singly linked list, reverse the list, and return the reversed list.

翻转链表。


### 题解

```js
var reverseList = function (head) {
  if (!head || !head.next) return head;
  let _head = head,
    _next = head.next;
  _head.next = null;
  while (_next) {
    let __next = _next.next; // 记录下一个节点
    // 反转当前节点
    _next.next = _head;
    _head = _next;
    _next = __next;
    if (!__next) {
      return _head;
    }
  }
};
```