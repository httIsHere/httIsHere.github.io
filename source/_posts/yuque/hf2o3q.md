---
title: 「Daily」Github短信验证没有China+86
urlname: hf2o3q
date: '2022-02-23 09:12:22 +0800'
tags:
  - Daily
categories:
  - Daily
---

> 参看：[Github 短信验证码没有中国区的解决办法](http://blog.csdn.net/aa464971/article/details/83860319)

在使用 Github 时会遇到需要短信验证的时候，但是 Github [Supported countries for SMS authentication](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/countries-where-sms-authentication-is-supported#supported-countries-for-sms-authentication) 列表里面没有中国。

**在验证页面的控制台内手动添加+86:**

```javascript
var option = new Option("China +86", "+86");
option.selected = true;
document.getElementById("countrycode").options.add(option, 0);
```

![截屏2022-02-23 上午9.19.39.png](https://cdn.nlark.com/yuque/0/2022/png/250093/1645579195903-b508f2b4-f601-4a6a-ad61-f1cd73883a96.png#clientId=u3bbf9ba1-ede0-4&crop=0&crop=0&crop=1&crop=1&from=drop&id=uf1e392e7&margin=%5Bobject%20Object%5D&name=%E6%88%AA%E5%B1%8F2022-02-23%20%E4%B8%8A%E5%8D%889.19.39.png&originHeight=326&originWidth=822&originalType=binary∶=1&rotation=0&showTitle=false&size=45285&status=done&style=none&taskId=u37690628-b5be-4f1d-836e-0f3acb3db67&title=)
之后就可以正常进行啦。
