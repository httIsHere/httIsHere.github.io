/*
 * @lc app=leetcode id=23 lang=javascript
 *
 * [23] Merge k Sorted Lists
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
  if (lists.length === 0) return null;
  let cur = null,
    i = 0;
  while (!lists[i] && i < lists.length) {
    i++;
  }
  if (i >= lists.length) return null;
  cur = lists[i];
  i++;
  for (i; i < lists.length; i++) {
    if (!lists[i]) continue;
    let list1 = null,
      list2 = null,
      _now = null;
    // 小的作为合并对象
    if (cur.val 