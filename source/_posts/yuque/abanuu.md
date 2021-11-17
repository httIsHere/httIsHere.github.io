---
title: 「wx」微信小程序自定义下拉刷新
urlname: abanuu
date: '2020-03-06 17:28:25 +0800'
tags: []
categories: []
---

tags: [wx]
categories: [微信小程序]
cover:

---

<!-- more -->

#### 需求：

在小程序内存在列表等形式的页面内增加下拉刷新功能，提高用户体验感，加强界面操作与交互性；

#### 实现方法：

1、小程序提供的下拉刷新（无法自定义刷新动画）

- 在页面设置内开启下拉（单独页面设置）；

```json
{
  "enablePullDownRefresh": true
}
```

- 使用`onPullDownRefresh()`监听用户下拉操作，实现刷新操作；
- 也可以通过`wx.startPullDownRefresh`和`wx.stopPullDownRefresh`触发和关闭页面下拉刷新；

可能遇到的问题：
1）下拉时没有出现刷新的点点动画
可能是因为设置的页面背景色与点点动画一致导致无法看到动画，可以在页面配置中配置背景文字颜色：

```json
{
  "backgroundTextStyle": "dark"
}
```

2、scroll-view 内 refresher-enabled 属性开启自定义刷新
      基本库要求：2.10.1

