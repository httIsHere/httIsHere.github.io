---
title: 「ROAD 6」浏览器原理-排版 & 渲染
urlname: ir6rqt
date: '2021-10-12 16:50:43 +0800'
tags:
  - ROAD 6
categories:
  - 大前端
---

## 排版

> 确定元素的位置。

### 主轴和交叉轴

#### Main Axis

元素的排布方向。

#### Cross Axis

与主轴垂直的方向。

### STEP 1: 确定主轴&交叉轴

### STEP 2: 收集元素进行（hang）

- 分行（这个行不是 row 是主轴行的意思）
  - 根据主轴尺寸，把元素分进行
  - 若设置了 no-wrap，则强行分配进第一行

### STEP 3: 计算主轴

- 找出所有 flex 元素；
- 把主轴方向的剩余尺寸按比例分配给 flex 元素；
- 若剩余空间为负数，所有 flex 元素置为 0，等比压缩剩余元素；

```javascript
if (mainSpace < 0) {
  // 剩余空间不足，仅在single line的情况下
  let scale = style[mainSize] / (style[mainSize] - mainSpace);
  let currentMain = mainBase;
  for (let i = 0; i < items.length; i++) {
    let item = items[i],
      itemStyle = getStyle(item);
    if (itemStyle.flex) {
      itemStyle[mainSize] = 0;
    }
    itemStyle[mainSize] = itemStyle[mainSize] * scale;

    itemStyle[mainStart] = currentMain;
    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
    currentMain = itemStyle[mainEnd];
  }
} else {
  // process each flex line
  flexLines.forEach((items) => {
    let mainSpace = items.mainSpace;
    // 按flex进行分配
    let flexTotal = 0;
    for (let i = 0; i < items.length; i++) {
      let item = items[i],
        itemStyle = getStyle(item);
      if (itemStyle.flex !== undefined && itemStyle.flex !== null) {
        flexTotal += itemStyle.flex;
        continue;
      }
    }

    if (flexTotal > 0) {
      // There is flexible flex items
      let currentMain = mainBase;
      for (let i = 0; i < items.length; i++) {
        let item = items[i],
          itemStyle = getStyle(item);
        if (itemStyle.flex) {
          itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
        }

        itemStyle[mainStart] = currentMain;
        itemStyle[mainEnd] =
          itemStyle[mainStart] + mainSign * itemStyle[mainSize];
        currentMain = itemStyle[mainEnd];
      }
    } else {
      // 没有flex元素，但是还存在剩余空间，justify-content开始工作
      let currentMain, // 元素排布的起点
        step; // 元素间距
      if (style.justifyContent === "flex-start") {
        currentMain = mainBase;
        step = 0;
      }
      if (style.justifyContent === "flex-end") {
        currentMain = mainSpace * mainSign + mainBase;
        step = 0;
      }
      if (style.justifyContent === "space-between") {
        // n个元素之间有n-1个间距
        step = (mainSpace / (items.length - 1)) * mainSign;
        currentMain = mainBase;
      }
      if (style.justifyContent === "space-around") {
        // 左右两边是半个step，元素之间是一个step
        step = (mainSpace / items.length) * mainSign;
        currentMain = mainBase + step / 2;
      }
      for (let i = 0; i < items.length; i++) {
        let item = items[i],
          itemStyle = getStyle(item);
        itemStyle[mainStart] = currentMain;
        itemStyle[mainEnd] =
          itemStyle[mainStart] + mainSign * itemStyle[mainSize];
        currentMain = itemStyle[mainEnd] + step; // 加上间距
      }
    }
  });
}
```

### STEP 4: 计算交叉轴

- 根据每一行中最大元素的尺寸计算行高
- 根据行高 flex-align 和 item-align，确定元素具体位置

### 主要代码

