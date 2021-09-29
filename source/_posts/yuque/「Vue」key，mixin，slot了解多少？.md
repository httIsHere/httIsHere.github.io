---
title: 「Vue」key，mixin，slot了解多少？
urlname: pphxpr
date: 2021-08-11 11:29:37 +0800
tags: [Vue]
categories: [vue]
---

> 参考：[https://vue3js.cn/interview/vue/vue.html](https://vue3js.cn/interview/vue/vue.html)

### Key

#### 什么是 key

一般的使用场景：

- 搭配`v-for`指令，给每个单元加上 key；

```html
<ul>
  <li v-for="item in items" :key="item.id"></li>
</ul>
```

- 给自定义的组件添加动态 key，手动强制触发重新渲染；

```html
<Comp :key="+new Date()" />
```

> key 主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 key 时，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。

简而言之：

> key 是给每一个 vnode 的唯一 id，也是 diff 的一种优化策略，可以根据 key，更准确， 更快的找到对应的 vnode 节点。

##### 场景背后的逻辑

当我们在使用 v-for 时，需要给单元加上 key：

- 如果不用 key，Vue 会采用就地复地原则：最小化 element 的移动，并且会尝试尽最大程度在同适当的地方对相同类型的 element，做 patch 或者 reuse。
- 如果使用了 key，Vue 会根据 keys 的顺序记录 element，曾经拥有了 key 的 element 如果不再出现的话，会被直接 remove 或者 destoryed。

用+new Date()生成的时间戳作为 key，手动强制触发重新渲染：

- 当拥有新值的 rerender 作为 key 时，拥有了新 key 的 Comp 出现了，那么旧 key Comp 会被移除，新 key Comp 触发渲染。

#### 设置 key 与不设置 key 区别

2 秒后往`items`数组插入数据，实例如下：

```html
<body>
  <div id="demo">
    <p v-for="item in items" :key="item">{{item}}</p>
  </div>
  <script src="../../dist/vue.js"></script>
  <script>
    // 创建实例
    const app = new Vue({
      el: "#demo",
      data: { items: ["a", "b", "c", "d", "e"] },
      mounted() {
        setTimeout(() => {
          this.items.splice(2, 0, "f"); //
        }, 2000);
      },
    });
  </script>
</body>
```

- 在不使用`key`的情况，`vue`会进行这样的操作：
  - 比较 A，A，相同类型的节点，进行`patch`，但数据相同，不发生`dom`操作
  - 比较 B，B，相同类型的节点，进行`patch`，但数据相同，不发生`dom`操作
  - 比较 C，F，相同类型的节点，进行`patch`，数据不同，发生`dom`操作
  - 比较 D，C，相同类型的节点，进行`patch`，数据不同，发生`dom`操作
  - 比较 E，D，相同类型的节点，进行`patch`，数据不同，发生`dom`操作
  - 循环结束，将 E 插入到`DOM`中

所以一共发生了 3 次更新和 1 次插入操作。

- 在使用`key`的情况：`vue`会进行这样的操作：
  - 比较 A，A，相同类型的节点，进行`patch`，但数据相同，不发生`dom`操作
  - 比较 B，B，相同类型的节点，进行`patch`，但数据相同，不发生`dom`操作
  - 比较 C，F，不相同类型的节点
    - 比较 E、E，相同类型的节点，进行`patch`，但数据相同，不发生`dom`操作
  - 比较 D、D，相同类型的节点，进行`patch`，但数据相同，不发生`dom`操作
  - 比较 C、C，相同类型的节点，进行`patch`，但数据相同，不发生`dom`操作
  - 循环结束，将 F 插入到 C 之前
    所以一共发生了 0 次更新，1 次插入操作。

> 当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“**就地复用**”策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。

这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出。

#### 原理分析

源码位置：core/vdom/patch.js

```javascript
function sameVnode(a, b) {
  return (
    // 判断是否为同一个key
    a.key === b.key &&
    ((a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data) &&
      sameInputType(a, b)) ||
      (isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)))
  );
}
```

`updateChildren`方法中会对新旧`vnode`进行`diff`，然后将比对出的结果用来更新真实的`DOM`。

```javascript
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    ...
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
            ...
        } else if (isUndef(oldEndVnode)) {
            ...
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            ...
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            ...
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            ...
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            ...
        } else {
            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            idxInOld = isDef(newStartVnode.key)
                ? oldKeyToIdx[newStartVnode.key]
                : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
            if (isUndef(idxInOld)) { // New element
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
            } else {
                vnodeToMove = oldCh[idxInOld]
                if (sameVnode(vnodeToMove, newStartVnode)) {
                    patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
                    oldCh[idxInOld] = undefined
                    canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
                } else {
                    // same key but different element. treat as new element
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
                }
            }
            newStartVnode = newCh[++newStartIdx]
        }
    }
    ...
}
```

### Mixin

> 面向对象程序设计语言中的类，提供了方法的实现。其他类可以访问`mixin`类的方法而不必成为其子类。

提供了一种非常灵活的方式，来分发 `Vue` 组件中的可复用功能，包括`data`、`components`、`methods`、`created`、`computed`等等。

#### 局部混入

在组件内使用，当前组件可直接访问 mixin 内的数据和方法。

```javascript
Vue.component("componentA", {
  mixins: [myMixin],
});
```

#### 全局混入

通过`Vue.mixin()`进行全局的混入，⚠️ 一旦使用全局混入，它将影响**每一个**之后创建的 Vue 实例。

```javascript
Vue.mixin({
  created: function () {
    console.log("全局混入");
  },
});
```

#### 注意

- 当组件存在与`mixin`对象相同的选项的时候，进行递归合并的时候组件的选项会覆盖`mixin`的选项；
- 如果相同选项为生命周期钩子的时候，会合并成一个数组，先执行 mixin 的钩子，再执行组件的钩子；

#### 应用场景

- 替换型策略有`props`、`methods`、`inject`、`computed`，就是将新的同名参数替代旧的参数；
- 合并型策略是`data`, 通过`set`方法进行合并和重新赋值；
- 队列型策略有生命周期函数和`watch`，原理是将函数存入一个数组，然后正序遍历依次执行；
- 叠加型有`component`、`directives`、`filters`，通过原型链进行层层的叠加；

### slot

> 在 HTML 中 `slot` 元素 ，作为 `Web Components` 技术套件的一部分，是 Web 组件内的一个占位符，该占位符可以在后期使用自己的标记语言填充。

```html
<template id="element-details-template">
  <slot name="element-name">Slot template</slot>
</template>
<element-details>
  <span slot="element-name">1</span>
</element-details>
<element-details>
  <span slot="element-name">2</span>
</element-details>
```

```javascript
customElements.define(
  "element-details",
  class extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById("element-details-template")
        .content;
      const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
        template.cloneNode(true)
      );
    }
  }
);
```

`template`不会展示到页面中，需要用先获取它的引用，然后添加到`DOM`中，

#### 分类

- 默认插槽
- 具名插槽
- 作用域插槽

##### 默认插槽

子组件用标签来确定渲染的位置，标签里面可以放 DOM 结构，当父组件使用的时候没有往插槽传入内容，标签内 DOM 结构就会显示在页面，父组件在使用的时候，直接在子组件的标签内写入内容即可。

```html
<!-- child component -->
<template>
  <slot>
    <p>插槽后备的内容</p>
  </slot>
</template>
<!-- parent component -->
<Child>
  <div>默认插槽</div>
</Child>
```

##### 具名插槽

组件用`name`属性来表示插槽的名字，不传为默认插槽，父组件中在使用时在默认插槽的基础上加上`slot`属性，值为子组件插槽`name`属性值。

```html
<!-- child component -->
<template>
  <slot>插槽后备的内容</slot>
  <slot name="content">插槽后备的内容</slot>
</template>
<!-- parent component -->
<Child>
  <template v-slot:default>具名插槽</template>
  <!-- 具名插槽⽤插槽名做参数 -->
  <template v-slot:content>内容...</template>
</Child>
```

##### 作用域插槽

子组件在作用域上绑定属性来将子组件的信息传给父组件使用，这些属性会被挂在父组件`v-slot`接受的对象上，父组件中在使用时通过`v-slot:`（简写：#）获取子组件的信息，在内容中使用。

```html
<!-- child component -->
<template>
  <slot name="footer" testProps="子组件的值">
    <h3>没传footer插槽</h3>
  </slot>
</template>
<!-- parent component -->
<Child>
  <!-- 把v-slot的值指定为作⽤域上下⽂对象 -->
  <template v-slot:default="slotProps">
    来⾃⼦组件数据：{{slotProps.testProps}}
  </template>
  <template #default="slotProps">
    来⾃⼦组件数据：{{slotProps.testProps}}
  </template>
</Child>
```

#### ⚠️ 注意

- `v-slot`属性只能在`<template>`上使用，但在只有默认插槽时可以在组件标签上使用；
- 默认插槽名为`default`，可以省略 default 直接写`v-slot`；
- 缩写为`#`时不能不写参数，写成`#default`；
- 可以通过解构获取`v-slot={user}`，还可以重命名`v-slot="{user: newName}"`和定义默认值`v-slot="{user = '默认值'}"；

#### 原理分析

`slot`本质上是返回`VNode`的函数，一般情况下，`Vue`中的组件要渲染到页面上需要经过`template -> render function -> VNode -> DOM` 过程。

组件：

```javascript
Vue.component("button-counter", {
  template: "<div> <slot>我是默认内容</slot></div>",
});
// use component
new Vue({
  el: "#app",
  template: "<button-counter><span>我是slot传入内容</span></button-counter>",
  components: { buttonCounter },
});
```

组件的渲染函数：

```javascript
(function anonymous() {
  with (this) {
    return _c("div", [_t("default", [_v("我是默认内容")])], 2);
  }
});
```

其中`_v`表示穿件普通文本节点，`_t`表示渲染插槽的函数。

渲染插槽函数`renderSlot`（简化版）：

```javascript
function renderSlot(name, fallback, props, bindObject) {
  // 得到渲染插槽内容的函数
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  // 如果存在插槽渲染函数，则执行插槽渲染函数，生成nodes节点返回
  // 否则使用默认值
  nodes = scopedSlotFn(props) || fallback;
  return nodes;
}
```

`name`属性表示定义插槽的名字，默认值为`default`，`fallback`表示子组件中的`slot`节点的默认值。

关于`this.$scopredSlots`是什么，可以先看看`vm.slots`：

> 用来访问被[插槽分发](https://cn.vuejs.org/v2/guide/components.html#%E9%80%9A%E8%BF%87%E6%8F%92%E6%A7%BD%E5%88%86%E5%8F%91%E5%86%85%E5%AE%B9)的内容。在使用[渲染函数](https://cn.vuejs.org/v2/guide/render-function.html)书写一个组件时，访问 `vm.$slots` 最有帮助。

```javascript
// 实际应用中
Vue.component("blog-post", {
  render: function (createElement) {
    var header = this.$slots.header;
    var body = this.$slots.default;
    var footer = this.$slots.footer;
    return createElement("div", [
      createElement("header", header),
      createElement("main", body),
      createElement("footer", footer),
    ]);
  },
});
```

```javascript
function initRender (vm) {
  ...
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  ...
}
```

`resolveSlots`函数会对 children 节点做归类和过滤处理，返回`slots`。

```javascript
function resolveSlots(children, context) {
  if (!children || !children.length) {
    return {};
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if (
      (child.context === context || child.fnContext === context) &&
      data &&
      data.slot != null
    ) {
      // 如果slot存在(slot="header") 则拿对应的值作为key
      var name = data.slot;
      var slot = slots[name] || (slots[name] = []);
      // 如果是tempalte元素 则把template的children添加进数组中，这也就是为什么你写的template标签并不会渲染成另一个标签到页面
      if (child.tag === "template") {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // 如果没有就默认是default
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots;
}
```

`_render`渲染函数通过`normalizeScopedSlots`得到`vm.$scopedSlots`。

> `vm.$scopedSlots`用来访问[作用域插槽](https://cn.vuejs.org/v2/guide/components-slots.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%E6%8F%92%E6%A7%BD)。对于包括 `默认 slot` 在内的每一个插槽，该对象都包含一个返回相应 VNode 的函数。
> 所有的 `$slots` 现在都会作为函数暴露在 `$scopedSlots` 中。如果你在使用渲染函数，不论当前插槽是否带有作用域，我们都推荐始终通过 `$scopedSlots` 访问它们。

作用域插槽中父组件能够得到子组件的值是因为在 renderSlot 的时候执行会传入 props，也就是上述\_t 第三个参数，父组件则能够得到子组件传递过来的值。
