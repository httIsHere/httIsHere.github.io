---
title: 「Taro」Taro CLI 与本地安装运行时框架 @tarojs/taro-weapp 版本不一致
urlname: nospzk
date: 2020-02-14 19:19:51 +0800
tags: []
categories: []
---

tags: [taro, error]
categories: [taro]
cover:

---

<!-- more -->

使用 npm 切换版本也可，需要提前进行 reset cache，并采用全局操作。

```bash
npm install -g @tarojs/cli@1.3.10
```

-------------------------------2020.03.30 更新-------------------------------

啊啊啊啊啊！成功更新项目 taro 版本后，可以使用 yarn dev:weapp 成功编译，但是在微信开发工具中出现报错。
![0216.PNG](https://cdn.nlark.com/yuque/0/2020/png/250093/1581935342747-e118ac34-6099-4e18-8516-77b75975450f.png#align=left&display=inline&height=319&margin=%5Bobject%20Object%5D&name=0216.PNG&originHeight=319&originWidth=798&size=37866&status=done&style=none&width=798)
搞了几天也没有明确报错原因，所以打算还是回退本地的 taro 版本，但是使用 npm 卸载或者切换版本以及直接删除 npm 目录下的@taro 都无效之后，使用 yarn 进行了下 taro 版本切换操作然后成功了。

```bash
yarn add @tarojs/cli@1.3.10
```

想知道为什么？！！！

-------------------------------2020.02.17-------------------------------

为原先开发小程序的时候 Taro 还是 1.3.10，现在换了电脑安装了 Taro 2.0，结果编译运行项目的时候就报错了。
![0214.PNG](https://cdn.nlark.com/yuque/0/2020/png/250093/1581679328067-ac66632d-ef65-4dd4-9be1-c090b1a47399.png#align=left&display=inline&height=245&margin=%5Bobject%20Object%5D&name=0214.PNG&originHeight=245&originWidth=1331&size=33627&status=done&style=none&width=1331)

本地 Taro 版本与项目 Taro 版本不一致。

所以需要更新项目的 Taro 版本。

```bash
# 首先更新 Taro CLI 工具，全部升级至最新版本

# taro
$ taro update self
# npm
npm i -g @tarojs/cli
# yarn
yarn global add @tarojs/cli

# 更新项目中 Taro 相关的依赖

$ taro update project
```

本地更新至了 Taro 2.0.3，但是`taro update project`更新后，package.json 内`@tarojs/taro-weapp`为 1.3.37，导致本地与项目 Taro 版本还是不一致，所以在使用`taro update project`时添加相应的版本号。

但是再次编译还是报不一致的错误，需要删除 node_modules 之后重新安装依赖。

警告：Warning: React version not specified in eslint-plugin-react settings. See https://github.com/yannickcr/eslint-plugin-react#configuration .
原因：eslint-plugin-react 未指定 react 版本。

```bash
# Install ESLint either locally or globally. (Note that locally, per project, is strongly preferred)
$ npm install eslint --save-dev

# If you installed ESLint globally, you have to install React plugin globally too. Otherwise, install it locally.
$ npm install eslint-plugin-react --save-dev
```

并在 eslintrc.js 中指定 react 版本但是还是无效！！！！

```json
1. settings: {
2. 	react: {
3.         version: "detect"
4.     }
5. }
```
