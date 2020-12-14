---
title: 微信小程序获取当前页面options
urlname: no7dmb
date: 2020-01-06 09:57:09 +0800
tags: []
categories: []
---

通过使用 getCurrentPages（获取当前页面栈）获取当前页面时，无法获取有效的页面参数。

```javascript
let pages = getCurrentPages();
let _curPage = pages[pages.length - 1];
console.log(_curPage);
let _curRoute = "/" + _curPage.route;
let _params = "?";
console.log(_curPage.options);
for (let key in _curPage.options) {
  let _value = _curPage.options[key];
  _params += `${key}=${_value}&`;
}
```

console 出来的结果是：
![image.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1578276955847-ba7b03f2-8bb4-4563-b496-7baa223230e4.png#align=left&display=inline&height=331&name=image.png&originHeight=331&originWidth=466&size=37181&status=done&style=none&width=466)
![image.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1578276905495-54a774f6-c7db-4794-9f43-833527d84660.png#align=left&display=inline&height=85&name=image.png&originHeight=85&originWidth=467&size=11391&status=done&style=none&width=467)
获取到的 options 是 undefined。

原因：
getCurrentPages 不能在 App.onLaunch 的时候使用，此时 page 还没有生成，我用的是 Taro 框架，所以不能在 componentWillMount 的使用调用页面栈会获取不到当前页面的正确信息。

Taro 会将原始文件的生命周期钩子函数转换为 Taro 的生命周期，对应关系

|    微信小程序     |          Taro          |
| :---------------: | :--------------------: |
|    Page.onLoad    |   componentWillMount   |
|      onShow       |    componentDidShow    |
|      onHide       |    componentDidHide    |
|      onReady      |   componentDidMount    |
|     onUnload      |  componentWillUnmount  |
|      onError      | componentDidCatchError |
|   App.onLaunch    |   componentWillMount   |
| Component.created |   componentWillMount   |
|     attached      |   componentDidMount    |
|       ready       |   componentDidMount    |
|     detached      |  componentWillUnmount  |
|       moved       |          保留          |
