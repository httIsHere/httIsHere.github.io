---
title: webpack, 小白的从入门到放弃
date: 2020-01-19 21:18:06
tags:
  - 从入门到放弃
  - js
categories:
  - webpack
---

> `webpack` 是用于编译`Javascript 模块`, 可以看作是**模块打包机**(Webpack is a front-end tool to build JavaScript module scripts for browsers). 分析项目结构, 找到Javascript模块以及其他无法在浏览器上直接运行的拓展语言(Scss, TypeScript等), 并将其转换和打包为合适的格式供浏览器使用。

![](learn-webpack/webpack_00.png)

## 安装

```bash
npm install --save-dev webpack
// webpack 4+ 还需安装CLI
npm install --save-dev webpack-cli
```

通常，webpack 通过运行一个或多个`npm scripts`，会在本地`node_modules`目录中查找安装的 webpack：

```json
"scripts": {
    "start": "webpack --config webpack.config.js"
}
```

## 初始化

新建webpack-demo文件夹, 并通过`npm init`初始化, 生成package.json文件.

```json
// 最基本的package.json文件
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "webpack从入门到放弃",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

同时在根目录下新建app文件夹(存放原始数据与Javascript模块), public文件夹(webpack打包后生成的文件, 可供浏览器读取), 并创建一下文件:
- app.js (app文件夹内)
- index.html (根目录)

```
  webpack-demo
  |- package.json
+ |- index.html
+ |- /app
+   |- app.js
```

本文参考:

- [webpack 中文文档](https://www.webpackjs.com/guides/getting-started/)
- [阮一峰webpack demos](https://github.com/ruanyf/webpack-demos)
- [入门 Webpack，看这篇就够了](https://www.jianshu.com/p/42e11515c10f)
