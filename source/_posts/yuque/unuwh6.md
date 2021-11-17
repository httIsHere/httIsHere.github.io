---
title: 微信开发目前遇到的一些坑
urlname: unuwh6
date: '2019-01-21 17:06:49 +0800'
tags: []
categories: []
---

1、video 在安卓微信内的表现（- -）

- 层级始终置顶，会遮挡页面上其他元素；

video 的 z-index 无论设置为多少，他始终处于最顶层。

![](https://cdn.nlark.com/yuque/0/2019/jpeg/250093/1548061614599-76110260-27cc-47bd-bb4c-ce56d38e8ab6.jpeg#align=left&display=inline&height=1291&originHeight=1920&originWidth=1080&size=0&width=726)

![](https://cdn.nlark.com/yuque/0/2019/jpeg/250093/1548061614505-6c5062ea-dc0c-48f3-a7c9-665bf67d30de.jpeg#align=left&display=inline&height=1326&originHeight=1920&originWidth=1080&size=0&width=746)

- 进行 x5 调试的话，播放视频将全屏；

![](https://cdn.nlark.com/yuque/0/2019/png/250093/1548061615110-c039680c-9765-4c56-bfb2-8f6fc70b10cc.png#align=left&display=inline&height=764&originHeight=764&originWidth=495&size=0&width=495)

腾讯对 x5 内核的解释以及部分解决方法：[https://x5.tencent.com/tbs/guide/video.html](https://x5.tencent.com/tbs/guide/video.html)
2、video 在 ios 微信内的表现

加载页面时会自动播放视频：

页面内有 video 但是需要触发才能播放，首次进入页面时不会播放视频但是从这个页面进入下一个页面再返回上一个页面时将自动全屏播放视频；

解决：
但是在部分 ios 系统内已解决自动全屏播放视频但是还会存在声音（即无视频显示但实际应该还是在播放视频），处理将`preload="auto"`属性改为`preload="none"`，在加载页面时不加载 video。
3、ios 微信内 SPA 路由问题

条件：SPA，且采用 history 模式；

表现：ios 微信获得`window.location.href`时获得的实际上时进入页的 url 而非当前页的真实地址，从而导致微信分享地址不正确以及微信支付唤起失败（提示 xxx 地址未注册，原因是实际获取到的地址和后台配置的不同）；

粗暴解决：对于需要获得真实地址的页面进入时不使用`router`，直接使用`location.href`进入。
4、新的分享接口

![](https://cdn.nlark.com/yuque/0/2019/png/250093/1548061614823-864a2252-1e4b-4079-915c-a9e2f130535b.png#align=left&display=inline&height=219&originHeight=219&originWidth=590&size=0&width=590)
现象：在安卓微信 6.7.3 内进行分享自定义内容无效，但分享到 QQ 是正常有效的；

![](https://cdn.nlark.com/yuque/0/2019/png/250093/1548061614768-1604b976-9905-47de-a3d1-1c65fd807d83.png#align=left&display=inline&height=120&originHeight=120&originWidth=374&size=0&width=374)
![](https://cdn.nlark.com/yuque/0/2019/png/250093/1548061614843-d734ac65-2d1c-4017-bea6-cffd7c93beaa.png#align=left&display=inline&height=114&originHeight=114&originWidth=257&size=0&width=257)
![](https://cdn.nlark.com/yuque/0/2019/png/250093/1548061614659-7aaa7dde-3938-43d1-98c8-c67d3bc9bab4.png#align=left&display=inline&height=178&originHeight=178&originWidth=361&size=0&width=361)
粗暴解决：最后还是使用了旧的分享接口，但是就接口即将废弃不知道还有什么解决方法。
5、新版本默认背景色非`#FFFFFF`，需自己在样式中对其进行设置。
Finally：微信开发千万别用 SPA，会疯。
