---
title: 「Daily」为页面或者图片设置水印
urlname: rx6k4n
date: '2021-07-22 14:11:58 +0800'
tags:
  - Daily
categories:
  - Daily
---

### ![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1626934578789-bcc70578-6149-44de-9291-1a6c1098b0e6.png#align=left&display=inline&height=457&margin=%5Bobject%20Object%5D&name=image.png&originHeight=914&originWidth=1788&size=139915&status=done&style=none&width=894)

需要注意水印的层级问题。

### canvas

```javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Watermark</title>
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
      }
      #img-box {
        width: 500px;
        height: 500px;
        /* background: url(https://ss.lanqb.com/f34e7601-884b-4a86-871b-ee522c0ba91d.jpg); */
        background-size: 100% 100%;
      }
    </style>
  </head>
  <body>
    <!-- canvas -->
    <div id="img-box">
      问：假设需要对页面设计一个水印方案，你会如何设计？ •
      通过canvas生成水印，用canvas来生成base64图片，通过CanIUse网站查询兼容性。
      •
      通过SVG生成水印，相比Canvas，SVG有更好的浏览器兼容性，使用SVG生成水印的方式与Canvas的方式类似，只是base64Url的生成方式换成了SVG。
      •
      服务端画图，通过NodeJS生成水印。前端发一个请求，参数带上水印内容，后台返回图片内容。
    </div>
  </body>
  <script>
    // https://www.runoob.com/jsref/dom-obj-canvas.html
    let watermark = {};
    let setWatermark = (str, options) => {
      let id = "httishere—watermark";
      if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id));
      }
      // 创建当前canvas对象
      let can = document.createElement("canvas");
      can.width = 350;
      can.height = 120;
      let cans = can.getContext("2d");
      // getContext() 方法可返回一个对象，该对象提供了用于在画布上绘图的方法和属性，可用于在画布上绘制文本、线条、矩形、圆形等等。
      cans.rotate((-20 * Math.PI) / 180); // 水印倾斜
      // Math.PI = 3.14 = 180°  1度
      cans.font = "16px Vedana";
      // Verdana是一套无衬线字体
      // cans.fillStyle = 'rgba(242, 242, 242, 0.10)';
      cans.fillStyle = "green"; //方便观看的颜色，正常使用删掉
      cans.textAlign = "left";
      cans.textBaseline = "Middle";
      cans.fillText(str, can.width / 20, can.height);
      let div = document.createElement("div");
      div.id = id;
      // 元素永远不会成为鼠标事件的target。
      div.style.pointerEvents = "none";
      if (!options || !options.target) {
        div.style.top = "3px";
        div.style.left = "0px";
        div.style.position = "fixed";
        div.style.zIndex = "100000";
        div.style.width = document.documentElement.clientWidth + "px";
        div.style.height = document.documentElement.clientHeight + "px";
        div.style.background =
          "url(" + can.toDataURL("image/png") + ") left top repeat";
        // left：背景图像在横向上填充从左边开始；
        // background-repeat 背景图像在横向和纵向平铺
        document.body.appendChild(div);
      } else {
        let _obj = document.getElementById(options.target);
        let _w = _obj.clientWidth,
          _h = _obj.clientHeight;
        div.style.top = "-50px";
        div.style.left = "0px";
        div.style.position = "absolute";
        div.style.zIndex = "100000";
        div.style.width = _w + "px";
        div.style.height = _h + "px";
        div.style.background =
          "url(" + can.toDataURL("image/png") + ") left top repeat";
        // left：背景图像在横向上填充从左边开始；
        // background-repeat 背景图像在横向和纵向平铺
        _obj.appendChild(div);
      }
      return id;
    };

    // 该方法只允许调用一次
    watermark.set = (str, options) => {
      let id = setWatermark(str, options);
      setInterval(() => {
        if (document.getElementById(id) === null) {
          id = setWatermark(str);
        }
      }, 2000);
      window.onresize = () => {
        // 当浏览器被重置大小时执行Javascript代码:
        setWatermark(str);
      };
    };
    watermark.set("httishere"); // 给整个页面
    watermark.set("my-img", { target: "img-box" }); // 给特定对象
  </script>
</html>
```

### 通过 SVG 生成水印

> SVG：可缩放矢量图形（英语：Scalable Vector Graphics，SVG）是一种基于可扩展标记语言（XML），用于描述二维矢量图形的图形格式。 SVG 由 W3C 制定，是一个开放标准。

相比 Canvas，SVG 有更好的浏览器兼容性，使用 SVG 生成水印的方式与 Canvas 的方式类似，只是 base64Url 的生成方式换成了 SVG。

```javascript
// svg 实现 watermark
function __svgWM({
  container = document.body,
  content = "httishere",
  width = "300px",
  height = "200px",
  opacity = "0.2",
  fontSize = "20px",
  zIndex = 1000,
} = {}) {
  const args = arguments[0];
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}">
                          <text x="50%" y="50%" dy="12px"
                            text-anchor="middle"
                            stroke="#000000"
                            stroke-width="1"
                            stroke-opacity="${opacity}"
                            fill="none"
                            transform="rotate(-30, 120, 120)"
                            style="font-size: ${fontSize};">
                            ${content}
                          </text>
                        </svg>`;
  const base64Url = `data:image/svg+xml;base64,${window.btoa(
    unescape(encodeURIComponent(svgStr))
  )}`;
  const __wm = document.querySelector(".__wm");

  const watermarkDiv = __wm || document.createElement("div");
  const styleStr = `
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          z-index:${zIndex};
          pointer-events:none;
          background-repeat:repeat;
          background-image:url('${base64Url}')`;

  watermarkDiv.setAttribute("style", styleStr);
  watermarkDiv.classList.add("__wm");

  if (!__wm) {
    container.style.position = "relative";
    container.insertBefore(watermarkDiv, container.firstChild);
  }

  const MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;
  if (MutationObserver) {
    let mo = new MutationObserver(function () {
      const __wm = document.querySelector(".__wm");
      // 只在__wm元素变动才重新调用 __canvasWM
      if ((__wm && __wm.getAttribute("style") !== styleStr) || !__wm) {
        // 避免一直触发
        mo.disconnect();
        mo = null;
        __svgWM(JSON.parse(JSON.stringify(args)));
      }
    });

    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true,
    });
  }
}

if (typeof module != "undefined" && module.exports) {
  //CMD
  module.exports = __svgWM;
} else if (typeof define == "function" && define.amd) {
  // AMD
  define(function () {
    return __svgWM;
  });
} else {
  window.__svgWM = __svgWM;
}
__svgWM();
```

参考：[https://www.cnblogs.com/zarawu/p/10414409.html](https://www.cnblogs.com/zarawu/p/10414409.html)
