---
title: 「js」记录最近遇到的小问题
urlname: ze9all
date: 2020-12-09 13:48:59 +0800
tags: []
categories: []
---

### Less

- iview 使用样式文件覆盖设置自定义主题时，可能会遇到`Inline JavaScript is not enabled. Is it set in your options?`的错误，可能是 less 版本过高引起。

解决：降低 less 版本，降级到 3.0 以下。

- `calc`问题。

less 文件内：

```javascript
.category-item + .category-item {
    margin-left: calc((100% - 240px) / 3);
 }
```

预期解析输出：
      ![image.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1607673559270-a10d282d-e70f-4600-95a2-3d8955990499.png#align=left&display=inline&height=75&margin=%5Bobject%20Object%5D&name=image.png&originHeight=75&originWidth=308&size=8581&status=done&style=none&width=308)
实际解析输出（将 240px 作为百分比进行计算了）：
![image.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1607673447433-c817c3e1-9b95-423b-a0a5-21072b273325.png#align=left&display=inline&height=71&margin=%5Bobject%20Object%5D&name=image.png&originHeight=71&originWidth=308&size=7728&status=done&style=none&width=308)
解决（将表达式内容置于`~""`内）：

```javascript
.category-item + .category-item {
    margin-left: calc(~"100% / 3 - 240px / 3");
 }
```

### window.open

在网页开发时经常会使用到 window.open 打开新标签页，但是在部分浏览器（Safari 等）内，js 自主触发该方法可能会被拦截。

```javascript
// 解决：提前打开空白标签页，然后定位新标签页地址
let win_open = window.open("", "_blank"); // 空白标签页
api()
  .then((res) => {
    // 重定向
    win_open.location = "xxxxx/xxxxx";
  })
  .catch((err) => {
    // 关闭该新标签页
    win_open.close();
  });
```