```javascript
/*
 * @Author: httishere
 * @Date: 2021-09-29 11:53:07
 * @LastEditTime: 2021-10-12 14:10:51
 * @LastEditors: Please set LastEditors
 * @Description: 元素排版
 * @FilePath: /Note/toy-browser/CSS/layout.js
 */

function getStyle(element) {
  if (!element.style) element.style = {};

  for (let prop in element.computeStyle) {
    let p = element.computeStyle.value;
    // copy
    element.style[prop] = element.computeStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout(element) {
  if (!element.computeStyle) return;
  let elementStyle = getStyle(element);

  if (elementStyle.display !== "flex") return;

  let items = element.children.filter((e) => e.type === "element");

  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });

  let style = elementStyle;

  // width height 处理
  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === "") {
      style[size] = null;
    }
  });

  // 设计属性默认值
  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.alignItems || style.alignItems === "auto") {
    style.alignItems = "stretch";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start";
  }
  if (!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowrap";
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "stretch";
  }

  // 使用变量进行抽象方向
  // base: 起点, sign: 排布方向
  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase, // 主轴
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase; // 交叉轴
  if (style.flexDirection === "row") {
    (mainSize = "width"), (mainStart = "left"), (mainEnd = "right");
    (mainSign = +1), (mainBase = 0);

    (crossSize = "height"), (crossStart = "top"), (crossEnd = "bottom");
  }
  if (style.flexDirection === "row-reverse") {
    (mainSize = "width"), (mainStart = "right"), (mainEnd = "left");
    (mainSign = -1), (mainBase = style.width);

    (crossSize = "height"), (crossStart = "top"), (crossEnd = "bottom");
  }
  if (style.flexDirection === "column") {
    (mainSize = "height"), (mainStart = "top"), (mainEnd = "bottom");
    (mainSign = +1), (mainBase = 0);

    (crossSize = "width"), (crossStart = "left"), (crossEnd = "right");
  }
  if (style.flexDirection === "column-reverse") {
    (mainSize = "height"), (mainStart = "bottom"), (mainEnd = "top");
    (mainSign = -1), (mainBase = style.height);

    (crossSize = "width"), (crossStart = "left"), (crossEnd = "right");
  }

  if (style.flexWrap === "wrap-reverse") {
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = +1;
  }

  let isAutoMainSize = false; // 父元素没有设置main size
  if (!style[mainSize]) {
    // auto sizing
    elementStyle[mainSize] = 0;
    // 将main size标记为子元素size和
    for (let i = 0; i < items.length; i++) {
      let item = items[i],
        itemStyle = getStyle(item);
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] += itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  // 元素行设置
  let flexLine = [],
    flexLines = [flexLine];

  let mainSpace = elementStyle[mainSize], // 剩余空间
    crossSpace = 0; // 所占的每行的交叉轴的空间
  for (let i = 0; i < items.length; i++) {
    let item = items[i],
      itemStyle = getStyle(item);
    !itemStyle[mainSize] && (itemStyle[mainSize] = 0);

    if (itemStyle.flex) {
      // 子元素可伸缩，一定可以进入当前行
      flexLine.push(item);
    } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      // 强行塞入当前行
      flexLine.push(item);
    } else {
      // 单个子元素main size大于容器则将其缩小
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      // main logic
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        // 另起一行
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null || itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }
  flexLine.mainSpace = mainSpace;

  if (style.flexWrap === "nowrap" || isAutoMainSize) {
    flexLine.crossSpace =
      style[crossSize] !== undefined ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }

  console.log(flexLine);

  // 计算主轴
  if (mainSpace < 0) {
    // 剩余空间不足，仅在single line的情况下
    let scale = style[mainSize] / (style[mainSize] - mainSpace);
    let currentMain = mainBase;
    for (let i = 0; i < items.length; i++) {
      let item = items[i],
        itemStyle = getStyle(item);
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] =
        itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    // process each flex line
    flexLines.forEach((items) => {
      let mainSpace = items.mainSpace;
      // 按flex进行分配
      let flexTotal = 0;
      for (let i = 0; i < items.length; i++) {
        let item = items[i],
          itemStyle = getStyle(item);
        if (itemStyle.flex !== undefined && itemStyle.flex !== null) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }

      if (flexTotal > 0) {
        // There is flexible flex items
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
          let item = items[i],
            itemStyle = getStyle(item);
          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }

          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        // 没有flex元素，但是还存在剩余空间，justify-content开始工作
        let currentMain, // 元素排布的起点
          step; // 元素间距
        if (style.justifyContent === "flex-start") {
          currentMain = mainBase;
          step = 0;
        }
        if (style.justifyContent === "flex-end") {
          currentMain = mainSpace * mainSign + mainBase;
          step = 0;
        }
        if (style.justifyContent === "space-between") {
          // n个元素之间有n-1个间距
          step = (mainSpace / (items.length - 1)) * mainSign;
          currentMain = mainBase;
        }
        if (style.justifyContent === "space-around") {
          // 左右两边是半个step，元素之间是一个step
          step = (mainSpace / items.length) * mainSign;
          currentMain = mainBase + step / 2;
        }
        for (let i = 0; i < items.length; i++) {
          let item = items[i],
            itemStyle = getStyle(item);
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step; // 加上间距
        }
      }
    });
  }

  // 计算交叉轴
  // align-items and align-self
  // let crossSpace; // 实际的行高

  if (!style[crossSize]) {
    // auto sizing
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] =
        elementStyle[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === "wrap-reverse") {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  let lineSize = style[crossSize] / flexLines.length;

  let step;
  if (style.alignContent === "flex-start") {
    crossBase += 0;
    step = 0;
  }
  if (style.alignContent === "flex-end") {
    crossBase += crossSign * crossSpace;
    step = 0;
  }
  if (style.alignContent === "center") {
    crossBase + (crossSign * crossSpace) / 2;
    step = 0;
  }
  if (style.alignContent === "space-between") {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }
  if (style.alignContent === "space-around") {
    step = crossSpace / flexLines.length;
    crossBase += (crossSign * step) / 2;
  }
  if (style.alignContent === "stretch") {
    crossBase += 0;
    step = 0;
  }

  flexLines.forEach((items) => {
    let lineCrossSize =
      style.alignContent === "stretch"
        ? items.crossSpace + crossSpace / flexLines.length
        : items.crossSpace;
    for (let i = 0; i < items.length; i++) {
      let item = items[i],
        itemStyle = getStyle(item);
      let align = itemStyle.alignself || style.alignItems;

      // 计算单个元素的位置
      if (itemStyle[crossSize] === null) {
        // 强制撑高
        itemStyle[crossSize] = align === "stretch" ? lineCrossSize : 0;
      }
      if (align === "flex-start") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === "flex-end") {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] =
          itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }
      if (align === "center") {
        itemStyle[crossStart] =
          crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === "stretch") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          crossBase +
          crossSign *
            (itemStyle[crossSize] !== undefined &&
            itemStyle[crossSize] !== void 0
              ? itemStyle[crossSize]
              : lineCrossSize);

        itemStyle[crossSize] =
          crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  });

  console.log(items);
}

module.exports = {
  layout,
};
```

