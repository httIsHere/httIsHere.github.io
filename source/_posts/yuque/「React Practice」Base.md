---
title: 「React Practice」Base
urlname: ronixb
date: 2021-07-07 09:59:12 +0800
tags: [React]
categories: [React]
---

> 「React Practice」系列教程是学习王沛老师的【React 实战进阶】课程的学习记录，demo 参考来自[https://codesandbox.io/s/6n20nrzlxz](https://codesandbox.io/s/6n20nrzlxz)。
> **非原创，仅作为学习记录。**

### React 组件（props + state => view）

- React 组件一般不提供方法，而是某种状态机；
- React 组件可以理解为一个纯函数；
- 单向数据绑定；

#### 组件类型

- 受控组件：表单元素状态由使用者维护；
- 非受控组件：表单元素状态 DOM 自身维护；

#### 创建组件，单一职责原则

- 每个组件只做一件事；
- 如果组件变得复杂，就需要拆分成小组件（拆分复杂度，优化性能，无需重新渲染整个大组件）；

#### 数据状态管理，DRY 原则

- 能计算得到的状态不要单独储存；
- 组件尽量无状态，所需数据通过 props 获取；

### JSX，不是模版语言，而是语法糖

在 JavaScript 代码内直接写 HTML 标记。
本质是**动态创建组件的语法糖**。

```javascript
const name = 'htt';
const element = <h1>Hello, {name}</h1>; // 更直观

||
||
\/

const name = 'htt';
const element = React.createElement('h1', null, 'Hello, ', name);
```

#### 在 JSX 内使用表达式

- JSX 本身也是表达式
- 在属性中使用表达式
- 延展属性
- 表达式作为子元素

#### 优点

- 声明式创建界面的直观
- 代码动态创建界面的灵活
- 无需学习新的模版语言

#### 规范：自定义组件以大写字母开头

- React 认为小写的 tag 是原生 DOM 节点
- JSX 标记可以直接使用属性语法，例如 `<menu.item />`

### React 生命周期

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1625625250571-e908437a-78eb-4c2e-a756-c9a040c0cb03.png#align=left&display=inline&height=630&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1260&originWidth=2254&size=229873&status=done&style=none&width=1127)
图片来源：[https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
`commit`：React 把当前的状态映射到 DOM，实际的更新 DOM 节点。

#### 挂载时：

- `constructor` ：用于初始化内部状态，较少使用；唯一可以直接赋值修改 state 的地方；
- `getDerivedStateFromProps` ：当 state 需要从 props 初始化时使用；尽量不要使用：维护两者状态一致性会增加复杂度；每次 render 都会调用；典型场景：表单控件获取默认值；
- `componentDidMount` ：UI 渲染完成后调用；只执行一次；典型场景：获取外部资源；

#### 更新时：传入新的 props/内部 state 改变/force update；

- `shouldComponentUpdate` ：决定 Virtual DOM 是否需要重绘，无需变化可以返回 false；一般由 PureComponent 自动实现；典型场景：性能优化；
- `getSnapshotBeforeUpdate` ：在 render 之前调用，state 已更新；典型场景：获取 render 之前的 DOM 状态；注：getSnapshotBeforeUpdate() should be used with componentDidUpdate()；
- `componentDidUpdate`：每次 UI 更新时调用；典型场景：页面需要根据 props 变化重新获取数据；

#### 卸载时：

- `componentWillUnmount` ：组件移除时调用；典型场景：资源释放；

#### DEMO

```jsx
import React from "react";

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    console.log("Clock constructed");
    this.state = { date: new Date() };
  }

  componentDidMount() {
    console.log("Clock did mount");
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    console.log("Clock will unmount");
    clearInterval(this.timerID);
  }

  componentDidUpdate() {
    console.log("Clock did update");
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

```jsx
import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class SnapshotSample extends PureComponent {
  state = {
    messages: [],
  };

  handleNewMessage() {
    this.setState((prev) => ({
      messages: [`msg ${prev.messages.length}`, ...prev.messages],
    }));
  }

  componentDidMount() {
    for (let i = 0; i < 20; i++) this.handleNewMessage();
    this.interval = window.setInterval(() => {
      if (this.state.messages.length > 200) {
        window.clearInterval(this.interval);
        return;
      }
      this.handleNewMessage();
    }, 1000);
  }
  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  getSnapshotBeforeUpdate() {
    return this.rootNode.scrollHeight;
  }

  componentDidUpdate(prevProps, prevState, prevScrollHeight) {
    const scrollTop = this.rootNode.scrollTop;
    if (scrollTop < 5) return;
    this.rootNode.scrollTop =
      scrollTop + (this.rootNode.scrollHeight - prevScrollHeight);
  }

  render() {
    return (
      <div className="snapshot-sample" ref={(n) => (this.rootNode = n)}>
        {this.state.messages.map((msg) => (
          <div>{msg}</div>
        ))}
      </div>
    );
  }
}
```

### Virtual DOM，JSX 运行基础

#### 工作原理

Diff：对前后两个 DOM 树进行**广度优先分层比较**，对节点进行一层一层的比较；复杂度为 `O(n)` ，否则两棵树的比较复杂度为 O(n)；
针对 UI 这种树结构相对稳定的场景下不会造成较大的性能问题；

- 组件的 DOM 结构相对稳定；
- 类型相同的兄弟节点可以被唯一标识（key 属性，可以提高性能）；

#### DEMO

[https://supnate.github.io/react-dom-diff/index.html](https://supnate.github.io/react-dom-diff/index.html)

### 高阶组件&函数作为子组件（设计模式）

> 实现更多场景的组件复用。

#### 高阶组件（HOC，Higher Order Component）

> 接受组件作为参数，返回新的组件。

可以实现一些通用函数，但自身并不包含 UI。

```jsx
// 高阶组件
import React from "react";

export default function withTimer(WrappedComponent) {
  return class extends React.Component {
    state = { time: new Date() };
    componentDidMount() {
      this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    tick() {
      this.setState({
        time: new Date(),
      });
    }
    render() {
      return <WrappedComponent time={this.state.time} {...this.props} />;
    }
  };
}

// 需要调用的组件
import React from "react";
import withTimer from "./withTimer.jsx";

export class showTimer extends React.Component {
  render() {
    return <h2>{this.props.time.toLocaleString()}</h2>;
  }
}
export default withTimer(showTimer); // 暴露被高阶包装过的组件
```

#### 函数作为子组件

用法：

```jsx
class MyComponent extends React.Component {
  render() {
    return <div>{this.props.children("HTT")}</div>;
  }
}

// 调用时
<MyComponent>{(name) => <div>{name}</div>}</MyComponent>;
```

Demo：

```jsx
import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class AdvancedTabSelector extends PureComponent {
  static propTypes = {
    value: PropTypes.object,
    options: PropTypes.array,
    onChange: PropTypes.func,
    children: PropTypes.func,
  };

  static defaultProps = {
    value: null,
    options: [],
    onChange: () => {},
    children: () => {},
  };

  render() {
    const { options, value, onChange } = this.props;
    return (
      <div className="tab-selector">
        <ul>
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`tab-item ${
                opt.value === this.props.value ? "selected" : ""
              }`}
              onClick={() => this.props.onChange(opt.value)}
            >
              {opt.name}
            </li>
          ))}
        </ul>

        {this.props.value && this.props.children(this.props.value)}
      </div>
    );
  }
}

