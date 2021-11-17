---
title: ios10以下版本内浏览器无法打开vue项目
urlname: lkmfgo
date: '2019-01-21 09:53:08 +0800'
tags: []
categories: []
---

在项目（vue）测试过程中发现，ios10 一下版本的浏览器均无法正常加载，出现白屏现象，开始以为是不支持 es6 语法的原因，但是添加 es6 转 es5 的配置之后还是无法加载，_通过找了一系列方法发现可能是 swiper 造成的（首页使用了 swiper 进行图片轮播）_。

解决：将 swiper4.4.1->3.4.2，并修改一定的语法。

```
// 4.4.1
var swiper = new Swiper(".swiper-container", {
  loop: true,
  speed: 800,
  autoplay: {
    disableOnInteraction: false, //手动滑动之后不打断播放
    delay: 2000
  },
  observer: true, //监听，当改变swiper的样式（例如隐藏/显示）或者修改swiper的子元素时，自动初始化swiper。
  pagination: {
    el: ".swiper-pagination"
  }
});
// 3.4.2
var swiper = new Swiper(".swiper-container", {
  loop: true,
  speed: 800,
  autoplay: 2000,
  autoplayDisableOnInteraction: false,
  observer: true, //监听，当改变swiper的样式（例如隐藏/显示）或者修改swiper的子元素时，自动初始化swiper。
  pagination : '.swiper-pagination',
});
```
