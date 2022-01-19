---
title: 「Taro3」taro update 遇到的问题集合
urlname: ghdf48
date: '2020-08-07 14:18:45 +0800'
tags:
  - Taro
categories:
  - React
  - Taro
cover:
---

<!-- more -->

### 1.Super expression must either be null or a function, TypeError: Super expression must either be null or a function

在 Taro Next 中，属于框架本身的 API 从框架自己的包中引入，其它的 API 仍然从 `@tarojs/taro` 引入。使用哪个框架来进行开发完全由开发者来决定。

```jsx
import Taro from "@tarojs/taro";
import React, { Component } from "react"; // Component 是来自于 React 的 API
```

### 2. 当前页面路由参数

```javascript
this.$router.params; // old

import Taro, { getCurrentInstance } from "@tarojs/taro";
current = getCurrentInstance();
this.current.router.params; // new
```

### 3. 使用原生微信第三方组件

如：ec-canvas
在 Taro v1.3 内：

```javascript
config = {
    usingComponents: {
      "ec-canvas": "./ec-canvas/ec-canvas"
    }
  };
  refresh(data) {
    this.Chart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setChartData(chart, data);
      return chart;
    });
  }
<ec-canvas
        ref={this.refChart}
        canvas-id="mychart-area"
        ec={this.state.ec}
      />
```

可获取到组件对象：
![截屏2020-08-17 下午5.34.51.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1597656910413-91f4cae7-7a19-492b-a433-ef8d24cc58b7.png#height=496&id=qGmBY&margin=%5Bobject%20Object%5D&name=%E6%88%AA%E5%B1%8F2020-08-17%20%E4%B8%8B%E5%8D%885.34.51.png&originHeight=496&originWidth=604&originalType=binary∶=1&size=75083&status=done&style=none&width=604)

但是在 Taro v3.0 内无法获取到该组件对象：
![截屏2020-08-17 下午5.35.54.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1597656964405-1fd8ead2-5560-4eee-b4c9-0692ffe170bd.png#height=390&id=MLFcM&margin=%5Bobject%20Object%5D&name=%E6%88%AA%E5%B1%8F2020-08-17%20%E4%B8%8B%E5%8D%885.35.54.png&originHeight=390&originWidth=882&originalType=binary∶=1&size=65390&status=done&style=none&width=882)

现在使用 onInit 事件导入，主要代码：

```jsx
// RadarChart.jsx

import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View } from "@tarojs/components";
import * as echarts from "../ec-canvas/echarts.js";

let chart = null;
function setChartData(chart, data) {
  let option = {
    title: {
      textStyle: {
        color: "#eee",
        size: 12,
        rich: {},
      },
    },
    grid: {
      x: 20,
      y: 20,
      x2: 20,
      y2: 20,
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
      containLabel: true,
    },
    radar: {
      indicator: data,
      name: {
        textStyle: {
          color: "#333333",
          fontSize: 10,
          backgroundColor: "rgba(255,216,1,0.4)",
          padding: [0, 5],
          borderRadius: 50,
          lineHeight: 20,
          rich: {},
        },
      },
      // splitNumber: 8,
      splitLine: {
        lineStyle: {
          color: [
            "rgba(255, 216, 1, 1)",
            "rgba(255, 216, 1, 1)",
            "rgba(255, 216, 1, 1)",
            "rgba(255, 216, 1, 1)",
            "rgba(255, 216, 1, 1)",
            "rgba(255, 216, 1, 1)",
          ].reverse(),
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [
            "rgba(255, 216, 1, 0.1)",
            "rgba(255, 216, 1, 0.2)",
            "rgba(255, 216, 1, 0.3)",
            "rgba(255, 216, 1, 0.4)",
            "rgba(255, 216, 1, 0.6)",
            "rgba(255, 216, 1, 0.8)",
          ].reverse(), // 图表背景网格的颜色
        },
      },
      axisLine: {
        lineStyle: {
          color: "#FFD801",
        },
      },
    },
    series: [],
  };
  if (data && data.dimensions && data.measures) {
    option.radar.indicator = data.dimensions.data;
    option.series = data.measures.map((item) => {
      return {
        ...item,
        type: "radar",
      };
    });
  }
  chart.setOption(option);
}

function initChart(canvas, width, height) {
  console.log("init");
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
  });
  canvas.setChart(chart);
  setChartData(chart, {});
  return chart;
}

export default class RadarChar extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }
  state = {
    ec: {
      // lazyLoad: true,
      onInit: initChart,
    },
    init_chart: false,
  };

  componentDidUpdate(nextProps) {
    // 异步获得父组件传过来的绘制参数
    const _this = this;
    setTimeout(() => {
      setChartData(chart, nextProps.chartData);
    }, 2000); // 延迟2s
  }

  refChart = React.createRef();
  render() {
    return (
      <ec-canvas
        ref={this.refChart}
        id="mychart-dom-area"
        canvas-id="mychart-area"
        ec={this.state.ec}
      />
    );
  }
}
```

注：我的 RadarChart.jsx 是自定义组件非 page 级页面，第三方组件需要在 pageji 页面内引入，RadarChart.jsx 的父组件是 LearningReport.jsx：

```jsx
// learningReport.config.js
export default {
  navigationBarTitleText: "学习报告",
  navigationBarBackgroundColor: "#FFDF56",
  usingComponents: {
    "ec-canvas": "../../../components/ec-canvas/ec-canvas",
  },
};
```

### 4. 使用 map 循环时，子组件获取的 props 是数组最后一个元素信息

只有第一个子组件 props 是正确的，之后的子组件获得的 props 是数组最后一个元素信息。
原先 click 事件绑定在子组件的最外层上，换成绑定内层就不会有这个问题了，待排查。

### 5.React will try to recreate this component tree from scratch using the error boundary you provided, Page.

可是是传参数据格式问题也有可能是在 componentWillMount 或者 componentDidMount 内使用 setState，造成资源浪费；

### 6.this.\$preload is not a function