## 绘制

### 前提：[轻量级跨平台图像编解码库](https://www.npmjs.com/package/images)

```bash
npm install images
```

### STEP 1: 绘制单个元素

- 绘制需要依赖一个图形环境
- 采用 npm 包 images
- 绘制在一个 viewport 上进行
- 与绘制相关的属性：background-color，border，background-image 等

### STEP 2: 绘制 DOM

递归渲染所有的子元素。

### 主要代码

```javascript
/*
 * @Author: httishere
 * @Date: 2021-10-12 14:13:01
 * @LastEditTime: 2021-10-12 14:50:14
 * @LastEditors: Please set LastEditors
 * @Description: 元素渲染
 * @FilePath: /Note/toy-browser/render.js
 */

const images = require("images");

function render(viewport, element) {
  console.log(element);
  if (element.style) {
    let img = images(element.style.width, element.style.height);
    if (element.style["background-color"]) {
      let color = element.style["background-color"] || "rgb(255, 255, 255)";
      color.match(/rgb\((\d+),(\d+),(\d+)\)/); // 暂时仅支持rgb格式
      console.log(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1);
      // 绘制
      viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }
  }

  if (element.children) {
    for (let child of element.children) {
      render(viewport, child);
    }
  }
}

module.exports = render;
```

## [toy-browser 项目](https://github.com/httIsHere/FrontEndTrainingCamp-Note/tree/main/toy-browser)(github 地址)

--------------------------------------------------------------- 浏览器原理篇 END ---------------------------------------------------------------
