---
title: Taro 多端开发
date: 2020-03-24 14:42:30
tags:
  - "taro"
  - "微信小程序"
  - "React Native"
categories:
  - "taro"
---

> 背景: 原先使用 Taro 开发了微信小程序, 现需要打包 App 应用.

### 跨平台开发

在编译时, 遇到不同的框架、组件、API 差异时, 可使用内置的环境变量来做一些特殊处理.

- #### process.env.TARO_ENV

  用于判断当前编译类型，目前有`weapp / swan / alipay / h5 / rn / tt / qq / quickapp`, 可在代码内进行类型区分.

  ```js
  if (process.env.TARO_ENV === "weapp") {
    require("path/to/weapp/name");
  } else if (process.env.TARO_ENV === "h5") {
    require("path/to/h5/name");
  }
  ```

- #### 样式文件中跨平台支持

  ```css
  /**指定平台保留样式：*/

  /*  #ifdef  %PLATFORM%  */
  样式代码
  /*  #endif  */

  /**指定平台剔除样式：*/

  /*  #ifndef  %PLATFORM%  */
  样式代码
  /*  #endif  */

  /**比如需要只在小程序内生效*/

  /*  #ifdef weapp  */
  样式代码
  /*  #endif  */
  ```

- #### 多端文件

  多端组件, 假如有一个 Test 组件存在微信小程序、百度小程序和 H5 三个不同版本，那么就可以像如下组织代码

  test.js 文件，这是 Test 组件默认的形式，编译到微信小程序、百度小程序和 H5 三端之外的端使用的版本

  test.h5.js 文件，这是 Test 组件的 H5 版本

  test.weapp.js 文件，这是 Test 组件的 微信小程序 版本

  test.swan.js 文件，这是 Test 组件的 百度小程序 版本

  四个文件，对外暴露的是统一的接口，它们接受一致的参数，只是内部有针对各自平台的代码实现

  而我们使用 Test 组件的时候，引用的方式依然和之前保持一致，import 的是不带端类型的文件名，在编译的时候会自动识别并添加端类型后缀.

  ```jsx
  import Test from "../../components/test";

  <Test argA={1} argA={2} />;
  ```

  多端脚本, 例如微信小程序上使用 Taro.setNavigationBarTitle 来设置页面标题，H5 使用 document.title，那么可以封装一个 setTitle 方法来抹平两个平台的差异。

  增加 set_title.h5.js，代码如下

  ```js
  export default function setTitle(title) {
    document.title = title;
  }
  ```

  增加 set_title.weapp.js，代码如下

  ```js
  import Taro from "@tarojs/taro";
  export default function setTitle(title) {
    Taro.setNavigationBarTitle({
      title
    });
  }
  ```

  调用的时候，如下使用

  ```js
  import setTitle from "../utils/set_title";

  setTitle("页面标题");
  ```

### 多端同步调试

从 1.3.5 版本开始，可以在 dist 目录下创建一个与编译的目标平台名同名的目录，例如编译到微信小程序，最终结果是在 dist/weapp 目录下，使各个平台使用独立的目录互不影响，从而达到多端同步调试的目的，在 config/index.js 配置如下：
```js
outputRoot: `dist/${process.env.TARO_ENV}`
```

### Windows编译开发

- #### 编译

  ```
  # yarn
  $ yarn dev:rn
  # npm script
  $ npm run dev:rn
  # 仅限全局安装
  $ taro build --type rn --watch
  # npx 用户也可以使用
  $ npx taro build --type rn --watch
  ```

  编译成功后的代码在根目录的`rn_temp`下, 其中关键文件及目录如下：

    - index.js：React Native 入口文件
    - app.json：React Native 应用的配置，从 config.rn.appJson 中获取

- #### 打包

  打开终端在项目根目录下运行: `react-native start`, 会在 8081 端口启动 Metro Bundler 负责打包 jsbundle.

  在浏览器输入(http://127.0.0.1:8081)，可以看到如下页面：

  ![](https://user-images.githubusercontent.com/9441951/55865494-13245d00-5bb1-11e9-9a97-8a785a83b584.png)

  之后打开(http://127.0.0.1:8081/rn_temp/index.bundle?platform=android&dev=true) 会触发对应终端平台的 js bundle 构建.
  
  ![](https://user-images.githubusercontent.com/9441951/55865039-37336e80-5bb0-11e9-8aca-c121be4542f6.png)

- #### 启动应用

  clone Taro提供的React Native iOS/Android 空应用的壳子, 然后在该项目内安装依赖, 使用react-native命令启动

  ```bash
  git clone git@github.com:NervJS/taro-native-shell.git
  ```

  Android启动(保证AVD处于开启状态):
  
  ```
  react-native run-android
  ```