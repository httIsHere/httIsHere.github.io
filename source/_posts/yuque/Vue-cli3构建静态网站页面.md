---
title: Vue-cli3构建静态网站页面
urlname: uiq7gi
date: 2020-04-11 14:44:41 +0800
tags: []
categories: []
---

1. 请求本地 json 数据

在 vue-cli3 中，存放静态资源的位置在 public 文件夹内，所以需要在项目根目录下创建 public 文件，并存放相应的 json 文件，然后使用 axios 进行请求。

```javascript
this.$axios.get("/api/info-card.json").then((res) => {});
```

2. vue cli3 UI 控制台

```bash
vue ui
```

3. 全局使用 less 变量

使用 `style-resources-loader`，在 vue.config.js 内：

```json
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/theme/global.less')]
    }
  }
```
