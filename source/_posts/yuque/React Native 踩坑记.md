
---

title: React Native 踩坑记

urlname: gkbbpw

date: 2020-03-26 14:35:22 +0800

tags: []

categories: []

---
<a name="YzgqY"></a>
### _写在前头（Taro内）_
- 文字要包在 `Text` 组件里面，否则不显示。
- `position:fixed` React Native 不支持
- Animation 和 transform React Native 动画不支持
- React Native 与 H5/小程序 的 Flex 布局相关属性的默认值有差异
<a name="i5vbr"></a>
### _RN样式相关问题_
<a name="saOp6"></a>
#### 1. 通配选择器会被忽略
<a name="NiCNh"></a>
#### 2. background-size样式属性无效
<a name="swIZ2"></a>
#### 3. 400,700，normal 或 bold 之外的 font-weight 值在Android上的React Native中没有效果
<a name="vKvKA"></a>
#### 4. 设置背景图片
React Native 的 Background 仅支持 backgroundColor 属性，所以需要设置背景图片时需要采用ImageBackground组件;
<a name="dTgEw"></a>
#### 5. RN阴影样式属性
其仅支持ios平台，在Android中需要使用elevation属性实现，但elevation仅提供一个灰色阴影。<br />react-native-shadow还需研究一下。mark<br />
```jsx
system_android ? (
      <BoxShadow
        setting={{
          width: rpx2px(width),
          height: rpx2px(height),
          color: color,
          border: rpx2px(border || 0) || 2,
          radius: rpx2px(radius),
          opacity: opacity,
          x: rpx2px(offsetX),
          y: rpx2px(offsetY),
          style: { marginVertical: 0, justifyContent: "center" }
        }}
      >
        {this.props.children}
      </BoxShadow>
    ) : (
      this.props.children
    );
```


<a name="pVbRR"></a>
#### 6. box-sizing不支持
<a name="yp5sZ"></a>
#### 7. padding失效问题
将文本内容设置为`flex: 1;`
<a name="ugtC6"></a>
#### 8. rn的flexBox布局问题
默认flex-direction是column。
<a name="iC9eV"></a>
#### 9. 不支持伪元素写法
<a name="vVbH2"></a>
#### 10. Failed prop type: Invalid props.style key `color` supplied to `View`
同理有类似的Failed prop type: Invalid props.style key `fontSize` supplied to `View`。<br />不能给View组件添加color，fontSize等文字样式属性，需要指定Text添加样式属性。
<a name="2JqSv"></a>
#### 11. 页面实现滑动需要使用ScrollView
<a name="t2NK0"></a>
#### 12. input输入框未显示完全
Android 输入框默认带有上下内边距，所以需要将上下padding设置为0。<br />หมดชีวิตที่เห็นเมื่อใดก็เป็นของเธอ
<a name="Oj5Ba"></a>
### _编译问题_
<a name="lIpu2"></a>
#### 1. react-native编译之后报错
error: bundling failed: Error: Unable to resolve module `./components/calendar` from `E:\httishere\work\manual-box-wechat-app\node_modules\taro-ui\dist\weapp\index.js`: The module `./components/calendar` could not be found from `E:\httishere\work\manual-box-wechat-app\node_modules\taro-ui\dist\weapp\index.js`. Indeed, none of these files exist:<br />原因：taro-ui不支持React Native。<br />

<a name="NyPLz"></a>
#### 2. Application taroDemo has not been registered.
     Hint: This error often happens when you're running the packager (local dev server) from a wrong folder. For example you have multiple apps and the packager is still running for the app you were working on before.<br /> If this is the case, simply kill the old packager instance (e.g. close the packager terminal window) and start the packager in the correct app folder (e.g. cd into app folder and run 'npm start').<br />原因：存在项目终端冲突，关闭所有终端并重启，查看项目内config/index文件是否注册应用名。<br />因为我用了taro-native-shell这个壳子，所以命名为'taroDemo'。<br />![微信图片_20200327140918.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1585289424201-8a2fbe69-63c3-4df2-b98b-eb7ecef1f74e.png#align=left&display=inline&height=121&name=%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200327140918.png&originHeight=121&originWidth=423&size=4573&status=done&style=none&width=423)<br />

<a name="V77r0"></a>
#### 3. Unable to load script from assets 'index.android.bundle'. Make sure your bundle is packaged correctly
在android/app/arc/main目录下新建一个assets文件，在IDE的terminal以命令启动`react-native run-android`。<br />

