---
title: 「js/vue/h5支付宝支付」在h5内使用支付宝支付时，发现取消支付返回页面页面所有js事件都无法触发
urlname: zxnimu
date: 2020-10-23 15:45:04 +0800
tags: []
categories: []
---

情况：

当前 h5 活动页需要用到支付宝支付，于是采用了一下代码。

```html
<!-- alipayWap: 后台接口返回的form 片段，用于拉起支付宝支付 -->
<div v-html="alipayWap" ref="alipayWap"></div>
```

```javascript
_this.alipayWap = _msg.content; // 服务端返回的支付form
_this.$nextTick(() => {
  _this.$refs.alipayWap.children[0].submit(); // 触发拉起支付宝
});
```

问题：
可以正常拉起支付宝支付，但是取消支付返回活动页面后页面所有 js 事件都无法触发，不会触发点击事件等。

采用这样就不会了：

```javascript
_this.alipayWap = _msg.content;
let div = document.createElement("div");
div.setAttribute("id", "alipay-wap");
/* 此处form就是后台返回接收到的数据 */
div.innerHTML = _msg.content;
document.body.appendChild(div);
document.forms["alipay_submit"].submit();
setTimeout(function () {
  _this.alipayWap = "";
  $("#alipay-wap").remove(); // 拉起支付宝后移除dom
}, 1000);
```
