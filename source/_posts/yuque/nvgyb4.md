---
title: Weekly sharing 02（20190304）
urlname: nvgyb4
date: '2019-03-08 10:38:38 +0800'
tags: []
categories: []
---

![微信图片_20190305162724.jpg](https://cdn.nlark.com/yuque/0/2019/jpeg/250093/1551774465093-1ce923b2-9218-49db-95aa-080d214e7931.jpeg#align=left&display=inline&height=560&name=%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190305162724.jpg&originHeight=1080&originWidth=1440&size=327112&status=done&width=746)
（题图 杭州 2019 冬）

#### 原理

1、访问微博时的运转流程（[Nginx+PHP-FPM 的工作原理](https://juejin.im/post/58db7d742f301e007e9a00a7)）：
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

#### 教程

1、新认识的 css 属性--box-decoration-break

> MDN 上英文释意为：The box-decoration-break CSS property specifies how an element's fragments should be rendered when broken across multiple lines, columns, or pages。大意是 box-decoration-break 属性规定了一个元素片段在发生折行/断行时，应该如何被渲染。

该属性的取值：

```
{
    box-decoration-break: slice;   // 默认取值
    box-decoration-break: clone;
}
```

该属性主要作用于内联元素，当取值为 clone 时，换行的元素将被赋予相同的样式，最简单的例子：

```html
<view class="my-text">
  The <text>box-decoration-break</text> CSS property specifies how an element's
  fragments should be rendered when broken across multiple lines, columns, or
  pages..Each box fragment is rendered independently with the
  <text>specified border, padding, and margin wrapping each fragment.</text> The
  border-radius, border-image, and box-shadow are applied to each
  <text>fragment independently.</text>
</view>
```

```css
.my-text {
  font-size: 22px;
  line-height: 36px;
}

.my-text text {
  background-image: linear-gradient(135deg, deeppink, yellowgreen);
  color: #fff;
  padding: 2px 10px;
  border-radius: 50% 3em 50% 3em;
  box-decoration-break: clone;
}
```

无该属性时效果：（可以看出文字断行时样式同时也会被截断）
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1551775424204-bf6704fb-5de1-417c-9728-9c46a24a56db.png#align=left&display=inline&height=189&name=image.png&originHeight=260&originWidth=656&size=90942&status=done&width=478)

为 text 增加该属性：（这样显然美观很多）
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1551775533505-107f200a-effc-4e52-83d2-7ec3b5cc7118.png#align=left&display=inline&height=193&name=image.png&originHeight=267&originWidth=667&size=92501&status=done&width=482)

2、[实战情况下的函数防抖和节流](https://segmentfault.com/a/1190000018383955)

> JavaScript 的执行过程，是基于栈来进行的。复杂的程序代码被封装到函数中，程序执行时，函数不断被推入执行栈中，所以  **"执行栈"**  也称  **"函数执行栈"**。

在函数被频繁调用时将会造成较大的性能开销也比较大，所以就需要“防抖”和“节流”。

- 防抖（debounce)
  > 在事件被触发 n 秒后再执行回调函数，如果在这 n 秒内又被触发，则重新计时延迟时间。

实现方式：“立即执行”和“非立即执行”。
函数防抖原理：通过维护一个定时器，其延迟计时以最后一次触发为计时起点，到达延迟时间后才会触发函数执行。

- 节流（throttle)
  > 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效（间隔执行）

实现方式：“时间戳”和“定时器”。
函数节流原理：一定时间内只触发一次，间隔执行。通过判断是否到达指定触发时间，间隔时间固定。

主要的应用场景：
防抖

1. 文本输入搜索联想
1. 文本输入验证（包括 Ajax 后端验证）

节流

1. 鼠标点击
1. 监听滚动  `scroll`
1. 窗口  `resize`
1. `mousemove`  拖拽

实际代码开发中，一般会引入`lodash`  等相对 “靠谱” 的第三方库，帮我们去实现防抖节流的工具函数。

3、[canvas 绘制](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)（<-- MDN 文档）
相信`canvas`会是很多人初学前端知识的时候会接触到的，但是在后来的学习中除游戏开发外基本不会用到的东西，现在想来重拾一下`canvas`的知识。

- 先在页面内设置一个画布：

```html
<canvas id="theCanvas" width="800" height="400"></canvas>
```

- 在 js 内需判断当前浏览器是否支持 canvas：
-

```javascript
let theCanvas = document.querySelector("#theCanvas");
if (!theCanvas || !theCanvas.getContext()) {
  alert("该浏览器不支持canvas!");
} else {
}
```

- 获得其 2d 对象
-

```javascript
let context = theCanvas.getContext("2d");
```

- 鼠标绘制只要在于 onmousedown 事件和 onmousemove 事件
-

```javascript
(function () {
  let theCanvas = document.querySelector("#theCanvas");
  if (!theCanvas || !theCanvas.getContext("2d")) {
    alert("该浏览器不支持canvas!");
  } else {
    let context = theCanvas.getContext("2d");
    let isAllowDrawLine = false;
    // 为其绑定鼠标按下的事件
    theCanvas.onmousedown = function (e) {
      isAllowDrawLine = true;
      let ele = windowToCanvas(theCanvas, e.clientX, e.clientY);
      let { x, y } = ele; // 解构
      // 绘制起点
      context.moveTo(x, y);
      // 长按时监听鼠标移动
      theCanvas.onmousemove = (e) => {
        if (isAllowDrawLine) {
          let ele = windowToCanvas(theCanvas, e.clientX, e.clientY);
          let { x, y } = ele;
          context.lineTo(x, y);
          context.stroke(); // 连接绘制
        }
      };
    };
    document.onmouseup = () => {
      isAllowDrawLine = false;
    };
  }
})();
// 获取当前鼠标相对于canvas的坐标
const windowToCanvas = (canvas, x, y) => {
  let rect = canvas.getBoundingClientRect();
  return {
    x: x - rect.left * (canvas.width / rect.width),
    y: y - rect.top * (canvas.height / rect.height),
  };
};
```

最终效果：
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1551843164284-92775a3b-9c89-430a-83e7-f558ccd3ed13.png#align=left&display=inline&height=168&name=image.png&originHeight=168&originWidth=259&size=4466&status=done&width=259)

#### 工具

1、[Chrome 模拟微信浏览器](https://www.yuque.com/httishere/share/zow67c/edit) -- UA（User agent：用户代理）
安卓微信 UA： mozilla/5.0 (linux; u; android 4.1.2; zh-cn; mi-one plus build/jzo54k) applewebkit/534.30 (khtml, like gecko) version/4.0 mobile safari/534.30 micromessenger/5.0.1.352  
Ios 微信 UA：  mozilla/5.0 (iphone; cpu iphone os 5_1_1 like mac os x) applewebkit/534.46 (khtml, like gecko) mobile/9b206 micromessenger/5.0 
使用方法：

- 打开浏览的开发者模式

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1552008628959-0fd5cbc7-1f5c-4782-abef-aa340929bf73.png#align=left&display=inline&height=294&name=image.png&originHeight=294&originWidth=317&size=44355&status=done&width=317)

- 增加代理（选择你需要的环境 UA）

![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1552008636767-dd0edb9b-278a-44d1-8f6a-6f3e87534793.png#align=left&display=inline&height=278&name=image.png&originHeight=278&originWidth=630&size=24368&status=done&width=630)

#### 文摘

1、AI 生成人脸
Philip Wang，他是一位来自 Uber 的软件工程师。他利用英伟达去年发布的研究成果创作了源源不断的假人像。「每次你刷新这个网站，网络就会从头开始生成新的人脸图像。
[https://thispersondoesnotexist.com/](https://thispersondoesnotexist.com/)
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1551775809431-67b3e1d2-08c3-4caf-9d87-d4591c0cf71f.png#align=left&display=inline&height=525&name=image.png&originHeight=687&originWidth=476&size=487489&status=done&width=364)

2、程序员成长之路
会用->会查和避免问题->懂高级的 API 和原理->系统设计能力的成长。
程序员的价值关键体现在作品上，被打上作品标签是很大的荣幸。作品影响程度的大小决定了金字塔的层次，所以我会这么去理解程序员的金字塔。
塔尖：有世界级作品的
塔中：有国民作品的
塔基：有公司级作品的
（来源：[阿里毕玄现身说法：程序员成长路线](https://mp.weixin.qq.com/s/nUtUu6e_bXHvb_06Pf_05g)）

3、uber 开源
Kraken: uber 开源的基于 P2P 的 docker 镜像仓库，专注于可扩展性和可用性。它专为混合云环境中的 docker 镜像管理，复制和分发而设计。在 uber 最繁忙的集群中，Kraken 每天分发超过 100 万个 blob，包括 100k 1G + blob。在最高生产负荷下，Kraken 在 30 秒内分配 20K 100MB-1G 的 blob。
库-->[https://github.com/uber/kraken](https://github.com/uber/kraken)
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1552009011507-c15ee47b-bae5-4112-adc4-1f24aa5d9cc8.png#align=left&display=inline&height=356&name=image.png&originHeight=601&originWidth=907&size=178044&status=done&width=537)
（来源：微博@tonybai_cn）
