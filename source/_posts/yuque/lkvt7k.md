---
title: 「React」Fiber是什么？
urlname: lkvt7k
date: '2021-07-27 11:51:17 +0800'
tags:
  - React
categories:
  - React
---

> 非原创，仅作为学习记录。

**Fiber 是对 React 核心算法的重构。**

#### Fiber 出现的原因

在浏览器中，页面是一帧一帧绘制出来的，渲染的帧率与设备的刷新率保持一致。一般情况下，设备的屏幕刷新率为 1s 60 次，当每秒内绘制的帧数（FPS）超过 60 时，页面渲染是流畅的；而当 FPS 小于 60 时，会出现一定程度的卡顿现象。

一帧内到底发生了什么：

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1627462146089-0de417f7-5661-4e99-8c94-9e0254eaf692.png#align=left&display=inline&height=249&margin=%5Bobject%20Object%5D&originHeight=249&originWidth=1080&size=0&status=done&style=none&width=1080)

1. 首先需要处理输入事件，能够让用户得到最早的反馈；
1. 接下来是处理定时器，需要检查定时器是否到时间，并执行对应的回调；
1. 接下来处理 Begin Frame（开始帧），即每一帧的事件，包括 window.resize、scroll、media query change 等；
1. 接下来执行请求动画帧 requestAnimationFrame（rAF），即在每次绘制之前，会执行 rAF 回调；
1. 紧接着进行 Layout 操作，包括计算布局和更新布局，即这个元素的样式是怎样的，它应该在页面如何展示；
1. 接着进行 Paint 操作，得到树中每个节点的尺寸与位置等信息，浏览器针对每个元素进行内容填充；
1. 到这时以上的六个阶段都已经完成了，接下来处于空闲阶段（Idle Peroid），可以在这时执行 requestIdleCallback 里注册的任务；

js 引擎和页面渲染引擎是在同一个渲染线程之内，如果在某个阶段执行任务特别长，例如在定时器阶段或 Begin Frame 阶段执行时间非常长，时间已经明显超过了 16ms，那么就会阻塞页面的渲染，从而出现卡顿现象。

在 react16 引入 Fiber 架构之前，react 会采用递归对比虚拟 DOM 树，找出需要变动的节点，然后同步更新它们，这个过程 react 称为 reconcilation（协调）。在 reconcilation 期间，react 会一直占用浏览器资源，会导致用户触发的事件得不到响应。**深度优先遍历去遍历节点**：

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1627462146177-7d8d8301-c8d3-489f-bdf3-a06be071378c.png#align=left&display=inline&height=398&margin=%5Bobject%20Object%5D&originHeight=398&originWidth=1080&size=0&status=done&style=none&width=1080)

这种遍历是递归调用，执行栈会越来越深，而且不能中断，中断后就需要从头开始。而且对于递归层级比较深的 DOM 树来说是非常影响性能的，在递归过程中浏览器无法做出响应。

用代码表示就是：

```javascript
const element = (
  <div id="A1">
    <div id="B1" className="B11">
      <div id="C1"></div>
      <div id="C2"></div>
    </div>
    <div id="B2" className="B22">
      <div id="C3"></div>
      <div id="C4"></div>
    </div>
  </div>
);

function render(element, parentDom) {
  const dom = document.createElement(element.type);
  Object.keys(element.props)
    .filter((ele) => ele !== "children")
    .forEach((item) => {
      dom[item] = element.props[item];
    });

  if (Array.isArray(element.props.children)) {
    element.props.children.forEach((item) => render(item, dom));
  } else if (
    element.props.children &&
    Object.keys(element.props.children).length !== 0
  ) {
    render(element.props.children, dom);
  }

  parentDom.appendChild(dom);
}

render(element, document.getElementById("root"));
```

> React 希望能够彻底解决主线程长时间占用问题，于是引入了 Fiber 来改变这种不可控的现状，把渲染/更新过程拆分为一个个小块的任务，通过合理的调度机制来调控时间，指定任务执行的时机，从而降低页面卡顿的概率，提升页面交互体验。
> 通过 Fiber 架构，让 reconcilation 过程变得可被中断。适时地让出 CPU 执行权，可以让浏览器及时地响应用户的交互。

