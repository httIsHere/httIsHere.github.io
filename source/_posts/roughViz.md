---
title: roughViz.js 手绘风格的网页图表js库
date: 2020-01-05 14:58:15
tags:
  - "js"
  - "工具/插件"
categories:
  - "Javascript"
---

![cover](https://assets-cdn.lanqb.com/manual-box/normal/roughViz_cover.PNG)

是一个非常个性化的图标插件，且可以根据自己喜好变换出很多不同的显示样式。
推荐：★★★★☆

#### 支持图表类型

- Bar (roughViz.Bar) 条形图
- Horizontal Bar (roughViz.BarH) 水平条形图
- Donut (roughViz.Donut) 圆环图
- Line (roughViz.Line) 折线图
- Pie (roughViz.Pie) 饼图
- Scatter (roughViz.Scatter) 散点图
- Stacked Bar (roughViz.StackedBar) 堆积条形图

#### cdn

`<script src="https://unpkg.com/rough-viz@1.0.5"></script>`

#### npm

```js
npm install rough-viz
npm install react-roughviz
npm install vue-roughviz
```

#### use

data 处理有三种方式：

- csv 文件
- tsv 文件
- data object

```js
// add this to abstract base
  resolveData(data) {
    if (typeof data === 'string') {
      if (data.includes('.csv')) {
        return () => {
          csv(data).then(d => {
            // console.log(d);
            this.data = d;
            this.drawFromFile();
          });
        };
      } else if (data.includes('.tsv')) {
        return () => {
          tsv(data).then(d => {
            this.data = d;
            this.drawFromFile();
          });
        };
      }
    } else {
      return () => {
        this.data = data;
        this.drawFromObject();
      };
    }
  }
```
How to use
```html
<!-- container -->
<div id="vis0"></div>
```

```js
// bar chart
new roughViz.Bar({
  element: "#vis0", // container selection
  data: {
    flavor: ["North", "South", "East", "West"],
    price: [10, 5, 8, 3]
  },
  labels: "flavor",
  values: "price"
});

// Horizontal Bar Chart
new roughViz.BarH({
  element: "#vis2",
  title: "Vehicles I've Had",
  data: {
    labels: [
      "1992 Ford Aerostar Van",
      "2013 Kia Rio",
      "1980 Honda CB 125s",
      "1992 Toyota Tercel"
    ],
    values: [8, 4, 6, 2]
  },
  xLabel: "Time Owned (Years)"
});

// Donut chart
new roughViz.Donut({
  element: "#vis1",
  data: {
    labels: ["North", "South", "East", "West"],
    values: [10, 5, 8, 3]
  }
});

// line chart
new roughViz.Line({
  element: "#vis3",
  data:
    "https://raw.githubusercontent.com/jwilber/random_data/master/tweets.csv",
  title: "Line Chart",
  y: "favorites",
  y2: "retweets",
  y3: "tweets",
  yLabel: "hey"
});

// pie chart
new roughViz.Pie({
  element: "#vis4",
  titleFontSize: "1.5rem",
  data: {
    labels: ["yes", "no", "lol idk man"],
    values: [2, 8, 4]
  },
  title: "'Yarn Plot': Useful?"
});

// Scatter chart
new roughViz.Scatter({
  element: "#vis5",
  data:
    "https://raw.githubusercontent.com/uiuc-cse/data-fa14/gh-pages/data/iris.csv",
  title: "Iris Scatter Plot",
  x: "sepal_width",
  y: "petal_length",
  colorVar: "species",
  highlightLabel: "species",
  fillWeight: 4,
  radius: 12,
  colors: ["pink", "coral", "skyblue"],
  stroke: "black",
  strokeWidth: 0.4,
  roughness: 1,
  width: 400,
  height: 450,
  font: 0,
  xLabel: "sepal width",
  yLabel: "petal length",
  curbZero: false
});
// Stacked Bar chart
new roughViz.StackedBar({
  element: "#vis6",
  data: [
    {
      month: "Jan",
      A: 20,
      B: 5,
      C: 10
    },
    {
      month: "Feb",
      A: 25,
      B: 10,
      C: 20
    },
    {
      month: "March",
      A: 30,
      B: 50,
      C: 10
    }
  ],
  labels: "month",
  title: "Monthly Revenue",
  roughness: 2,
  colors: ["blue", "#f996ae", "skyblue", "#9ff4df"],
  fillWeight: 0.35,
  strokeWidth: 0.5,
  fillStyle: "cross-hatch",
  stroke: "black"
});
```

在原本基础的图形表现上，还可以自定义图表显示样式，从而使图表更具独特风格。

- axisFontSize [string]: Font-size for axes' labels. Default: '1rem'. 坐标轴字体大小
- axisRoughness [number]: Roughness for x & y axes. Default: 0.5. 坐标轴粗糙程度
- axisStrokeWidth [number]: Stroke-width for x & y axes. Default: 0.5. 坐标轴线宽
- bowing [number]: Chart bowing. Default: 0. 弯曲程度
- color [string]: Color for each bar. Default: 'skyblue'. 填色
- fillStyle [string]: Bar fill-style. Should be one of fillStyles shown above. 填充风格
- fillWeight [number]: Weight of inner paths' color. Default: 0.5. 填充饱和度
- font: Font-family to use. You can use 0 or gaegu to use Gaegu, or 1 or indie flower to use Indie Flower. Or feed it something else. Default: Gaegu. 字体类型
- highlight [string]: Color for each bar on hover. Default: 'coral'. 高亮
- innerStrokeWidth [number]: Stroke-width for paths inside bars. Default: 1. 内部绘线宽度
- interactive [boolean]: Whether or not chart is interactive. Default: true. 可交互性，鼠标 hover 操作等
- labelFontSize [string]: Font-size for axes' labels. Default: '1rem'. 标签字体大小
- margin [object]: Margin object. Default: {top: 50, right: 20, bottom: 70, left: 100} 外边距
- padding [number]: Padding between bars. Default: 0.1. 内边距
- roughness [number]: Roughness level of chart. Default: 1. 粗糙程度
- simplification [number]: Chart simplification. Default 0.2. 简化
- stroke [string]: Color of bars' stroke. Default: black. 绘线颜色
- strokeWidth [number]: Size of bars' stroke. Default: 1. 绘线宽度
- title [string]: Chart title. Optional. 图表标题
- titleFontSize [string]: Font-size for chart title. Default: '1rem'. 标题字体大小
- tooltipFontSize [string]: Font-size for tooltip. Default: '0.95rem'. 提示字体大小
- xLabel [string]: Label for x-axis. x 轴标签
- yLabel [string]: Label for y-axis. y 轴标签
- legend [boolean]: Whether or not to add legend. Default: 'true'. 图例
- legendPosition [string]: Position of legend. Should be either 'left' or 'right'. Default: 'right'. 图例位置
- circle [boolean]: Whether or not to add circles to chart. Default: true. 圆形
- circleRadius [number]: Radius of circles. Default: 10. 圆型半径
- circleRoughness [number]: Roughness of circles. Default: 2. 圆形粗糙程度

fillStyle
![](https://raw.githubusercontent.com/jwilber/random_data/master/rough_fillStyles.png)

roughness
![](https://raw.githubusercontent.com/jwilber/random_data/master/roughViz_roughnessbars.png)

fillWeight
![](https://raw.githubusercontent.com/jwilber/random_data/master/roughViz_fillweight.png)

传送门 [roughViz github](https://github.com/jwilber/roughViz)
