---
title: swiper4.0自动轮播+循环轮播
urlname: piua4g
date: 2019-01-21 10:09:43 +0800
tags: []
categories: []
---

1、点击导致自动轮播停止：

```
autoplay: {
  disableOnInteraction: false, //手动滑动之后不打断播放
  delay: 2000
},
```

2、循环轮播（需要继续左滑至第一张，非返回第一张）

条件：需要在 html 和图片加载完之后进行 swiper 初始化；

```
var swiper = new Swiper(".swiper-container", {
                loop: true,
                slidesPerView: "auto",
                // loopedSlides: _this.bannerList.length,
                speed: 300,
                autoplay: {
                  disableOnInteraction: false, //手动滑动之后不打断播放
                  delay: 2000
                },
                observer: true, //监听，当改变swiper的样式（例如隐藏/显示）或者修改swiper的子元素时，自动初始化swiper。
                pagination: {
                  el: ".swiper-pagination"
                }
              });
```

问题：会产生空白页（由于懒加载，去掉图片的懒加载就好了）。