#### Fiber 是什么

> Fiber 可以理解为是一个执行单元，也可以理解为是一种数据结构。

##### 执行单元

每次执行完一个执行单元，react 就会检查现在还剩多少时间，如果没有时间则将控制权让出去。React Fiber 与浏览器的核心交互流程如下：

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1627462146139-6c1d8522-bbe0-485a-b87a-4029f794a167.png#align=left&display=inline&height=330&margin=%5Bobject%20Object%5D&originHeight=330&originWidth=1080&size=0&status=done&style=none&width=1080)

流程：

1. React 向浏览器请求调度;
1. 浏览器在一帧中如果还有空闲时间，会去判断是否存在待执行任务，不存在就直接将控制权交给浏览器；
1. 如果存在空闲时间就将控制权交给 React，然后就会执行对应的任务，执行完成后会判断是否还有时间，有时间且有待执行任务则会继续执行下一个任务，否则就会将控制权交给浏览器。

Fiber 可以被理解为划分一个个更小的执行单元，它是把一个大任务拆分为了很多个小块任务，一个小块任务的执行必须是一次完成的，不能出现暂停，但是一个小块任务执行完后可以移交控制权给浏览器去响应用户，从而不用像之前一样要等那个大任务一直执行完成再去响应用户。

##### 数据结构

React Fiber 就是采用**链表**实现的。

每个 Virtual DOM 都可以表示为一个 fiber，每个节点都是一个 fiber。一个 fiber 包括了 child（第一个子节点）、sibling（兄弟节点）、return（父节点）等属性。

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1627462146179-17c002da-44eb-49db-834e-6538c83b80ca.png#align=left&display=inline&height=497&margin=%5Bobject%20Object%5D&originHeight=497&originWidth=1080&size=0&status=done&style=none&width=1080)

**PS：Fiber 是 React 进行重构的核心算法，fiber 是指数据结构中的每一个节点。**

#### API

##### requestAnimationFrame

> 在 Fiber 中使用到了 requestAnimationFrame，它是浏览器提供的绘制动画的 api 。
> 它要求浏览器在下次重绘之前（即下一帧）调用指定的回调函数更新动画。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>flex</title>
    <style>
      #div {
        background: pink;
      }
    </style>
  </head>
  <body>
    <div id="div" class="progress-bar"></div>
    <button id="start">开始动画</button>
  </body>
  <script type="text/javascript">
    let btn = document.getElementById("start");
    let div = document.getElementById("div");
    let start = 0;
    let allInterval = [];

    const progress = () => {
      div.style.width = div.offsetWidth + 1 + "px";
      div.innerHTML = div.offsetWidth + "%";
      if (div.offsetWidth < 100) {
        let current = Date.now();
        allInterval.push(current - start);
        start = current;
        requestAnimationFrame(progress);
      } else {
        console.log(allInterval); // 打印requestAnimationFrame的全部时间间隔
      }
    };

    btn.addEventListener("click", () => {
      div.style.width = 0;
      let currrent = Date.now();
      start = currrent;
      requestAnimationFrame(progress);
      console.log(allInterval);
    });
  </script>
