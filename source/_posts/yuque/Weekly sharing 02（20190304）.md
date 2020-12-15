---
title: Weekly sharing 02（20190304）
urlname: yvtvta
date: 2019-03-08 10:37:41 +0800
tags: []
categories: []
---

（题图 杭州 2019 冬）
原理
1、访问微博时的运转流程（Nginx+PHP-FPM 的工作原理）：
www.weibo.com
|
|
Nginx
|
|
路由到 www.weibo.com/index.php
|
|
加载 nginx 的 fast-cgi 模块
|
|
fast-cgi 监听 127.0.0.1:9000 地址
|
|
www.weibo.com/index.php 请求到达 127.0.0.1:9000
|
|
php-fpm 监听 127.0.0.1:9000
|
|
php-fpm 接收到请求，启用 worker 进程处理请求
|
|
php-fpm 处理完请求，返回给 nginx
|
|
nginx 将结果通过 http 返回给浏览器
（来源：微博@古月中心相心）
教程
1、新认识的 css 属性--box-decoration-break
MDN 上英文释意为：The box-decoration-break CSS property specifies how an element's fragments should be rendered when broken across multiple lines, columns, or pages。大意是 box-decoration-break 属性规定了一个元素片段在发生折行/断行时，应该如何被渲染。
该属性的取值：
该属性主要作用于内联元素，当取值为 clone 时，换行的元素将被赋予相同的样式，最简单的例子：
无该属性时效果：（可以看出文字断行时样式同时也会被截断）
为 text 增加该属性：（这样显然美观很多）
2、实战情况下的函数防抖和节流
JavaScript 的执行过程，是基于栈来进行的。复杂的程序代码被封装到函数中，程序执行时，函数不断被推入执行栈中，所以 "执行栈" 也称 "函数执行栈"。
在函数被频繁调用时将会造成较大的性能开销也比较大，所以就需要“防抖”和“节流”。
防抖（debounce)
在事件被触发 n 秒后再执行回调函数，如果在这 n 秒内又被触发，则重新计时延迟时间。
实现方式：“立即执行”和“非立即执行”。
函数防抖原理：通过维护一个定时器，其延迟计时以最后一次触发为计时起点，到达延迟时间后才会触发函数执行。
节流（throttle)
规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效（间隔执行）
实现方式：“时间戳”和“定时器”。
函数节流原理：一定时间内只触发一次，间隔执行。通过判断是否到达指定触发时间，间隔时间固定。
主要的应用场景：
防抖
文本输入搜索联想
文本输入验证（包括 Ajax 后端验证）
节流
鼠标点击
监听滚动 scroll
窗口 resize
mousemove 拖拽
实际代码开发中，一般会引入 lodash 等相对 “靠谱” 的第三方库，帮我们去实现防抖节流的工具函数。
3、canvas 绘制（<-- MDN 文档）
相信`canvas`会是很多人初学前端知识的时候会接触到的，但是在后来的学习中除游戏开发外基本不会用到的东西，现在想来重拾一下`canvas`的知识。
先在页面内设置一个画布：
在 js 内需判断当前浏览器是否支持 canvas：
获得其 2d 对象
鼠标绘制只要在于 onmousedown 事件和 onmousemove 事件
最终效果：
工具
1、Chrome 模拟微信浏览器 -- UA（User agent：用户代理）
安卓微信 UA： mozilla/5.0 (linux; u; android 4.1.2; zh-cn; mi-one plus build/jzo54k) applewebkit/534.30 (khtml, like gecko) version/4.0 mobile safari/534.30 micromessenger/5.0.1.352
Ios 微信 UA： mozilla/5.0 (iphone; cpu iphone os 5_1_1 like mac os x) applewebkit/534.46 (khtml, like gecko) mobile/9b206 micromessenger/5.0
使用方法：
打开浏览的开发者模式
增加代理（选择你需要的环境 UA）
文摘
1、AI 生成人脸
Philip Wang，他是一位来自 Uber 的软件工程师。他利用英伟达去年发布的研究成果创作了源源不断的假人像。「每次你刷新这个网站，网络就会从头开始生成新的人脸图像。
[https://thispersondoesnotexist.com/](https://thispersondoesnotexist.com/)
2、程序员成长之路
会用->会查和避免问题->懂高级的 API 和原理->系统设计能力的成长。
程序员的价值关键体现在作品上，被打上作品标签是很大的荣幸。作品影响程度的大小决定了金字塔的层次，所以我会这么去理解程序员的金字塔。
塔尖：有世界级作品的
塔中：有国民作品的
塔基：有公司级作品的
（来源：阿里毕玄现身说法：程序员成长路线）
3、uber 开源
Kraken: uber 开源的基于 P2P 的 docker 镜像仓库，专注于可扩展性和可用性。它专为混合云环境中的 docker 镜像管理，复制和分发而设计。在 uber 最繁忙的集群中，Kraken 每天分发超过 100 万个 blob，包括 100k 1G + blob。在最高生产负荷下，Kraken 在 30 秒内分配 20K 100MB-1G 的 blob。
库-->[https://github.com/uber/kraken](https://github.com/uber/kraken)
（来源：微博@tonybai_cn）
