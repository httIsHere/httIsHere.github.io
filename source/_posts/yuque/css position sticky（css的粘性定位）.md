
---

title: css position sticky（css的粘性定位）

urlname: fzvfak

date: 2019-02-12 09:42:14 +0800

tags: []

categories: []

---
> 在css内position的含义是指定位类型，取值类型可以有：static、relative、absolute、fixed、inherit和sticky，这里sticky是CSS3新发布的一个属性。


原来在页面设计中时常会遇到所谓的“吸顶”的效果，如下图（当页面滑动至介绍部分时介绍栏需要有一个吸顶效果）：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1549936020128-7ed27eaa-85eb-4314-a859-e7d54b15cac1.png#align=left&display=inline&height=466&name=image.png&originHeight=466&originWidth=399&size=153632&width=399)<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1549936102348-7eed426c-9cd7-495a-bc71-93e85524f68e.png#align=left&display=inline&height=353&name=image.png&originHeight=353&originWidth=398&size=161946&width=398)

原来的实现方式是采用js监听滑动并对需要吸顶的内容进行定位设置。<br />但是现在使用`sticky`也可以直接实现。

对需要吸顶的元素设置sticky属性：

```javascript
.main-header {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
}
```

效果：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1549937063469-3f821c80-4e14-4035-9f6d-bdf52c1b4b0a.png#align=left&display=inline&height=363&name=image.png&originHeight=363&originWidth=408&size=12745&width=408)

![](https://cdn.nlark.com/yuque/0/2019/png/250093/1549937022077-730b8a25-40f2-41f8-a144-0871c8ffc0e8.png)<br /> <br />完整：

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Page Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
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

        .main-container *+* {
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

总结：<br />比较不好的是这个属性的兼容性还不是很好，它之所以会出现，也是因为监听`scroll`事件来实现粘性布局使浏览器进入慢滚动的模式，这与浏览器想要通过硬件加速来提升滚动的体验是相悖的。<br />　　这个属性使用的浏览器只有FireFox和iOS的Safari：<br />![](https://cdn.nlark.com/yuque/0/2019/png/250093/1549937196181-a18925ca-f6f3-4dab-b56f-efc03b7f0dcc.png#align=left&display=inline&height=311&originHeight=493&originWidth=1181&size=0&width=746)

还有要让sticky属性生效需要满足以下两点：

- 元素自身在文档流中的位置
- 该元素的父容器的边缘

　　第一点如果设置了top: 50px，那么元素在达到距离顶部50px时才会发生定位，否则并不会发生定位。<br />　　第二点则需要考虑父容器的高度情况：如果父容器高度并没有比sticky元素高，那么sticky元素一开始就达到了底部，并不会有定位的效果。<br />　　第三点就是父元素的overflow属性，如果父元素的overflow属性并不是默认的visible属性，那么sticky元素则相对于该父元素定位。也就是如果要定位在顶部的话，此时这个效果就无效了。

参考教程：[CSS粘性定位是怎样工作的](https://segmentfault.com/a/1190000018113832) （介绍了更多相关的性质）<br />          [CSS中position属性介绍(新增sticky)]()


