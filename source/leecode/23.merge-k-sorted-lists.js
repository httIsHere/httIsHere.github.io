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
    if (cur.val <= lists[i].val) {
      (list1 = cur), (list2 = lists[i]);
    } else {
      (list2 = cur), (list1 = lists[i]);
    }
    _now = list1;
    while (list2 !== null) {
      if (list1.next) {
        if (list1.next.val <= list2.val) list1 = list1.next;
        else {
          let _next = list1.next;
          // 插入list1
          list1.next = {
            val: list2.val,
            next: _next,
          };
          list2 = list2.next;
          list1 = list1.next;
        }
      } else {
        list1.next = list2;
        list2 = null; // clear
      }
    }
    cur = _now;
  }
  console.log(JSON.stringify(cur));
  return cur;
};
// @lc code=end

let list1 = {
  val: 2,
  next: null,
};
let list2 = null;
let list3 = {
  val: -1,
  next: null,
};

mergeKLists([list1, list2, list3]);