</html>
```

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1627462146153-61c1d0a0-d826-47c2-a84a-eb68fca27788.jpeg#align=left&display=inline&height=118&margin=%5Bobject%20Object%5D&originHeight=118&originWidth=374&size=0&status=done&style=none&width=374)

浏览器会在每一帧中，将 div 的宽度变宽 1px，直到到达 100px 为止。

打印出每一帧的时间间隔如下，大约是 16ms 左右。

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1627462146214-179eed29-e001-4e45-91c4-5aff502b23b4.jpeg#align=left&display=inline&height=316&margin=%5Bobject%20Object%5D&originHeight=316&originWidth=2838&size=0&status=done&style=none&width=2838)

##### requestIdleCallback

MDN：[https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

> `requestIdleCallback`将在浏览器的空闲时段内调用的函数排队，能使开发者在主事件循环上执行后台和低优先级的工作，而不影响延迟关键事件，如动画和输入响应。正常帧任务完成后没超过 16ms，说明有多余的空闲时间，此时就会执行 requestIdleCallback 里注册的任务。

具体的执行流程：

1. 开发者采用`requestIdleCallback`方法注册对应的任务，告诉浏览器我的这个任务优先级不高，如果每一帧内存在空闲时间，就可以执行注册的这个任务；
1. 另外，开发者是可以传入`timeout`参数去定义超时时间的，如果到了超时时间了，浏览器必须立即执行，使用方法：`window.requestIdleCallback(callback, { timeout: 1000 })`。
1. 浏览器执行完这个方法后，如果没有剩余时间了，或者已经没有下一个可执行的任务了，React 应该归还控制权，并同样使用`requestIdleCallback`去申请下一个时间片。

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1627462146170-15c90cf6-ea7f-4141-8329-849e6275155c.png#align=left&display=inline&height=644&margin=%5Bobject%20Object%5D&originHeight=644&originWidth=1080&size=0&status=done&style=none&width=1080)

**PS：强烈建议使用`timeout`选项进行必要的工作，否则可能会在触发回调之前经过几秒钟。**

`requestIdleCallback(callback)` 中的 callback 有两个属性：

> timeRemaining: 还剩余多少闲置时间可以用来执行耗时任务
> didTimeout: 判断当前 callback 任务是否超时

浏览器是如何分配时间执行这些任务：

###### 一帧执行

```javascript
let taskQueue = [
  () => {
    console.log("task1 start");
    console.log("task1 end");
  },
  () => {
    console.log("task2 start");
    console.log("task2 end");
  },
  () => {
    console.log("task3 start");
    console.log("task3 end");
  },
];

const performUnitWork = () => {
  // 取出第一个队列中的第一个任务并执行
  taskQueue.shift()();
};

