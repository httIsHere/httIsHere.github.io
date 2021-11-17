---
title: 微信小程序自定义组件使用canvas绘图，无法绘制以及fail canvas is empty问题
urlname: cbxdth
date: '2019-11-26 11:55:10 +0800'
tags:
  - canvas
categories:
  - 微信小程序
cover:
---

<!-- more -->

情况 1：普通页面，canvas 绘制，正常，生成图片正常；

情况 2：自定义组件引用 canvas 绘制，空白；
原因：查看文档，在自定义组件内需要手动传入当前实例的 this，否则 canvas 指向的 this 为父组件所以无法找到正确 canvas；
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1574740757955-44eee736-554f-4bb3-a6a9-9cb1f1bc6e1f.png#align=left&display=inline&height=351&margin=%5Bobject%20Object%5D&name=image.png&originHeight=351&originWidth=885&size=39059&status=done&style=none&width=885)

情况 3：自定义组件内，canvas 绘制好了，但是`canvasToTempFilePath`报 fail canvas is empty 错误；
原因：同上，但是 canvasToTempFilePath({}, this)添加 this 可能无法解决，因为我使用的小程序框架是 Taro，在 Taro 的页面和组件类中，this 指向的是 Taro 页面或组件实例。
所以一般我们需要获取 Taro 的页面和组件所对应的小程序原生页面和组件实例，这个时候我们可以通过 this.\$scope 访问到它们；
所以最后写成：

```javascript
Taro.createCanvasContext("canvas-id", this.$scope);
Taro.canvasToTempFilePath({}, this.$scope);
```
