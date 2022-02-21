---
title: css position sticky（css的粘性定位）
urlname: fzvfak
date: '2019-02-12 09:42:14 +0800'
tags:
  - css
categories:
  - CSS/Less
---

> 在 css 内 position 的含义是指定位类型，取值类型可以有：static、relative、absolute、fixed、inherit 和 sticky，这里 sticky 是 CSS3 新发布的一个属性。

原来在页面设计中时常会遇到所谓的“吸顶”的效果，如下图（当页面滑动至介绍部分时介绍栏需要有一个吸顶效果）：
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1549936020128-7ed27eaa-85eb-4314-a859-e7d54b15cac1.png#height=466&id=ONAin&name=image.png&originHeight=466&originWidth=399&originalType=binary∶=1&size=153632&status=done&style=none&width=399)
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1549936102348-7eed426c-9cd7-495a-bc71-93e85524f68e.png#height=353&id=QCg8K&name=image.png&originHeight=353&originWidth=398&originalType=binary∶=1&size=161946&status=done&style=none&width=398)

原来的实现方式是采用 js 监听滑动并对需要吸顶的内容进行定位设置。
但是现在使用`sticky`也可以直接实现。

对需要吸顶的元素设置 sticky 属性：

```javascript
.main-header {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
}
```

效果：
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1549937063469-3f821c80-4e14-4035-9f6d-bdf52c1b4b0a.png#height=363&id=HiJ0r&name=image.png&originHeight=363&originWidth=408&originalType=binary∶=1&size=12745&status=done&style=none&width=408)

完整：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Page Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        color: #fff;
        font-family: arial;
        font-weight: bold;
        font-size: 40px;
      }

      .main-container {
        max-width: 600px;
        margin: 0 auto;
        border: solid 10px green;
        padding: 10px;
        margin-top: 40px;
      }

      .main-container * {
        padding: 10px;
        background: #aaa;
        border: dashed 5px #000;
      }

      .main-container * + * {
        margin-top: 20px;
      }

      .main-header {
        height: 50px;
        background: #aaa;
        border-color: red;
      }

      .main-content {
        min-height: 1000px;
      }

      .main-header {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
      }
    </style>
  </head>

  <body>
    <main class="main-container">
      <header class="main-header">HEADER</header>
      <div class="main-content">MAIN CONTENT</div>
      <footer class="main-footer">FOOTER</footer>
    </main>
  </body>
</html>
```

总结：
比较不好的是这个属性的兼容性还不是很好，它之所以会出现，也是因为监听`scroll`事件来实现粘性布局使浏览器进入慢滚动的模式，这与浏览器想要通过硬件加速来提升滚动的体验是相悖的。
　　这个属性使用的浏览器只有 FireFox 和 iOS 的 Safari：
![](https://cdn.nlark.com/yuque/0/2019/png/250093/1549937196181-a18925ca-f6f3-4dab-b56f-efc03b7f0dcc.png#height=311&id=UOf8U&originHeight=493&originWidth=1181&originalType=binary∶=1&size=0&status=done&style=none&width=746)

还有要让 sticky 属性生效需要满足以下两点：

- 元素自身在文档流中的位置
- 该元素的父容器的边缘

第一点如果设置了 top: 50px，那么元素在达到距离顶部 50px 时才会发生定位，否则并不会发生定位。
　　第二点则需要考虑父容器的高度情况：如果父容器高度并没有比 sticky 元素高，那么 sticky 元素一开始就达到了底部，并不会有定位的效果。
　　第三点就是父元素的 overflow 属性，如果父元素的 overflow 属性并不是默认的 visible 属性，那么 sticky 元素则相对于该父元素定位。也就是如果要定位在顶部的话，此时这个效果就无效了。

参考教程：[CSS 粘性定位是怎样工作的](https://segmentfault.com/a/1190000018113832) （介绍了更多相关的性质）
          CSS 中 position 属性介绍(新增 sticky)