const workloop = (deadline) => {
  console.log(`此帧的剩余时间为: ${deadline.timeRemaining()}`);
  // 如果此帧剩余时间大于0或者已经到了定义的超时时间（上文定义了timeout时间为1000，到达时间时必须强制执行），且当时存在任务，则直接执行这个任务
  // 如果没有剩余时间，则应该放弃执行任务控制权，把执行权交还给浏览器
  while (
    (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
    taskQueue.length > 0
  ) {
    performUnitWork();
  }

  // 如果还有未完成的任务，继续调用requestIdleCallback申请下一个时间片
  if (taskQueue.length > 0) {
    console.log(
      `只剩${deadline.timeRemaining()},本帧时间已经用完,请等待下次调度`
    );
    // 重新请求调度
    window.requestIdleCallback(workloop, { timeout: 1000 });
  }
};

requestIdleCallback(workloop, { timeout: 1000 });
```

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1627462146151-a05996ea-29ab-41ef-92f5-1e1e0b796ab5.jpeg#align=left&display=inline&height=288&margin=%5Bobject%20Object%5D&originHeight=288&originWidth=530&size=0&status=done&style=none&width=530)

###### 多帧执行

```javascript
const sleep = (delay) => {
  for (let start = Date.now(); Date.now() - start <= delay; ) {}
};

let taskQueue = [
  () => {
    console.log("task1 start");
    sleep(20); // 已经超过一帧的时间（16.6ms），需要把控制权交给浏览器
    console.log("task1 end");
  },
  () => {
    console.log("task2 start");
    sleep(20); // 已经超过一帧的时间（16.6ms），需要把控制权交给浏览器
    console.log("task2 end");
  },
  () => {
    console.log("task3 start");
    sleep(20); // 已经超过一帧的时间（16.6ms），需要把控制权交给浏览器
    console.log("task3 end");
  },
];
```

taskQueue 中的每个任务的执行时间都超过 16.6ms，所有这三个任务分别是在三帧中分别完成的。

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1627462146094-2e6d6169-12d1-4742-8c26-0f681e20af0e.jpeg#align=left&display=inline&height=454&margin=%5Bobject%20Object%5D&originHeight=454&originWidth=706&size=0&status=done&style=none&width=706)

> 浏览器一帧的时间并不严格是 16ms，是可以动态控制的。如果子任务的时间超过了一帧的剩余时间，则会一直卡在这里执行，直到子任务执行完毕。如果代码存在死循环，则浏览器会卡死。如果多个任务执行总时间小于空闲时间的话，是可以在一帧内执行多个任务的。

#### Fiber 链表结构设计

> Fiber 结构是使用链表实现的，`Fiber tree`实际上是个单链表树结构。

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1627462146126-e4ef5a4b-515a-471e-a8ba-6d07fd6c4e35.png#align=left&display=inline&height=256&margin=%5Bobject%20Object%5D&originHeight=256&originWidth=1080&size=0&status=done&style=none&width=1080)

```javascript
class Update {
  constructor(payload, nextUpdate) {
    this.payload = payload; // payload 数据
    this.nextUpdate = nextUpdate; // 指向下一个节点的指针
  }
}
// 定义一个队列，把每个单元串联起来，其中定义了两个指针：头指针firstUpdate和尾指针lastUpdate
// 作用是指向第一个单元和最后一个单元，并加入了baseState属性存储React中的state状态。
class UpdateQueue {
  constructor() {
    this.baseState = null; // state
    this.firstUpdate = null; // 第一个更新
    this.lastUpdate = null; // 最后一个更新
  }
}
```

在队列内定义两个方法：

- 插入节点单元（enqueueUpdate）：需要考虑是否已经存在节点，如果不存在直接将`firstUpdate`、`lastUpdate`指向此节点即可
- 更新队列（forceUpdate）：遍历这个链表，根据`payload`中的内容去更新`state`的值。

```javascript
class UpdateQueue {
  //.....
  enqueueUpdate(update) {
    // 当前链表是空链表
    if (!this.firstUpdate) {
      this.firstUpdate = this.lastUpdate = update;
    } else {
      // 当前链表不为空
      this.lastUpdate.nextUpdate = update;
      this.lastUpdate = update;
    }
  }

  // 获取state，然后遍历这个链表，进行更新
  forceUpdate() {
    let currentState = this.baseState || {};
    let currentUpdate = this.firstUpdate;
    while (currentUpdate) {
      // 判断是函数还是对象，是函数则需要执行，是对象则直接返回
      let nextState =
        typeof currentUpdate.payload === "function"
          ? currentUpdate.payload(currentState)
          : currentUpdate.payload;
      currentState = { ...currentState, ...nextState };
      currentUpdate = currentUpdate.nextUpdate;
    }
    // 更新完成后清空链表
    this.firstUpdate = this.lastUpdate = null;
    this.baseState = currentState;
    return currentState;
  }
}

let queue = new UpdateQueue();
queue.enqueueUpdate(new Update({ name: "www" }));
queue.enqueueUpdate(new Update({ age: 10 }));
queue.enqueueUpdate(new Update((state) => ({ age: state.age + 1 })));
queue.enqueueUpdate(new Update((state) => ({ age: state.age + 1 })));
queue.forceUpdate();
console.log(queue.baseState); // {name: 'www', age: 12}
```

##### 节点设计

> Fiber 的拆分单位是 fiber（`fiber tree`上的一个节点），实际上就是按**虚拟 DOM 节点**拆，需要根据虚拟 dom 去生成 Fiber 树。
> 源码详见`ReactInternalTypes.js`。

###### fiber 节点结构

```javascript
{
    type: any, // 对于类组件，它指向构造函数；对于DOM元素，它指定HTML tag
    key: null | string, // 唯一标识符
    stateNode: any, // 保存对组件的类实例，DOM节点或与fiber节点关联的其他React元素类型的引用
    child: Fiber | null, // 大儿子
    sibling: Fiber | null, // 下一个兄弟
    return: Fiber | null, // 父节点
    tag: WorkTag, // 定义fiber操作的类型, 详见https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactWorkTags.js
    nextEffect: Fiber | null, // 指向下一个节点的指针
    updateQueue: mixed, // 用于状态更新，回调函数，DOM更新的队列
    memoizedState: any, // 用于创建输出的fiber状态
    pendingProps: any, // 已从React元素中的新数据更新，并且需要应用于子组件或DOM元素的props
    memoizedProps: any, // 在前一次渲染期间用于创建输出的props
    // ……
}
```

- `type & key`：与 React 元素的作用相同。type 描述了它对应的组件，对于复合组件，type 是函数或类组件本身。对于原生标签（div，span 等），type 是一个字符串。随着 type 的不同，在 reconciliation 期间使用 key 来确定 fiber 是否可以重新使用。
- `stateNode`： 保存对组件的类实例，DOM 节点或与 fiber 节点关联的其他 React 元素类型的引用。一般来说，可以认为这个属性用于保存与 fiber 相关的本地状态。
- `child` 属性指向此节点的第一个子节点。
- `sibling` 属性指向此节点的下一个兄弟节点（like nextNode）。
- `return` 属性指向此节点的父节点，即当前节点处理完毕后，应该向谁提交自己的成果。如果 fiber 具有多个子 fiber，则每个子 fiber 的 return fiber 是 parent 。
- 其他的属性还有`memoizedState`（创建输出的 fiber 的状态）、`pendingProps`（将要改变的 props ）、`memoizedProps`（上次渲染创建输出的 props ）、`pendingWorkPriority`（定义 fiber 工作优先级）等等。

#### Fiber 执行原理

从根节点开始渲染和调度的过程可以分为两个阶段：

- render 阶段：这个阶段是可中断的，会**找出**所有节点的变更；
- commit 阶段：这个阶段是不可中断的，会**执行**所有的变更；

##### render 阶段

此阶段会找出所有节点的变更，如节点新增、删除、属性变更等，这些变更 react 统称为**副作用（effect）**，此阶段会构建一棵`Fiber tree`，以虚拟 dom 节点为维度对任务进行拆分，即**一个虚拟 dom 节点对应一个任务**，最后产出的结果是`effect list`（从中可以知道哪些节点更新、哪些节点增加、哪些节点删除了）。

> 1. componentWillMount
> 1. componentWillReceiveProps
> 1. static getDerivedStateFromProps
> 1. shouldComponentUpdate
> 1. componentWillUpdate

###### 遍历流程

`React Fiber`首先是将虚拟 DOM 树转化为`Fiber tree`，因此每个节点都有`child`、`sibling`、`return`属性，遍历`Fiber tree`时采用的是**后序遍历方法**：

1. 从顶点开始遍历；
1. 如果有 child，先遍历 child；如果没有 child，则表示遍历完成；
1. child：
   a. 如果有 sibling，则返回 sibling，进入第二步；
   b. 如果没有 sibling，则返回 return，并标志完成父节点遍历，进入第二步；
   d. 如果没有 return，则标志遍历结束；

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1627462146236-da3c6465-5917-444c-b025-99ece064bae0.png#align=left&display=inline&height=718&margin=%5Bobject%20Object%5D&originHeight=718&originWidth=1080&size=0&status=done&style=none&width=1080)

-上图标注了遍历顺序-

遍历规则：

- 先子节点，再弟弟节点，再叔叔节点；
- 完成所有子节点后，当前节点才完成；

用代码表示：

```javascript
const A1 = { type: "div", key: "A1" };
const B1 = { type: "div", key: "B1", return: A1 };
const B2 = { type: "div", key: "B2", return: A1 };
const C1 = { type: "div", key: "C1", return: B1 };
const C2 = { type: "div", key: "C2", return: B1 };
const C3 = { type: "div", key: "C3", return: B2 };
const C4 = { type: "div", key: "C4", return: B2 };

// fiber tree 结构
A1.child = B1;
B1.sibling = B2;
B1.child = C1;
C1.sibling = C2;
B2.child = C3;
C3.sibling = C4;

let rootFiber = A1;

const beginWork = (Fiber) => {
  console.log(`${Fiber.key} start`);
};

const completeUnitWork = (Fiber) => {
  console.log(`${Fiber.key} end`);
};

// 遍历函数
const performUnitOfWork = (Fiber) => {
  beginWork(Fiber);
  if (Fiber.child) {
    return Fiber.child;
  }
  while (Fiber) {
    completeUnitWork(Fiber);
    if (Fiber.sibling) {
      return Fiber.sibling;
    }
    Fiber = Fiber.return;
  }
};

const workloop = (nextUnitOfWork) => {
  // 如果有待执行的执行单元则执行，返回下一个执行单元
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) {
    console.log("reconciliation阶段结束");
  }
};

