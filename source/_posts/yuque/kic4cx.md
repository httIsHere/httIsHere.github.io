---
title: 原来好好的页面突然不能操作，如多选框等
urlname: kic4cx
date: '2020-08-14 17:52:58 +0800'
tags:
  - 日常bug
  - daily
categories:
  - Bugs
cover:
---

<!-- more -->

页面开发采用 php blade 和 vue 混合开发，突然发现在使用 chrome 调试的时候不能选择多选框，数据显示也不完整。

使用其他浏览器操作正常。

查看控制台发现`DevTools failed to load SourceMap: Could not load content for`的警告，想着是不是第三方组件库没加载成功的原因，搜索的时候发现有人遇到了类似的警告，他的解决方式是删除迅雷下载的插件，我就突然想起来我最近下了一个新的 chrome 拓展插件，果然，删掉之后就正常了……