| refresher-enabled       | boolean     | false   | 否  | 开启自定义下拉刷新                                                                 | [2.10.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| :---------------------- | :---------- | :------ | :-- | :--------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| refresher-threshold     | number      | 45      | 否  | 设置自定义下拉刷新阈值                                                             | [2.10.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| refresher-default-style | string      | "black" | 否  | 设置自定义下拉刷新默认样式，支持设置  `black/white/none`， none 表示不使用默认样式 | [2.10.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| refresher-background    | string      | "#FFF"  | 否  | 设置自定义下拉刷新区域背景颜色                                                     | [2.10.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| refresher-triggered     | boolean     | false   | 否  | 设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发      | [2.10.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| bindrefresherpulling    | eventhandle |         | 否  | 自定义下拉刷新控件被下拉                                                           | [2.10.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| bindrefresherrefresh    | eventhandle |         | 否  | 自定义下拉刷新被触发                                                               | [2.10.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| bindrefresherrestore    | eventhandle |         | 否  | 自定义下拉刷新被复位                                                               | [2.10.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |
| bindrefresherabort      | eventhandle |         | 否  | 自定义下拉刷新被中止                                                               | [2.10.1](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) |

官方文档：[scroll-view](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html)

3、原始 scroll-view 自定义下拉实现（为兼容 2.10.1 一下的下拉刷新
通过监听手指移动距离控制需要下拉模块的下拉距离，主要事件 bindtouchstart，bindtouchmove 和 bindtouchend，bindtouchmove 记录手指开始下拉时的起始位置，bindtouchmove 计算下拉距离，bindtouchend 判断并实现刷新方法。
我的自定义下拉组件（Taro 框架）

```jsx
import Taro, { Component, render } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import { getGlobalData } from "../../state/global";
import util from "../../utils";
import "./index.less";

const rpx2px = util.rpx2px();
export default class Loading extends Component {
  config = {
    enablePullDownRefresh: false,
    disableScroll: true,
  };
  constructor() {
    super(...arguments);
    this.state = {
      now_scroll_top: 0,
      moveStartPosition: 0, //开始位置
      moveDistance: 0, //移动距离
      moveRefreshDistance: rpx2px(136), //达到刷新的阈值，没有达到不进行刷新并回弹
      moveMaxDistance: rpx2px(220), //最大可滑动距离
      isRefreshMaxDown: false, //是否达到了最大距离， 用来判断是否要震动提示
      loading: false, //是否正在loading
      loading_scale: 0,
      // 2020.03.03 动态分成两个阶段，下拉时展示小鸭子浮动，放手后加载中鳄鱼
      pull_moving: false,
      back_top_num: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    // 父组件触发刷新结束/取消刷新
    // console.log(nextProps, this.state.loading)
    if (nextProps.refreshLoading != this.state.loading) {
      if (nextProps.refreshLoading) {
        this.setState({
          loading: nextProps.refreshLoading,
        });
      } else {
        this.stopPullLoading();
      }
    }
  }

  render() {
    let {
      now_scroll_top,
      moveDistance,
      loading_scale,
      loading,
      pull_moving,
      back_top_num,
    } = this.state;
    let { autoHeight } = this.props;
    let sys_info = getGlobalData("system_info");
    return (
      <ScrollView
        className={[
          "view-component component-pull-scroll",
          autoHeight ? "scroll-auto" : "",
        ]}
        id="pull-scroll-view"
        style={{
          height: autoHeight ? "auto" : sys_info.screenHeight - 80 + "px",
        }}
        scrollY={true}
        scrollTop={back_top_num}
        data-nowScrollTop={now_scroll_top}
        onTouchStart={this.pullTouchStart.bind(this)}
        onTouchMove={this.pullTouchMove.bind(this)}
        onTouchEnd={this.pullTouchEnd.bind(this)}
        onScroll={this.pullScroll.bind(this)}
        scrollWithAnimation
      >
        <View
          className="pull-view-container"
          style={{ transform: "translateY(" + moveDistance + "px)" }}
        >
          <View
            className="pull-refresh-box"
            style={{
              transform: "scale(" + loading_scale + ") translateY(-100%)",
            }}
          >
            {(pull_moving || loading) && (
              <Image
                className="loading-img"
                src="http://assets-cdn.lanqb.com/manual-box/mp/mp-pullLoading-duck.gif"
              ></Image>
            )}
          </View>
          <slot></slot>
        </View>
      </ScrollView>
    );
  }

  /**
   * 触摸事件开始
   * @param e
   */
  pullTouchStart(e) {
    let {
      moveDistance,
      moveStartPosition,
      loading,
      now_scroll_top,
    } = this.state;
    if (loading || now_scroll_top >= 30) return;
    moveDistance = 0; //重置移动距离
    moveStartPosition = e.touches[0].clientY; //记录开始移动的位置
    this.setState({
      moveDistance,
      moveStartPosition,
    });
  }
  /**
   * 触摸事件移动
   * @param e
   */
  pullTouchMove(e) {
    const _this = this;
    let {
      loading,
      moveDistance,
      moveStartPosition,
      moveMaxDistance,
      isRefreshMaxDown,
      loading_scale,
      moveRefreshDistance,
      pull_moving,
      now_scroll_top,
    } = this.state;
    //如果正在loading，则不进行接下来的行为
    if (loading || now_scroll_top >= 30) return;
    //当前scroll-view所在的滚动位置
    let nowScrollTop = e.currentTarget.dataset.nowscrolltop;

    //开始计算移动距离
    moveDistance = e.touches[0].clientY - moveStartPosition;

    //如果是往下滑动，则阻止接下来的行为
    if (moveDistance <= 0) {
      loading_scale = 0;
      // _this.stopPullLoading();
    } else {
      // if (nowScrollTop !== 0) {
      //   // 如果滚动高度 !== 0 则不进行任何操作
      // } else {
      if (moveDistance > moveMaxDistance) {
        //达到阈值
        // 显示刷新动画
        pull_moving = true;
        loading_scale = 1;
        loading = false;
        moveDistance = moveMaxDistance;
        //触发一次震动
        if (!isRefreshMaxDown) {
          isRefreshMaxDown = true;
          Taro.vibrateShort();
        }
      } else if (moveDistance < moveRefreshDistance) {
        loading_scale = 0;
        loading = false;
        pull_moving = false;
      } else {
        loading = false;
        pull_moving = true;
        loading_scale =
          moveDistance / rpx2px(136) > 1 ? 1 : moveDistance / rpx2px(136);
      }
      // }
    }
    this.setState({
      moveDistance,
      isRefreshMaxDown,
      loading_scale,
      pull_moving,
    });
  }
  /**
   * 结束触摸事件
   */
  pullTouchEnd(e) {
    const _this = this;
    let {
      loading,
      moveDistance,
      moveRefreshDistance,
      loading_scale,
      moveMaxDistance,
      pull_moving,
      now_scroll_top,
    } = this.state;
    if (loading || now_scroll_top >= 30) return;

    //当前scroll-view所在的滚动位置
    let nowScrollTop = e.currentTarget.dataset.nowscrolltop;

    //如果是往下滑动，则阻止接下来的行为
    if (moveDistance <= 0) {
      // return false
      loading_scale = 0;
      moveDistance = 0;
      loading = false;
      pull_moving = false;
    } else {
      if (moveDistance < moveRefreshDistance) {
        // 移动距离小于刷新阈值，不进行刷新
        loading_scale = 0;
        moveDistance = 0;
        loading = false;
        pull_moving = false;
        console.log("需要回弹");
      } else {
        // 开始刷新
        loading = true;
        pull_moving = false;
        _this.pullRefresh();
        if (moveDistance >= moveMaxDistance) {
          moveDistance = moveRefreshDistance;
          loading_scale =
            moveDistance / rpx2px(136) > 1 ? 1 : moveDistance / rpx2px(136);
        }
      }
      // }
    }
    this.setState({
      loading,
      //重置
      moveStartPosition: 0,
      isRefreshMaxDown: false,
      loading_scale,
      moveDistance,
      pull_moving,
    });
  }
  pullRefresh() {
    const _this = this;
    this.props.onPullRefresh();
  }
  pullScroll(event) {
    let { scrollTop } = event.detail;
    this.setState({
      now_scroll_top: scrollTop,
      back_top_num: "",
    });
  }
  stopPullLoading() {
    const _this = this;
    setTimeout(function () {
      _this.setState({
        moveDistance: 0,
        moveStartPosition: 0,
        isRefreshMaxDown: false,
        pull_moving: false,
        back_top_num: 0,
        now_scroll_top: 0,
      });
      setTimeout(function () {
        _this.setState({
          loading_scale: 0,
          loading: false,
        });
      }, 1500);
    }, 2000);
  }
}
```

#### 部分问题：

1、与 ios 上橡皮筋效果冲突导致下拉无法触发自定义刷新
页面配置`disabledScroll`，禁止页面滚动，同时页面内的列表滚动需要自己再优化调整；

2、scroll-view 的 scroll 问题
需要设定固定高度然后纵向滚动。[我都忘了是啥问题了……

3、页面下拉刷新结束后再滑动列表出现闪屏
在禁止页面橡皮筋效果后，如果页面内存在需滚动区域使用 scroll-view 效果比 view 更加流畅；
不设定固定高度不会发生闪屏但是页面滚动非常不流畅；

4、使用官方提供的 scroll-view 自定义的动画时，当 scroll-view 内容不足充满一屏时下拉出现问题
将 scroll-view 设置固定高度后，将其子元素的高度设置多一像素达到隐形撑满的效果。

```javascript
<ScrollView
  className={[
    "view-component component-pull-scroll",
    autoHeight ? "scroll-auto" : "",
  ]}
  id="pull-scroll-view"
  style={{ height: sys_info.screenHeight + "px" }}
>
  <View
    className="pull-view-container"
    style={{ height: sys_info.screenHeight + 1 + "px" }}
  >
    ...
  </View>
</ScrollView>
```

5、scroll-view 内 fixed 元素问题
ios 内 scroll-view 内 fixed 元素层级会出现问题，可能出现被遮挡的问题。

6、当页面内局部需要下拉刷新时可能导致内外两个滚动条问题
一个是页面滚动条一个是 scroll-view 滚动条，由于操作的时候触发的是 scroll-view 部分的滚动导致页面滚动无法进行从而影响页面其他操作。
Q5 和 Q6 可以合并成一个问题，当页面需要一个吸顶操作时，即滑动距离超过阈值时导航条吸顶的功能，若 scroll-view 将整个页面包含就会出现 Q5 的问题，可能导致在 ios 内吸顶的导航栏无法显示，若 scroll-view 只包含需要刷新的部分则会出现 Q6 的两个滚动条的问题。
1）在页面未触发吸顶时禁止 scroll-view 模块下拉，触发后放开滚动，同时会导致无法下拉。
2）页面滚动触发，scroll-view 模块可下拉，但是滚动区域无法滚动，且下拉动画只显示一次。
