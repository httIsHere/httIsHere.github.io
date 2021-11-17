---
title: 「Daily」日常记录2020/05/20
urlname: cvxvim
date: '2020-05-20 10:52:28 +0800'
tags:
  - daily
  - QS
categories:
  - Daily
cover:
---

<!-- more -->

1. 周选择器 element-ui

```html
<el-date-picker
  v-model="week_choice"
  type="week"
  format="yyyy 第 WW 周"
  placeholder="选择周"
></el-date-picker>
```

PS:

- 自然周从周一开始  `:picker-options="{'firstDayOfWeek': 1}"`

![image.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1589943430188-3a6a9715-59ea-4b83-8387-d264d964318c.png#align=left&display=inline&height=292&margin=%5Bobject%20Object%5D&name=image.png&originHeight=872&originWidth=1776&size=153405&status=done&style=none&width=595)

2. 垂直方向经常会出现 margin 重叠的问题
3. less 内数组循环索引是从 1 开始

```less
// tag background-color
// @tag-color-list is a array
@tag-color-list: #fa871c, #5ac265, #fe6c91, #a554af, #9690fc, #409fff, #ffd300,
  #4cd1d3, #3d36c5;
.tagBgColorLoop(@i, @tag-color-list) when(@i < length(@tag-color-list)) {
  .item-course-color-tag-@{i} {
    background-color: extract(@tag-color-list, @i+1);
  }
  .tagBgColorLoop(@i + 1, @tag-color-list);
}
.tagBgColorLoop(0, @tag-color-list);
```
