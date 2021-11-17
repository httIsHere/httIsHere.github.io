---
title: h5自定义海报生成
urlname: wrwxnm
date: '2019-01-21 17:16:03 +0800'
tags: []
categories: []
---

功能需求：获取海报参数自定义生成一张带二维码海报。
效果如下：
![Inked微信图片_20190121172129_LI.jpg](https://cdn.nlark.com/yuque/0/2019/jpeg/250093/1548062679065-c45906c9-bae5-4d02-92bc-13f747042672.jpeg#align=left&display=inline&height=657&margin=%5Bobject%20Object%5D&name=Inked%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190121172129_LI.jpg&originHeight=1298&originWidth=836&size=673550&status=done&style=none&width=423)

元素：主要分成背景图，用户信息和带用户信息的二维码（由前端生成）；

步骤：先根据设计完成布局设计->将这张海报的 html 元素生成为 canvas->将该 canvas 转化成图片；

- 步骤 1：请求数据，成功后主要是二维码的生成（使用 qrcodejs2）

```javascript
// 生成二维码
    qrcodeCreate() {
      const _this = this;
      if (_this.poster_params.code_url) {
        let qrcodeDom = document.getElementById("qrcode");
        qrcode = new QRCode("qrcode", {
          width: parseInt(qrcodeDom.clientWidth), // 设置宽度，单位像素
          height: parseInt(qrcodeDom.clientHeight), // 设置高度，单位像素
          text: _this.poster_params.code_url // 设置二维码内容或跳转地址
        });
      } else {
        _this.isLoading = false;
        _this.isFailed = true;
        return _this.$toast.center("海报跑走了~");
      }
    }
```

- 步骤 2：设计海报 canvas

注意是内部图片必须有效加载才能生成成功，所以需要先判断图片链接的有效性，之后等图片完全加载完成之后再转为 canvas；还有在图片为不同域的情况也可能会产生生成失败的现象，所以需要先将跨域图片转换为 base64 格式。

```javascript
// 创建海报canvas
let box = document.getElementById("poster-box"); // 海报盒子
let c_width = box.offsetWidth;
let c_height = box.offsetHeight;
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
// 获取根据屏幕分辨率，来设置canvas的宽高以获得高清图片
let devicePixelRatio = window.devicePixelRatio || 2;
let backingStoreRatio =
  context.webkitBackingStorePixelRatio ||
  context.mozBackingStorePixelRatio ||
  context.msBackingStorePixelRatio ||
  context.oBackingStorePixelRatio ||
  context.backingStorePixelRatio ||
  1;
let ratio = devicePixelRatio / backingStoreRatio;
canvas.width = c_width * ratio;
canvas.height = c_height * ratio;
canvas.style.width = c_width + "px";
canvas.style.height = c_height + "px";
canvas.style.position = "absolute";
canvas.style.left = "50%";
canvas.style.top = "50%";
canvas.style.transform = "translate(-50%, -50%)";
canvas.style.zIndex = "10";
canvas.style.opacity = "0";
// canvas的页面位置自行调整
let scrollTop =
  document.documentElement.scrollTop ||
  window.pageYOffset ||
  document.body.scrollTop;
let scrollLeft =
  document.documentElement.scrollLeft ||
  window.pageXOffset ||
  document.body.scrollLeft;
let transTop =
  screenTop -
  (document.getElementsByClassName("poster-view-content")[0].offsetTop -
    c_height / 2);
let transLeft = (c_width - window.innerWidth) / 2;
context.scale(ratio, ratio);
// canvas的位置要保证与div位置相同。
context.translate(transLeft, transTop);
```

```javascript
// 背景图片
let img = new Image();
let canvas2 = document.createElement("canvas");
let ctx = canvas2.getContext("2d");
img.crossOrigin = "Anonymous";
img.src = _this.poster_params.share;
img.onload = function () {
  if (img.width > 0) {
    canvas2.height = img.height;
    canvas2.width = img.width;
    ctx.drawImage(img, 0, 0);
    let dataURL = canvas2.toDataURL("image/png");
    document.getElementById("poster-bg").setAttribute("src", dataURL);
    canvas2 = null;
    _this.getCard(box, canvas, c_width, c_height); // 生成海报canvas
  } else {
    _this.isLoading = false;
    _this.isFailed = true;
    return _this.$toast.center("海报跑走了~");
  }
};
img.onerror = function () {
  _this.isLoading = false;
  _this.isFailed = true;
  return _this.$toast.center("海报跑走了~");
};
```

- 步骤 3：在所有图片都加载以及转换成功后，可以生成海报 canvas 并转换生成图片（使用 html2canvas）

```javascript
 		// 每次图片加载成功后都会请求执行该函数（但是要在所有图片都加载成功后才能真正生成canvas）
    getCard(box, canvas, c_width, c_height) {
      const _this = this;
      _this.cnt++; // 对已加载成功的图片数进行判断
      if (_this.cnt < 3) return; // 所有图片都成功可以生成
      html2canvas(box, {
        allowTaint: true,
        useCORS: true,
        canvas: canvas,
        width: c_width,
        height: c_height
      }).then(function(canvas) {
        canvas.setAttribute("id", "my-canvas"); //添加属性
        box.appendChild(canvas);
        // 转换图片得到base64格式
        let dataURL = canvas.toDataURL("image/png");
        let img = new Image();
        img.src = dataURL;
        img.className = "cardImg";
        img.style.position = "absolute";
        img.style.left = "50%";
        img.style.top = "50%";
        img.style.transform = "translate(-50%, -50%)";
        img.style.zIndex = "150";
        img.style.width = c_width + "px";
        img.style.height = c_height + "px";
        box.appendChild(img);
        // 生成成功
        _this.$emit('createPosterSuccess', dataURL);
        _this.isLoading = false;
        _this.isSuccess = true;
      });
    }
```

大致就完成了，主要在与异步的问题，在图片 base64 格式转换的时候也要判断二维码是否生成成功。
还有生成到成为一张图片还是需要一定时间，所以最好有一个生成中的加载状态。
