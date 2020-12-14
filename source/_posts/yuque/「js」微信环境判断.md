---
title: 「js」微信环境判断
urlname: fgk9iw
date: 2020-02-06 11:10:23 +0800
tags: []
categories: []
---

tags: [js, wx]
categories: [js]
cover:

---

<!-- more -->

通过对 user-agent 参数包含的信息进行判断：

```javascript
const is_wechat = () => {
  var ua = window.navigator.userAgent.toLowerCase();
  return (
    ua.match(/MicroMessenger/i) == "micromessenger" ||
    ua.match(/_SQ_/i) == "_sq_"
  );
};
```

问题：
在 QQ 内打开相关页面，user-agent 参数如下其中包括`_sq_`，所以在 QQ 内会识别成微信环境。
![image.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1580959388940-8a1c0ff3-5688-4d0b-af7b-fdcf5e05bc18.png#align=left&display=inline&height=180&margin=%5Bobject%20Object%5D&name=image.png&originHeight=360&originWidth=828&size=299978&status=done&style=none&width=414)
