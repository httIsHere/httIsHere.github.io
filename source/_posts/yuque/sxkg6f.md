---
title: 「js」safari new Date时出现Invalid Date
urlname: sxkg6f
date: '2020-08-14 10:49:45 +0800'
tags:
  - js
  - daily
categories:
  - Javascript
cover:
---

<!-- more -->

页面内有一句时间的语句：

```javascript
let start_time = new Date(
  `${item.teacher_schedule.date} ${item.teacher_schedule.begin_at}`
).getTime();
```

其中`item.teacher_schedule.date`的格式是`'2020-08-14'`，在 Safari 内会出现 Invalid Date，需要转换成`'2020/08/14'`的形式。

```javascript
let start_time = new Date(
  `${item.teacher_schedule.date.replace(/-/g, "/")} ${
    item.teacher_schedule.begin_at
  }`
).getTime();
```
