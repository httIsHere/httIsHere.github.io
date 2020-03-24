---
title: 底部input获得焦点, 页面弹出软键盘时页面上移问题处理
date: 2020-01-15 09:19:12
tags:
    - 'wx'
    - '微信开发'
categories: 
    - '微信小程序'
---

在开发时经常会遇到底部输入框的需求, 比如聊天界面, 评论, 直播弹幕等等, 但是在微信小程序内存在一个问题, 在底部`input`获得焦点时页面弹出软键盘页面会整体上移, 不管页面元素是否为`fixed`等.

正常未获得焦点情况:
![normal](https://upload-images.jianshu.io/upload_images/6080416-965e7d9b93fea702.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

获取焦点后：
![focus](https://upload-images.jianshu.io/upload_images/6080416-bbb25ecc107a5c47.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

微信官方提供了一个`adjustPosition`属性, 键盘弹起时，是否自动上推页面.

将`input`的`adjust-position`设为`false`之后, 弹出软键盘后页面不会上移, 但是会导致输入框被软键盘覆盖.

```html
<input className="barrage-input" adjustPosition="{false}" />
```
![adjust-position](https://upload-images.jianshu.io/upload_images/6080416-55f0fa43775a3ffd.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

所以需要通过输入框获得焦点, 失去焦点以及软键盘高度变化时获取软键盘高度对`input`位置进行手动设置.

```html
<View
  className={["barrage-bar", keyboard_height ? "untouch-bottom" : ""]}
  style={{ bottom: keyboard_height + "px" }}
>
  <View className="barrage-bar-inner">
    <Input
      className="barrage-input"
      value={input_msg}
      placeholder="有疑问？弹幕问老师..."
      placeholderStyle="color:#999999;"
      adjustPosition={false}
      onInput={this.inputMsgChange.bind(this)}
      onFocus={this.inputFocus.bind(this)}
      onBlur={this.inputBlur.bind(this)}
      onKeyboardHeightChange={this.keyboardHeightChange.bind(this)}
    ></Input>
    <View
      className={["btn btn-send", input_msg.length ? "btn-can-send" : ""]}
      onClick={this.sendMessageOnPage.bind(this)}
    >
      发送
    </View>
  </View>
</View>
```

```js
  inputFocus(e) {
    // 输入框获取焦点, 通过软键盘高度设置输入框位置
    this.setState({
      keyboard_height: e.detail.height
    });
  }

  inputBlur(e) {
    this.setState({
      keyboard_height: 0
    });
  }

  keyboardHeightChange(e) {
    this.setState({
      keyboard_height: e.detail.height
    });
  }
```
最终:
![](https://upload-images.jianshu.io/upload_images/6080416-7ee8dca6ada06335.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/6080416-f921dac1f7f705dd.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)