workloop(rootFiber);
```

结果：

```bash
A1 start
B1 start
C1 start
C1 end
C2 start
C2 end
B1 end
B2 start
C3 start
C3 end
C4 start
C4 end
B2 end
A1 end
reconciliation阶段结束
```

###### 收集 effect list

在遍历过程中，收集所有节点的变更产出`effect list`（**只包含了需要变更的节点**），通过每个节点更新结束时向上归并`effect list`来收集任务结果，最后根节点的`effect list`里就记录了包括了所有需要变更的结果。

1. 如果当前节点需要更新，则打`tag`更新当前节点状态（props, state, context 等）；
1. 为每个子节点创建 fiber。如果没有产生`child fiber`，则结束该节点，把`effect list`归并到`return`，把此节点的`sibling`节点作为下一个遍历节点；否则把`child`节点作为下一个遍历节点；
1. 如果有剩余时间，则开始下一个节点，否则等下一次主线程空闲再开始下一个节点；
1. 如果没有下一个节点了，进入`pendingCommit`状态，此时`effect list`收集完毕，结束；

![](https://cdn.nlark.com/yuque/0/2021/png/250093/1627462146182-408f2482-8353-45d0-ae26-9b0d97b2786f.png#align=left&display=inline&height=597&margin=%5Bobject%20Object%5D&originHeight=597&originWidth=1080&size=0&status=done&style=none&width=1080)

```javascript
const reconcileChildren = (currentFiber, newChildren) => {
  let newChildIndex = 0;
  let prevSibling; // 上一个子fiber

  // 遍历子虚拟DOM元素数组，为每个虚拟DOM元素创建子fiber
  while (newChildIndex < newChildren.length) {
    let newChild = newChildren[newChildIndex];
    let tag;
    // 打tag，定义 fiber类型
    if (newChild.type === ELEMENT_TEXT) {
      // 这是文本节点
      tag = TAG_TEXT;
    } else if (typeof newChild.type === "string") {
      // 如果type是字符串，则是原生DOM节点
      tag = TAG_HOST;
    }
    let newFiber = {
      tag,
      type: newChild.type,
      props: newChild.props,
      stateNode: null, // 还未创建DOM元素
      return: currentFiber, // 父亲fiber
      effectTag: INSERT, // 副作用标识，包括新增、删除、更新
      nextEffect: null, // 指向下一个fiber，effect list通过nextEffect指针进行连接
    };
    if (newFiber) {
      if (newChildIndex === 0) {
        currentFiber.child = newFiber; // child为大儿子
      } else {
        prevSibling.sibling = newFiber; // 让大儿子的sibling指向二儿子
      }
      prevSibling = newFiber;
    }
    newChildIndex++;
  }
};
```

定义一个方法收集此 fiber 节点下所有的`effect`，并组成`effect list`。注意每个 fiber 有两个属性：

- firstEffect：指向第一个有副作用的子 fiber；
- lastEffect：指向最后一个有副作用的子 fiber；

中间的使用`nextEffect`做成一个单链表：

```javascript
// 在完成的时候要收集有副作用的fiber，组成effect list
const completeUnitOfWork = (currentFiber) => {
  // 后续遍历，儿子们完成之后，自己才能完成。最后会得到以上图中的链条结构。
  let returnFiber = currentFiber.return;
  if (returnFiber) {
    // 如果父亲fiber的firstEffect没有值，则将其指向当前fiber的firstEffect
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = currentFiber.firstEffect;
    }
    // 如果当前fiber的lastEffect有值
    if (currentFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
      }
      returnFiber.lastEffect = currentFiber.lastEffect;
    }
    const effectTag = currentFiber.effectTag;
    if (effectTag) {
      // 说明有副作用
      // 中间的使用nextEffect做成一个单链表
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber;
      } else {
        returnFiber.firstEffect = currentFiber;
      }
      returnFiber.lastEffect = currentFiber;
    }
  }
};

