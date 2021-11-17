---
title: 「js/jquery」offsetTop在不同浏览器下的表现
urlname: ouuq8y
date: '2020-11-03 10:08:42 +0800'
tags:
  - daily
  - QS
categories:
  - Daily
---

> 记录日常问题

<!-- more -->

> `offsetTop`：元素到 offsetParent 顶部的距离。
> `offsetParent`：距离元素最近的一个具有定位的祖宗元素（relative，absolute，fixed），若祖宗都不符合条件，offsetParent 为 body。

`offsetTop`和`offsetLeft`与`offsetParent`**有关**。

![](https://cdn.nlark.com/yuque/0/2020/jpeg/250093/1604374248679-1a051cdd-7d6d-4888-ba8a-5af9ace6a41b.jpeg#align=left&display=inline&height=474&margin=%5Bobject%20Object%5D&name=&originHeight=474&originWidth=797&size=0&status=done&style=none&width=797)
所以一旦有具有定位的祖宗元素，则当前元素获取到的`offsetTop`就会偏小。

为了获取正确的元素距离顶部的有效距离，需要对 offsetParent 的 offsetTop 进行计算，如果当前元素有 offsetParent 则当前元素的 offsetTop 为其 offsetTop 加上它的 offsetParent 的 offsetTop，如果 offsetParent 还有它 offsetParent 则需要一直逐级向上查询，直到 body。

```javascript
function elemOffsetY(elem) {
  return elem.offsetParent
    ? elem.offsetTop + elemOffsetY(elem.offsetParent)
    : elem.offsetTop;
}
```

参考：[关于 offsetTop 的理解](https://blog.csdn.net/jinxi1112/article/details/90692484)
