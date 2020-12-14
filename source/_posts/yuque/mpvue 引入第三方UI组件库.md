---
title: mpvue 引入第三方UI组件库
urlname: hh0p31
date: 2019-06-05 13:52:32 +0800
tags: []
categories: []
---

1、下载第三方 UI 组件包，将其 dist 文件夹复制至自己项目下
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1559714105275-093b7242-cbe2-44b6-a3d3-250b711442f8.png#align=left&display=inline&height=210&name=image.png&originHeight=210&originWidth=679&size=24183&status=done&width=679)

2、在需使用组件的页面 json 内引入需要的组件
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1559714798430-aed62fe7-c10c-44b4-978b-d1a56a7adde2.png#align=left&display=inline&height=99&name=image.png&originHeight=99&originWidth=528&size=6287&status=done&width=528)

3、直接在内面内使用组件
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1559714828248-15d7b958-05ba-4ef8-9097-45e203b4145e.png#align=left&display=inline&height=382&name=image.png&originHeight=382&originWidth=353&size=26112&status=done&width=353)

注意：
①、需要将微信开发工具的 ES6 转 ES5 选项选上，否则报错。
![image.png](https://cdn.nlark.com/yuque/0/2019/png/250093/1559714974755-a4062352-698c-4762-8613-04137896444a.png#align=left&display=inline&height=43&name=image.png&originHeight=43&originWidth=183&size=1731&status=done&width=183)

②、我项目出现的问题，原先我把第三方的 dist 放在项目文件的 dist 文件下，但是发现还是会报 not found 错误，然后转移到项目的 static 文件夹下就好了。
