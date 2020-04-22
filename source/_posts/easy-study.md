---
title: easywebpack (yuque easy-team)
date: 2020-04-19 14:17:42
tags:
  - 从入门到放弃
  - js
categories:
  - webpack
---

> 基于 Webpack 的前端构建工程化解决方案 <br>
> A Simple, Powerful Wepback Front-End Development Solution

### 简单配置

- 基本配置

  ```js
  // ${app_root}/webpack.config.js
  module.exports = {
      // framework 支持 `js`,`html`, `vue`, `react`, `weex`
      framework: 'html' // 增强配置，告诉 easywebpack 使用 easywebpack-html 方案
      entry:{
          home: 'src/home/home.js'
      }
  }
  ```

- 常用模板配置

  ```js
    // ${app_root}/webpack.config.js
    module.exports = {
      // framework 支持 `js`,`html`, `vue`, `react`, `weex`
      framework: 'html' // 扩展配置
      entry:{
          home: 'src/home/home.js'
      },
      module:{
          rules:[] // 默认可以不用配置, 添加或扩展请见配置 loaders 章节
      },
      pugins:[], // 默认可以不用配置, 添加或扩展请见配置 plugins 章节
      done(){
          // Webpack 编译完成回调, 默认可以不用配置,当你需要编译完成做某某事情(比如上传 cdn)才需要配置
      },
      // 结合webpack原生节点
      externals: {
          jquery: 'window.$'
      },
      resolve:{
          alias:{},
          extensions:[]
      },
  }
  ```

### 获取 webpack 原生配置

```js
const easy = require("easywebpack");
const webpackConfig = easy.getWebpackConfig({
  env: process.env.BUILD_ENV, // 支持dev, test, prod 模式
  target: "web",
  entry: {
    app: "src/lib.js",
  },
});
```

根据不同的前端渲染方法:

- `const easy = require('easywebpack-vue');`
- `const easy = require('easywebpack-react');`
- `const easy = require('easywebpack-html');`
- `const easy = require('easywebpack-js');`
- `const EasyWebpack = require('easywebpack-weex');`

```js
// ${app_root}/webpack.config.js
module.exports = {
  // framework 支持 `js`,`html`, `vue`, `react`, `weex`
  framework: 'html'
  entry:{
    index: 'src/app.js'
  },
  template: 'src/view/layout.html'
  loaders:{},
  pugins:{},
  customize(webpackConfig){ // 非必须
    // 此处 webpackConfig 为原生的 webpackconfig, 你可以进行加工处理
    return webpackConfig;
  }
  done(){}
}
```

上述配置就可以支持一下功能:

- 支持 `easy start` 方式启动 Webpack dev server
- 支持 easy build dev/test/prod 三种环境构建
- 支持纯静态 HTML Webpack 构建
- 支持 es6, babel, sass, postcss, eslint 能力
- 支持开发期热更新能力,同时 Webpack 构建文件不落地磁盘
- 支持编译结果 UI 展示和访问
- 支持图片压缩, js 压缩, css 压缩, extract 能力
- 通过 `easy build` 即可构建发布模式

在使用`webpack`时经常还会用到`babel, postcss`等:

```js
// ${app_root}/.babelrc
{
  "presets": [["env",{ "modules": false }]],
  "plugins": [
    "transform-object-rest-spread",
    "syntax-dynamic-import",
    "transform-object-assign"
  ],
  "comments": false
}
```

```js
// ${app_root}/postcss.config.js
'use strict';
module.exports = {
  plugins: [
    require('autoprefixer')({ browsers: ['iOS >= 7', 'Android >= 4.0'] })
  ]
};
```

#### entry

> `config.entry` webpack构建入口配置

### 脚手架

使用基于 easywebpack 前端工程化解决方案构建的脚手架 [easywebpack-cli](https://github.com/easy-team/easywebpack-cli) 初始化各种项目, 目前支持如下骨架项目:

- [multiple-html-boilerplate](https://github.com/hubcarl/easywebpack-multiple-html-boilerplate)  纯静态 Webpack + HTML + 页面构建项目骨架

- [vue-client-render-boilerplate](https://github.com/hubcarl/easywebpack-cli-template/tree/master/boilerplate/vue)  基于 Vue + Webpack 前端渲染的项目骨架

- [react-client-render-boilerplate](https://github.com/hubcarl/easywebpack-cli-template/tree/master/boilerplate/react)  基于 React + Webpack 前端渲染的项目骨架

- [egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate)  基于 Egg + Vue + Webpack 服务端和客户端渲染项目骨架

- [egg-react-webpack-boilerplate](https://github.com/hubcarl/egg-react-webpack-boilerplate) Egg + React + Webpack 服务端和客户端渲染项目骨架

- [egg-vue-typescript-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate)  基于 Egg + Vue + TypesScript + Webpack 服务端和客户端渲染项目骨架

- [egg-react-typescript-boilerplate](https://github.com/hubcarl/egg-react-webpack-boilerplate) Egg + React + TypesScript + Webpack 服务端和客户端渲染项目骨架

- [easywebpack-weex-boilerplate](https://github.com/hubcarl/easywebpack-weex-boilerplate)  基于 Weex Native 端和 Web 端构建解决方案渲染项目骨架
