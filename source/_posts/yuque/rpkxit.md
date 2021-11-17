---
title: 「大前端」浏览器的工作-1
urlname: rpkxit
date: '2021-06-29 11:38:56 +0800'
tags:
  - browser
categories:
  - browser
---

> 仅学习记录，非原创。

这个过程是这样的：

- 浏览器首先使用 HTTP 协议或者 HTTPS 协议，向服务端请求页面；
- 把请求回来的 HTML 代码经过解析，构建成 DOM 树；
- 计算 DOM 树上的 CSS 属性；
- 最后根据 CSS 属性对元素逐个进行渲染，得到内存中的位图；
- 一个可选的步骤是对位图进行合成，这会极大地增加后续绘制的速度；
- 合成之后，再绘制到界面上。

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1624950970635-877c9e71-6ccc-4279-a563-cdb274f51172.jpeg#align=left&display=inline&height=810&margin=%5Bobject%20Object%5D&name=&originHeight=810&originWidth=1440&size=0&status=done&style=none&width=1440)

### HTTP 协议

浏览器首先要做的事就是根据 URL 把数据取回来，取回数据使用的是 HTTP 协议，实际上这个过程之前还有 DNS 查询。
HTTP 协议是基于 TCP 协议出现的，对 TCP 协议来说，TCP 协议是一条双向的通讯通道，HTTP 在 TCP 的基础上，规定了 Request-Response 的模式。这个模式决定了通讯必定是由浏览器端首先发起的。
大部分情况下，浏览器的实现者只需要用一个 TCP 库，甚至一个现成的 HTTP 库就可以搞定浏览器的网络通讯部分。HTTP 是纯粹的文本协议，它是规定了使用 TCP 协议来传输文本格式的一个应用层协议。

1. request line，它分为三个部分，HTTP Method，请求的路径和请求的协议和版本。
1. response line，它也分为三个部分，协议和版本、状态码和状态文本。
1. 请求头 / 响应头，这些头由若干行组成，每行是用冒号分隔的名称和值。
1. 请求体 / 响应体，请求体可能包含文件或者表单数据，响应体则是 HTML 代码。

#### 格式

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624953698304-616f2c86-856d-4185-990b-832d2c0e7101.png#align=left&display=inline&height=516&margin=%5Bobject%20Object%5D&name=image.png&originHeight=516&originWidth=930&size=113692&status=done&style=none&width=930)

##### Method

- GET：访问页面
- POST：表单提交
- HEAD：只返回响应头，多数由 JavaScript 发起
- PUT：添加资源
- DELETE：删除资源
- CONNECT：多用于 HTTPS 和 WebSocket
- OPTIONS：一般用于调试，多数线上服务都不支持
- TRACE：同 OPTIONS

##### Head

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624955665601-fb3d8fd5-e54d-4963-88ac-055f4654c54b.png#align=left&display=inline&height=407&margin=%5Bobject%20Object%5D&name=image.png&originHeight=407&originWidth=633&size=108736&status=done&style=none&width=633)
![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624955674364-2feb7bd9-db40-4ac7-b3de-ce855e121cac.png#align=left&display=inline&height=453&margin=%5Bobject%20Object%5D&name=image.png&originHeight=453&originWidth=627&size=122722&status=done&style=none&width=627)

##### Request Body

主要用于提交表单场景。实际上，HTTP 请求的 body 是比较自由的，只要浏览器端发送的 body 服务端认可就可以了。一些常见的 body 格式是：

- application/json
- application/x-www-form-urlencoded
- multipart/form-data
- text/xml

我们使用 HTML 的 form 标签提交产生的 HTML 请求，默认会产生 application/x-www-form-urlencoded 的数据格式，当有文件上传时，则会使用 multipart/form-data。

### HTTPS

有两个作用：

- 一是确定请求的目标服务端身份；
- 二是保证传输的数据不会被网络中间节点窃听或者篡改；

使用加密通道来传输 HTTP 的内容。但是 HTTPS 首先与服务端建立一条 TLS 加密通道。TLS 构建于 TCP 协议之上，它实际上是对传输的内容做一次加密，所以从传输内容上看，HTTPS 跟 HTTP 没有任何区别。

### HTTP 2

是 HTTP 1.1 的升级版本，最大的改进有两点，一是支持服务端推送，二是支持 TCP 连接复用。
服务端推送能够在客户端发送第一个请求到服务端时，提前把一部分内容推送给客户端，放入缓存当中，这可以避免客户端请求顺序带来的并行度不高，从而导致的性能问题。
TCP 连接复用，则使用同一个 TCP 连接来传输多个 HTTP 请求，避免了 TCP 连接建立时的三次握手开销，和初建 TCP 连接时传输窗口小的问题。

[-> 浏览器的工作-2](https://www.yuque.com/httishere/running/iew14d)
