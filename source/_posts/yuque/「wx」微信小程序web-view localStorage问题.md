
---

title: 「wx」微信小程序web-view localStorage问题

urlname: dlafbs

date: 2020-02-28 21:51:40 +0800

tags: []

categories: []

---
tags: [wx]
categories: [微信小程序]
cover:
---<br /><!-- more --><br />
在小程序开始时，经常会使用web-view内嵌H5页面，以便减少多端开发成本，但是小程序与web-view的登录状态通信是一个需要处理的问题。<br />在我们开发过程中，小程序的用户登录凭证和m站的用户登录凭证并不互通，无法通用token，所以在小程序进入web-view时需要重新通过静默登录等方式进行web-view内的登录，并存储在本地，但是在小程序内退出账号或者删除本地微信内的小程序时web-view的localStorage并不会被清除，所以可能造成在登录另一个账户进入web-view时造成用户数据不正确的情况。<br />而且当两个不同的小程序通过web-view嵌入了同一个域名的h5页面，也会造成localStorage信息不匹配问题，因为同域名下localStorage是共通的。所以在处理web-view时需要特别注意缓存的问题，很容易造成数据凭证不匹配的问题。所以我需要在每次进入页面时对web-view的localStorage进行清除，清除特定用户数据缓存。<br />