<a name="fj1lB"></a>
#### 4. 运行react-native start时发现8081端口被占用问题
找到占用8081的进程：<br />
```bash
netstat -aon |findstr "8081"
```
![8081.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1585469950756-fff03a59-91a5-411d-92db-5c69892bf6be.png#align=left&display=inline&height=76&name=8081.png&originHeight=76&originWidth=588&size=4407&status=done&style=none&width=588)<br />使用pid杀死占用8081的进程：
```bash
taskkill /pid xxx /F
```
![kill-by-pid.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1585470017430-a9d85a9d-e255-44e1-bad7-80d67e630b2e.png#align=left&display=inline&height=69&name=kill-by-pid.png&originHeight=69&originWidth=390&size=3185&status=done&style=none&width=390)<br />

<a name="6EopV"></a>
#### 5. ReferenceError: ReferenceError: Can't find variable: Button(XXXX)
解决：
```javascript
import {
  Text,
  View,
  Button,
  ...
} from 'react-native';
```


<a name="BjO3m"></a>
#### 6. undefined is not a function (evaluating 'transform.forEach')
 Warning: Failed prop type: Invalid prop `transform` of type `string` supplied to `View`, expected an array.<br />transform属性详情需要以array的形式：<br />![style-transform-array.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1585476684072-2a4f20ce-a78f-4cc2-b9c3-6f732cff8464.png#align=left&display=inline&height=60&name=style-transform-array.png&originHeight=60&originWidth=548&size=3017&status=done&style=none&width=548)

<a name="grScl"></a>
#### 7. Invariant Violation: View config not found for name slot
return的内容内组件的首字母不是大写，所以需要将组件的首字母写成大写字母。<br />

<a name="KN7dW"></a>
#### 8. Error: Cannot add a child that doesn't have a YogaNode to a parent without a measure function!
在render时不建议使用下面这种写法，建议采用三目运算符。<br />

```jsx
		this.state.amount && (
       <View>
         <Text>
           hello world
         </Text>
       </View>
      )
```
换成：<br />

```jsx
this.state.amount ?
       <View>
         <Text>
           hello world
         </Text>
       </View> : null
  );
```
还有不要有单独的字符串暴露，应使用Text进行包裹。<br />

<a name="bmAy7"></a>
#### 9. TypeError: undefined is not an object (evaluating 'course.posters.banner')
需要对变量进行初始化或者值判断。<br />

<a name="KIuKW"></a>
#### 10. Error while updating property 'height' in shadow node of type: RCTView
![height-value-type.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1585535630906-8a344136-4f69-4d1b-9c6d-7454438b8c12.png#align=left&display=inline&height=169&name=height-value-type.png&originHeight=169&originWidth=463&size=64259&status=done&style=none&width=463)<br />在reactNative 写样式的时候  宽、高、padding等值不能是字符串。<br />

<a name="S619d"></a>
#### 11. Failed prop type: Invalid props.style key `transform-origin` supplied to 'Image'


<a name="dZojP"></a>
#### 12. Error while updating property 'transform' of a view managed by: RCTImageView
因为我的transform内有rotate的操作，我原来是直接设置`rotate: rotateValue+'deg'`，但是发现会出现上述报错，后来看了相关问题需要通过插值器的方法将int转换成他需要的deg。<br />[React Native loading旋转动画的实现](https://www.jianshu.com/p/e131375eb8c4)<br />

<a name="ca5yW"></a>
#### 13. has been blocked by CORS policy
Access to fetch at 'http://localhost:8081/rn_temp/index.delta?platform=android&dev=true&minify=false' from origin 'http://127.0.0.1:8081' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.<br />访问的域名不同导致, 浏览器地址栏为127.0.0.1:8081/debugger-ui/, 真机或模拟器访问的地址为http://localhost:8081/rn_temp/index.bundle?platform=android&dev=true。<br />

<a name="MgIQl"></a>
#### 14.  React.createElement: type is invalid
React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.<br />可能是引入子组件时出现问题，我原来子组件内export组件为<br />
```jsx
export class PhoneCode extends Component {
// 调整为
export default class PhoneCode extends Component {
```


<a name="x0xQX"></a>
#### 15. Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
存在无效元素，可以是引入的组件或工具路径错误等。<br />

<a name="RABEe"></a>
#### 16. Object.freeze can only be called on Objects
同Q2。
<a name="S0mJl"></a>
### _Taro Api React Native支持度_
<a name="0trSF"></a>
#### 1. 不支持Taro.addInterceptor
<a name="z7eKf"></a>
#### 2. React Native暂不支持storage的同步存取（Taro.(get/set)StorageSync）
所以需要使用async / await + Taro.(get/set)Storage 实现，在使用时需要添加环境判断。<br />
```bash
regeneratorRuntime is not defined
```
解决:<br />
```bash
$ yarn add @tarojs/async-await
# 或者使用 npm
$ npm install --save @tarojs/async-await
```
在有异步操作的 页面内引入import '@tarojs/async-await'。<br />开启 async functions 支持需要安装包 `babel-plugin-transform-runtime` 和` babel-runtime`。<br />
```bash
$ yarn add babel-plugin-transform-runtime --dev
$ yarn add babel-runtime
```
随后修改项目 [`babel` 配置](https://nervjs.github.io/taro/docs/config-detail.html#babel)，增加插件 `babel-plugin-transform-runtime`。
```json
babel: {
  sourceMap: true,
  presets: [
    [
      'env',
      {
        modules: false
      }
    ]
  ],
  plugins: [
    'transform-decorators-legacy',
    'transform-class-properties',
    'transform-object-rest-spread',
    ['transform-runtime', {
      "helpers": false,
      "polyfill": false,
      "regenerator": true,
      "moduleName": 'babel-runtime'
    }]
  ]
}
```

<br />写一个相关的存取事件，在需要时async/await进行存取。<br />

<a name="Vit1J"></a>
### _其他问题_
<a name="g8WBO"></a>
#### 1. 真机内页面无法有效上滑

