---
title: 「JS」数组遍历方法
urlname: lw5tof
date: 2020-10-13 10:04:34 +0800
tags: [js]
categories: [Javascript]
---

- forEach
- map
- filter
- find
- reduce

### forEach

```javascript
let arr = [1, 2, 3, 4];
arr.forEach((item) => {
  console.log(item + 1);
});
// 2
// 3
// 4
// 5
```

- 没有返回值，本质上等同于 for 循环，对每一项执行 function 函数;

### map

```javascript
let arr = [1, 2, 3, 4];
let new_arr = arr.map((item) => {
  return item + 1;
});
console.log(new_arr); // [2, 3, 4, 5];

let num = 10;
let _arr = [1, 2, { id: 0 }, num];
let _new_arr = _arr.map((item) => {
  if (typeof item === "object") {
    item.id = 9;
  }
  return item + 1;
});
conosle.log(_new_arr); // [2, 3, {id: 9}, 11]
```

- map 需要返回值，若没有 return 则返回 undefined；
- map 操作会返回新数组不改变原数组（除引用类型外）；

### filter

主要用于过滤所有符合条件的数组元素并组成新数组返回。

```javascript
let arr = [12, 33, 89, 23];
let new_arr = arr.filter((item) => item >= 30);
console.log(new_arr);
```

### find

主要应用于查找第一个符合条件的数组元素。

```javascript
let arr = [12, 33, 89, 23];
let item = arr.find((item) => item >= 30);
console.log(item);
```

### reduce

接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。

```javascript
let arr = [12, 33, 89, 23];
let total = arr.reduce((pre, next) => pre + next);
console.log(total);
```
