---
title: ⚫ React Hooks 精进 11 - 创建自定义事件
urlname: f92c3fdaf36c4ac
date: '2023-08-05 16:10:00 +0800'
tags:
  - React
categories:
  - React
cover:
---

props 是组件之间通信的基础。

# 在 React 中使用原生事件

## React 原生事件的原理：合成事件

由于虚拟 DOM 的存在，在 React 中即使绑定一个事件到原生的 DOM 节点，事件也并不是绑定在对应的节点上，而是**所有的事件都是绑定在根节点上**，然后由 React 统一监听和管理，获取事件后分发到具体的虚拟 DOM 节点上。（浏览器事件的冒泡模型，无论事件是在哪个节点被触发，React 都可以通过事件的 srcElement 这个属性知道他从哪个节点发出的）。

## 创建自定义事件

对于自定义组件，组件内的自定义事件也是非常重要的一部分，虽然自定义事件和原生事件看上去相似，但机制完全不一样：

- 原生事件是浏览器的机制
- 自定义事件则是纯粹的组件自己的行为，本质是一种**回调函数机制**

习惯上会将这样的回调函数命名为**onSomething**。

## 使用 Hooks 封装键盘事件

比如在一个表格页面支持左右键进行翻页的功能，那么需要我们在 useEffect 内做 window。addEvent Listener，然后在返回回调函数内 remove。

如果使用 Hook 来实现，就可以在多个组件中使用了。

```typescript
const useKeyPress = (domeNode = document.body) => {
	const [key, setKey] = useState(null);
	useEffect(() => {
		domNode.addEventListener('keypress', handleKeyPress)
		return () => {
			domNode.removeEventListener('keypress', handleKeyPress)
		}
	}, [domNode)
}
```

# 思考题

如何用 Hook 实现监听两个按键同时按下？

同时按下两个按钮会触发两个 keyPress 事件，可以通过数组存储 key，在 keyup 的时候清空数组。
