---
title: 「html」浏览器视频播放自动全屏（Safari/微信浏览器）
urlname: ilpr4q
date: '2020-12-25 10:13:02 +0800'
tags:
  - html
categories:
  - HTML
---

> 在页面内插入一个 video 内容，点击播放时可以直接小窗播放。

在使用下面的 video 时，点击视频播放会自动进入全屏状态，退出全屏会暂停播放。

```html
<video
  class="video-box__media"
  id="videoRef"
  ref="videoRef"
  preload="meta"
  :src="detail.video_url"
  :poster="detail.cover_url"
  controls
></video>
```

解决：在 video 标签内增加以下内容

```bash
x5-video-player-fullscreen="true"
webkit-playsinline="true"
x-webkit-airplay="true"
playsinline="true"
x5-playsinline
```

即：

```html
<video
  class="video-box__media"
  id="videoRef"
  ref="videoRef"
  preload="meta"
  :src="detail.video_url"
  :poster="detail.cover_url"
  controls
  x5-video-player-fullscreen="true"
  webkit-playsinline="true"
  x-webkit-airplay="true"
  playsinline="true"
  x5-playsinline
></video>
```
