---
title: "\U0001F195 在js内用文本内容定位DOM元素"
urlname: f5c52bc4bd8d4a1
date: '2023-08-09 15:47:00 +0800'
tags:
  - Javascript
categories:
  - Daily
cover:
---

> 在开发中遇到了一个需求：在 url 内输入页面上的按钮 label 就可以触发按钮的点击事件。

    此时就需要用文本内容来定位页面上的DOM元素。

## 1. 遍历法

遍历页面上所有的相关元素。

```typescript
Array.from(document.querySelectorAll("span")).find((el) =>
  el.textContent.includes("文本内容")
);
```

## 2. XPATH 表达式

```typescript
document
  .evaluate(
    "//span[contains(., '文本内容')]",
    document,
    null,
    XPathResult.ANY_TYPE
  )
  .iterateNext();
```

## 3. jQuery

```typescript
var $span = $("span:contains('文本内容')"); // 获取的是jQuery对象
var span = $span.get(0); // 转换为 js 对象
```
