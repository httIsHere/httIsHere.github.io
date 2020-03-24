
---

title: Weekly sharing 02（20190304）

urlname: yvtvta

date: 2019-03-08 10:37:41 +0800

tags: []

categories: []

---
（题图 杭州 2019冬）<br />原理<br />1、访问微博时的运转流程（Nginx+PHP-FPM的工作原理）：<br />www.weibo.com<br />|<br />|<br />Nginx<br />|<br />|<br />路由到www.weibo.com/index.php<br />|<br />|<br />加载nginx的fast-cgi模块<br />|<br />|<br />fast-cgi监听127.0.0.1:9000地址<br />|<br />|<br />www.weibo.com/index.php请求到达127.0.0.1:9000<br />|<br />|<br />php-fpm 监听127.0.0.1:9000<br />|<br />|<br />php-fpm 接收到请求，启用worker进程处理请求<br />|<br />|<br />php-fpm 处理完请求，返回给nginx<br />|<br />|<br />nginx将结果通过http返回给浏览器<br />（来源：微博@古月中心相心）<br />教程<br />1、新认识的css属性--box-decoration-break<br />MDN 上英文释意为：The box-decoration-break CSS property specifies how an element's fragments should be rendered when broken across multiple lines, columns, or pages。大意是 box-decoration-break 属性规定了一个元素片段在发生折行/断行时，应该如何被渲染。<br />该属性的取值：<br />该属性主要作用于内联元素，当取值为clone时，换行的元素将被赋予相同的样式，最简单的例子：<br />无该属性时效果：（可以看出文字断行时样式同时也会被截断）<br />为text增加该属性：（这样显然美观很多）<br />2、实战情况下的函数防抖和节流<br />JavaScript的执行过程，是基于栈来进行的。复杂的程序代码被封装到函数中，程序执行时，函数不断被推入执行栈中，所以 "执行栈" 也称 "函数执行栈"。<br />在函数被频繁调用时将会造成较大的性能开销也比较大，所以就需要“防抖”和“节流”。<br />防抖（debounce)<br />在事件被触发 n 秒后再执行回调函数，如果在这 n 秒内又被触发，则重新计时延迟时间。<br />实现方式：“立即执行”和“非立即执行”。<br />函数防抖原理：通过维护一个定时器，其延迟计时以最后一次触发为计时起点，到达延迟时间后才会触发函数执行。<br />节流（throttle)<br />规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效（间隔执行）<br />实现方式：“时间戳”和“定时器”。<br />函数节流原理：一定时间内只触发一次，间隔执行。通过判断是否到达指定触发时间，间隔时间固定。<br />主要的应用场景：<br />防抖<br />文本输入搜索联想<br />文本输入验证（包括 Ajax 后端验证）<br />节流<br />鼠标点击<br />监听滚动 scroll<br />窗口 resize<br />mousemove 拖拽<br />实际代码开发中，一般会引入lodash 等相对 “靠谱” 的第三方库，帮我们去实现防抖节流的工具函数。<br />3、canvas绘制（<-- MDN文档）<br />相信`canvas`会是很多人初学前端知识的时候会接触到的，但是在后来的学习中除游戏开发外基本不会用到的东西，现在想来重拾一下`canvas`的知识。<br />先在页面内设置一个画布：<br />在js内需判断当前浏览器是否支持canvas：<br />获得其2d对象<br />鼠标绘制只要在于onmousedown事件和onmousemove事件<br />最终效果：<br />工具<br />1、Chrome模拟微信浏览器 -- UA（User agent：用户代理）<br />安卓微信UA： mozilla/5.0 (linux; u; android 4.1.2; zh-cn; mi-one plus build/jzo54k) applewebkit/534.30 (khtml, like gecko) version/4.0 mobile safari/534.30 micromessenger/5.0.1.352<br />Ios微信UA：  mozilla/5.0 (iphone; cpu iphone os 5_1_1 like mac os x) applewebkit/534.46 (khtml, like gecko) mobile/9b206 micromessenger/5.0<br />使用方法：<br />打开浏览的开发者模式<br />增加代理（选择你需要的环境UA）<br />文摘<br />1、AI生成人脸<br />Philip Wang，他是一位来自 Uber的软件工程师。他利用英伟达去年发布的研究成果创作了源源不断的假人像。「每次你刷新这个网站，网络就会从头开始生成新的人脸图像。<br />[https://thispersondoesnotexist.com/](https://thispersondoesnotexist.com/)<br />2、程序员成长之路<br />会用->会查和避免问题->懂高级的API和原理->系统设计能力的成长。<br />程序员的价值关键体现在作品上，被打上作品标签是很大的荣幸。作品影响程度的大小决定了金字塔的层次，所以我会这么去理解程序员的金字塔。<br />塔尖：有世界级作品的<br />塔中：有国民作品的<br />塔基：有公司级作品的<br />（来源：阿里毕玄现身说法：程序员成长路线）<br />3、uber开源<br />Kraken: uber开源的基于P2P的docker镜像仓库，专注于可扩展性和可用性。它专为混合云环境中的docker镜像管理，复制和分发而设计。在uber最繁忙的集群中，Kraken每天分发超过100万个blob，包括100k 1G + blob。在最高生产负荷下，Kraken在30秒内分配20K 100MB-1G的blob。<br />库-->[https://github.com/uber/kraken](https://github.com/uber/kraken)<br />（来源：微博@tonybai_cn）


