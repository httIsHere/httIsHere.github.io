---
title: 2020.03.18 QS(04.17更新)
urlname: zdoq3p
date: '2020-03-18 10:19:24 +0800'
tags:
  - daily
  - QS
categories:
  - Daily
---

> 记录日常问题

<!-- more -->

#### 1、\$.ajax 请求方法为 post 时传参问题

原先：发现 data 参数是直接以拼接的方式传递，导致后台无法正确获取参数。

```javascript
$.ajax({
  type: "POST",
  url,
  dataType: "json",
  data: params,
  headers: {
    Authorization: "Bearer " + JSON.parse(_this.token),
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
  success(res) {},
});
```

解决：
去掉`dataType: "json"`和`"Content-Type": "application/json"`。

#### 2、注册密码输入框表现形式，可通过动态提示密码要求来提高交互性，如下：vultr 官网

![image.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1584947869189-6c02b1cc-d402-4ae3-857a-3194591796cc.png#align=left&display=inline&height=407&margin=%5Bobject%20Object%5D&name=image.png&originHeight=407&originWidth=754&size=164405&status=done&style=none&width=754)

#### 3、yuque-hexo 升级后拉取语雀文章 list 包权限错误

![yuque-hexo-error.PNG](https://cdn.nlark.com/yuque/0/2020/png/250093/1584949994741-fcc831b7-3456-4262-8e2b-279bd2d8bd96.png#align=left&display=inline&height=59&margin=%5Bobject%20Object%5D&name=yuque-hexo-error.PNG&originHeight=59&originWidth=719&size=5650&status=done&style=none&width=719)
解决：
在 package.json 的 yuqueConfig 新增私人 token 配置。
![yuque-hexo-token.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1584950263184-edaa0783-73e4-4d42-aadc-8d4d65f4316b.png#align=left&display=inline&height=159&margin=%5Bobject%20Object%5D&name=yuque-hexo-token.png&originHeight=159&originWidth=432&size=7027&status=done&style=none&width=432)

--> [个人 token 获取](https://www.yuque.com/yuque/developer/api#785a3731) <--

#### 4、hexo dev 时报错

YAMLException: can not read a block mapping entry; a multiline key may not be an implicit key at line 6, column 8

原因：

- \_config.yml 文件内英文冒号后面需要有一个空格
- 文章标题内不能存在特殊标识比如我在标题内加了[]方括号也会导致错误

#### 5、在使用[yuque-hexo](https://github.com/x-cold/yuque-hexo)拉取文章时会出现图片加载失败

yuque 的防盗链问题，解决方法在 hexo 页面的模板文件头部增加：[yuque-hexo/issue/#41](https://github.com/x-cold/yuque-hexo/issues/41)

```html
<meta name="referrer" content="no-referrer" />
```

Referrer Policy(引用策略)
引用策略就是从一个文档发出请求时，是否在请求头部定义 Referrer 的设置。

很多网站的防盗链机制都是用头部定义 Referrer 来判断是否是盗链。

Referrer Policy 的值

- 空字符串：默认值，一般浏览器的默认值是 no-referrer-when-downgrade；
- no-referrer：所有请求不发送 referrer；
- no-referrer-when-downgrade：当请求安全级别下降时不发送 referrer。目前，只有一种情况会发生安全级别下降，即从 HTTPS 到 HTTP。HTTPS 到 HTTP 的资源引用和链接跳转都不会发送 referrer
- same-origin：对于同源的链接和引用发送 referrer，其他的不会，同源的意思是指同一个域名且同一协议；
- origin：会发送 referrer，但只会发送源信息，源信息包括访问协议和域名；
- strict-origin：相当于 origin 和 no-referrer-when-downgrade 的 AND 合体，即在安全级别下降时不发送 referrer；安全级别未下降时发送源信息，新加的标准，有些浏览器可能还不支持；
- origin-when-cross-origin：相当于 origin 和 same-origin 的 OR 合体，同源的链接和引用，会发送完全的 referrer 信息；但非同源链接和引用时，只发送源信息；
- strict-origin-when-cross-origin：同源的链接和引用，会发送 referrer，安全级别下降时不发送 referrer，其它情况下发送源信息（New）；yarn
- unsafe-url：无论是否发生协议降级，无论是本站链接还是站外链接，统统都发送 Referrer 信息；

引用策略说明转自：[Web 页面 Meta 的 Referrer Policy](https://www.jianshu.com/p/b12c5b4fd9df)

#### 6、更换远端 GitHub 库之后出现 pull 和 push 失败的问题

报错：fatal: refusing to merge unrelated histories
将本地的库更换远端之后，使用然后本地库去推送到远端， 远端库觉得这个本地库跟自己不相干， 所以告知无法合并。

- 最好将远端库重新 clone 下来，把本地代码放进去再推送。
- 当然也可以强行合并

`git pull origin master --allow-unrelated-histories`，后面加上`--allow-unrelated-histories` ， 把两段不相干的 分支进行强行合并。
