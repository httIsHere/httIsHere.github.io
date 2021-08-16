---
title: 「React Practice」React生态圈
urlname: uqto9w
date: 2021-07-12 10:13:37 +0800
tags: [React]
categories: [React]
---

> 「React Practice」系列教程是学习王沛老师的【React 实战进阶】课程的学习记录，demo 参考来自[https://codesandbox.io/s/6n20nrzlxz](https://codesandbox.io/s/6n20nrzlxz)。
> **非原创，仅作为学习记录。**

### Redux

> ref：[https://css-tricks.com/learning-react-redux/](https://css-tricks.com/learning-react-redux/)

独立于 react 之外的单独的一个库。

组件：state -> DOM。

全局有一个唯一 store，负责提供整个应用程序所有的状态。Redux 让组件通信更加容易。
![redux-article-3-03.svg](https://cdn.nlark.com/yuque/0/2021/svg/250093/1626057511251-3ffc1bfc-80be-49c9-b8a9-b14c0606769e.svg#align=left&display=inline&height=500&margin=%5Bobject%20Object%5D&name=redux-article-3-03.svg&originHeight=500&originWidth=800&size=66153&status=done&style=none&width=800)
图片来源：[https://css-tricks.com/learning-react-redux](https://css-tricks.com/learning-react-redux)

#### 特性

- Single Source of Truth

所有的 View 全部依赖于 Store，View 内部尽量没有自己的状态（Redux uses only one store for all its application state. Since all state resides in one place）。

- 可预测性

`state + action = new state` ，不是在原 state 上对 state 进行修改，而是产生一个新的 state（**State is Read-Only**）。

- 纯函数更新 store

#### Store

> _The only way to mutate the state is to emit an action, an object describing what happened._
> The application cannot modify the state directly. Instead, “actions” are dispatched to express an intent to change the state in the store.

![redux-article-3-05.svg](https://cdn.nlark.com/yuque/0/2021/svg/250093/1626060713513-5424b39b-98b2-48c4-8a2b-a0f712cc7175.svg#align=left&display=inline&height=265&margin=%5Bobject%20Object%5D&name=redux-article-3-05.svg&originHeight=265&originWidth=800&size=34830&status=done&style=none&width=800)

```javascript
const store = createStore(reducer);

// 三个通用方法
store.getState();
store.dispatch(action);
store.subscribe(listener);
```

Reducers are functions that you write which handle dispatched actions and can actually change the state.
Dispatching an action is **the only way** for the application code to express a state change:

```javascript
var action = {
  type: "ADD_USER",
  user: { name: "Dan" },
};
```

触发更新就是通过 reducer 进行的，reducer 就是一个函数，接收 state 和 action，reducer 可以接收到所有 action，然后在函数体内根据 action 的 type 来处理具体的 action。

```javascript
var someReducer = function(state, action) {
  switch(action.type) {
    case ...
    default:
      return state;
  }
}
```

数据流向：比如点击页面某个按钮产生了事件 action，action 通过 dispatcher 被分发给了 reducer，然后由 reducer 来处理改变 state，最后通知 UI 进行页面数据更新。

#### 工具函数

- combineReducers：多个 reducer 的整合

```javascript
import { combineReducers } from "redux";
...
export default combineReducers({
	reducer1,
	reducer2,
	...
})
```

- bindActionCreators： `bindActionCreators(actionCreators, dispatch)`，  使用 dispatch 对每个 action creator 进行包装，以便可以直接调用它们。

#### DEMO

```javascript
import React from "react";
import { createStore, combineReducers, bindActionCreators } from "redux";

function run() {
  // Store initial state
  const initialState = { count: 0 };

  // reducer
  const counter = (state = initialState, action) => {
    switch (action.type) {
      case "PLUS_ONE":
        return { count: state.count + 1 };
      case "MINUS_ONE":
        return { count: state.count - 1 };
      case "CUSTOM_COUNT":
        return {
          count: state.count + action.payload.count,
        };
      default:
        break;
    }
    return state;
  };

  const todos = (state = {}) => state;

  // Create store
  const store = createStore(
    combineReducers({
      todos,
      counter,
    })
  );

  // Action creator
  function plusOne() {
    // action
    return { type: "PLUS_ONE" };
  }

  function minusOne() {
    return { type: "MINUS_ONE" };
  }

  function customCount(count) {
    return { type: "CUSTOM_COUNT", payload: { count } };
  }

  plusOne = bindActionCreators(plusOne, store.dispatch);

  store.subscribe(() => console.log(store.getState())); // 监听store的变化
  plusOne();
  store.dispatch(minusOne());
  store.dispatch(customCount(5));
}
export default () => (
  <div>
    <button onClick={run}>Run</button>
    <p>* 请打开控制台查看运行结果</p>
  </div>
);
```

#### 在 react 内使用

`react-redux`  提供了一个 `connect`  的方法，可以将 component 和 store 联系在一起。

```javascript
import { connect } from "react-redux";

class SidePanel extends Component {}

// 将store的状态传入组件
// 性能问题：用到哪些数据就绑定哪些数据
function mapStateToProps(state) {
  return {
    side_nav: state.nav,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
```

`connect`  的工作原理就是**[高阶组件](https://www.yuque.com/httishere/running/ronixb#wFSYg)。**
**![IMG_A234AAE6623C-1.jpeg](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1626077220071-e797212a-eadb-49c6-87d4-a239157b6103.jpeg#align=left&display=inline&height=519&margin=%5Bobject%20Object%5D&name=IMG_A234AAE6623C-1.jpeg&originHeight=519&originWidth=1091&size=114847&status=done&style=none&width=1091)**

```javascript
import React from "react";
import { bindActionCreators, createStore } from "redux";
import { Provider, connect } from "react-redux";

// Store initial state
const initialState = { count: 0 };

// reducer
const counter = (state = initialState, action) => {
  switch (action.type) {
    case "PLUS_ONE":
      return { count: state.count + 1 };
    case "MINUS_ONE":
      return { count: state.count - 1 };
    case "CUSTOM_COUNT":
      return { count: state.count + action.payload.count };
    default:
      break;
  }
  return state;
};

// Create store
const store = createStore(counter);

// Action creator
function plusOne() {
  // action
  return { type: "PLUS_ONE" };
}

function minusOne() {
  return { type: "MINUS_ONE" };
}

export class Counter extends React.Component {
  render() {
    const { count, plusOne, minusOne } = this.props;
    return (
      <div className="counter">
        <button onClick={minusOne}>-</button>
        <span style={{ display: "inline-block", margin: "0 10px" }}>
          {count}
        </span>
        <button onClick={plusOne}>+</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    count: state.count,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ plusOne, minusOne }, dispatch);
}

const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

export default class CounterSample extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedCounter />
      </Provider>
    );
  }
}
```

### 异步 Action&中间件

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1626850097533-f065ebbd-2535-49d8-b56c-460fd3eaea99.jpeg#align=left&display=inline&height=363&margin=%5Bobject%20Object%5D&name=&originHeight=703&originWidth=881&size=0&status=done&style=none&width=455)

#### 中间件（Middlewares）

中间件会在 dispatcher 中截获 action，进行预处理。

- 截获 action
- 发出 action

#### 异步 action

不是特殊的 action，是多个同步 action 的组合使用

#### DEMO

中间件比较常见的应用场景就是 `logger` 。

```javascript
import axios from "axios";
import {
  HOME_FETCH_FILE_CONTENT_BEGIN,
  HOME_FETCH_FILE_CONTENT_SUCCESS,
  HOME_FETCH_FILE_CONTENT_FAILURE,
  HOME_FETCH_FILE_CONTENT_DISMISS_ERROR,
} from "./constants";

export function fetchFileContent(file) {
  return (dispatch) => {
    dispatch({
      type: HOME_FETCH_FILE_CONTENT_BEGIN,
    });

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get("/rekit/api/file-content", {
          params: { file },
        });
        dispatch({
          type: HOME_FETCH_FILE_CONTENT_SUCCESS,
          data: { file, content: res.data.content },
        });
        resolve(res.data);
      } catch (e) {
        dispatch({
          type: HOME_FETCH_FILE_CONTENT_FAILURE,
          data: { error: e },
        });
        reject(e);
      }
    });
    return promise;
  };
}

export function dismissFetchFileContentError() {
  return {
    type: HOME_FETCH_FILE_CONTENT_DISMISS_ERROR,
  };
}

// 多种类型action的处理
export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_FILE_CONTENT_BEGIN:
      return {
        ...state,
        fetchFileContentPending: true,
        fetchFileContentError: null,
      };

    case HOME_FETCH_FILE_CONTENT_SUCCESS: {
      const fileContentNeedReload = { ...state.fileContentNeedReload };
      delete fileContentNeedReload[action.data.file];
      return {
        ...state,
        fileContentById: {
          ...state.fileContentById,
          [action.data.file]: action.data.content,
        },
        fileContentNeedReload,
        fetchFileContentPending: false,
        fetchFileContentError: null,
      };
    }

    case HOME_FETCH_FILE_CONTENT_FAILURE:
      return {
        ...state,
        fetchFileContentPending: false,
        fetchFileContentError: action.data.error,
      };

    case HOME_FETCH_FILE_CONTENT_DISMISS_ERROR:
      return {
        ...state,
        fetchFileContentError: null,
      };

    default:
      return state;
  }
}
```