const colors = [
  { name: "Red", value: "red" },
  { name: "Blue", value: "blue" },
  { name: "Orange", value: "orange" },
];

const animals = [
  { name: "Tiger", value: "tiger" },
  { name: "Elephant", value: "elephant" },
  { name: "Cow", value: "cow" },
];

export class AdvancedTabSelectorSample extends PureComponent {
  state = {
    color: null,
  };
  render() {
    return (
      <div>
        <h3>Select color: </h3>
        <AdvancedTabSelector
          options={colors}
          value={this.state.color}
          onChange={(c) => this.setState({ color: c })}
        >
          {(color) => (
            <span
              style={{
                display: "inline-block",
                backgroundColor: color,
                width: "40px",
                height: "40px",
              }}
            />
          )}
        </AdvancedTabSelector>

        <h3>Select animal: </h3>
        <AdvancedTabSelector
          options={animals}
          value={this.state.animal}
          onChange={(c) => this.setState({ animal: c })}
        >
          {(animal) => (
            <img width="100px" src={require(`../../images/${animal}.png`)} />
          )}
        </AdvancedTabSelector>
      </div>
    );
  }
}
```

### Context API（React 16.3 新特性，之前版本都是内部 API）

- 根节点：Provider
- 子节点：Consumer

> 无需手动去监听组件外部状态的变化然后去重新更新组件，context api 会自动监听状态变化。

```jsx
import React from "react";

const enStrings = {
  submit: "Submit",
  cancel: "Cancel",
};

const cnStrings = {
  submit: "提交",
  cancel: "取消",
};
const LocaleContext = React.createContext(enStrings);

// 用于提供上下文数据，并切换上下文
class LocaleProvider extends React.Component {
  state = { locale: cnStrings };
  toggleLocale = () => {
    const locale = this.state.locale === enStrings ? cnStrings : enStrings;
    this.setState({ locale });
  };
  render() {
    return (
      <LocaleContext.Provider value={this.state.locale}>
        <button onClick={this.toggleLocale}>切换语言</button>
        {this.props.children}
      </LocaleContext.Provider>
    );
  }
}

class LocaledButtons extends React.Component {
  render() {
    return (
      <LocaleContext.Consumer>
        {(locale) => (
          <div>
            <button>{locale.cancel}</button> <button>{locale.submit}</button>
          </div>
        )}
      </LocaleContext.Consumer>
    );
  }
}

export default () => (
  <div>
    <LocaleProvider>
      <div>
        <LocaledButtons />
      </div>
    </LocaleProvider>
    {/* 这个组件就没有locale属性 */}
    <LocaledButtons />
  </div>
);
```

### 脚手架工具

• create-react-app（入门，小项目，简易项目）
• Rekit（基于 create-react-app 提供了更多功能，适合大项目）
• Codesandbox（在线创建）

### 打包和部署

#### 打包（webpack->loader）

• 编译 ES6 语法特性，编译 JSX；
• 整合资源，例如图片，less/sass；
• 优化代码体积；
注：
• 设置 nodejs 环境为 production；
• 禁用开发专用代码，比如 logger；
• 设置应用根路径；