// 把该节点和子节点任务都执行完
const performUnitOfWork = (currentFiber) => {
  beginWork(currentFiber);
  if (currentFiber.child) {
    return currentFiber.child;
  }
  while (currentFiber) {
    completeUnitOfWork(currentFiber); // 让自己完成
    if (currentFiber.sibling) {
      // 有弟弟则返回弟弟
      return currentFiber.sibling;
    }
    currentFiber = currentFiber.return; // 没有弟弟，则找到父亲，让父亲完成，父亲会去找他的弟弟即叔叔
  }
};
```

##### commit 阶段

将上阶段计算出来的需要处理的副作用一次性执行，此阶段不能暂停，否则会出现 UI 更新不连续的现象。

此阶段需要根据`effect list`，将所有更新都 commit 到 DOM 树上。

> 1. componentDidMount
> 1. componentDidUpdate
> 1. componentWillUnmount

###### 根据一个 fiber 的 effect list 更新视图

```javascript
const commitWork = (currentFiber) => {
  if (!currentFiber) return;
  let returnFiber = currentFiber.return;
  let returnDOM = returnFiber.stateNode; // 父节点元素
  // 如果当前fiber的effectTag标识位INSERT，则代表其是需要插入的节点
  if (currentFiber.effectTag === INSERT) {
    returnDOM.appendChild(currentFiber.stateNode);
  } else if (currentFiber.effectTag === DELETE) {
    // 如果当前fiber的effectTag标识位DELETE，则代表其是需要删除的节点
    returnDOM.removeChild(currentFiber.stateNode);
  } else if (currentFiber.effectTag === UPDATE) {
    // 如果当前fiber的effectTag标识位UPDATE，则代表其是需要更新的节点
    if (currentFiber.type === ELEMENT_TEXT) {
      if (currentFiber.alternate.props.text !== currentFiber.props.text) {
        currentFiber.stateNode.textContent = currentFiber.props.text;
      }
    }
  }
  currentFiber.effectTag = null;
};
```

###### 根据全部 fiber 的 effect list 更新视图

使用递归函数，从根节点出发，根据`effect list`完成全部更新：

```javascript
const commitRoot = () => {
  let currentFiber = workInProgressRoot.firstEffect;
  while (currentFiber) {
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }
  currentRoot = workInProgressRoot; // 把当前渲染成功的根fiber赋给currentRoot
  workInProgressRoot = null;
};
```

###### 完成视图更新

定义循环执行工作，当计算完成每个 fiber 的`effect list`后，调用 commitRoot 完成视图更新：

```javascript
const workloop = (deadline) => {
  let shouldYield = false; // 是否需要让出控制权
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1; // 如果执行完任务后，剩余时间小于1ms，则需要让出控制权给浏览器
  }
  if (!nextUnitOfWork && workInProgressRoot) {
    console.log("render阶段结束");
    commitRoot(); // 没有下一个任务了，根据effect list结果批量更新视图
  }
  // 请求浏览器进行再次调度
  requestIdleCallback(workloop, { timeout: 1000 });
};
```

#### 还需要去研究的问题

如何定义调度任务优先级、如何进行任务中断与断点恢复等等。

#### React 和 Vue 不同的优化思路

1. Vue 是基于 template 和 watcher 的组件级更新，把每个更新任务分割得足够小，不需要使用到 Fiber 架构，将任务进行更细粒度的拆分；
1. React 是不管在哪里调用 setState，都是从根节点开始更新的，更新任务还是很大，需要使用到 Fiber 将大任务分割为多个小任务，可以中断和恢复，不阻塞主进程执行高优先级的任务；

参考：
[走进 React Fiber 的世界](https://developer.aliyun.com/article/782946)
[从零实现一个简化版 React Fiber](https://juejin.cn/post/6987652377931153421)

拓展阅读：
[React Fiber 架构-司徒正美](https://zhuanlan.zhihu.com/p/37095662)
[React Fiber 是什么](https://zhuanlan.zhihu.com/p/26027085)
[[译]深入 React fiber 架构及源码](https://zhuanlan.zhihu.com/p/57346388)
[Scheduling in React](https://philippspiess.com/scheduling-in-react/)
[Fiber Principles: Contributing To Fiber](https://github.com/facebook/react/issues/7942)
