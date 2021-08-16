---
title: 「Vue」Vue.observable有了解过吗？
urlname: acm43c
date: 2021-08-11 10:52:04 +0800
tags: [Vue]
categories: [vue]
---

### [Vue.observable( object )](https://cn.vuejs.org/v2/api/#Vue-observable)

> 让一个对象可响应。Vue 内部会用它来处理 `data` 函数返回的对象。
> 返回的对象可以直接用于[渲染函数](https://cn.vuejs.org/v2/guide/render-function.html)和[计算属性](https://cn.vuejs.org/v2/guide/computed.html)内，并且会在发生变更时触发相应的更新。

应用场景：在非父子组件通信时，可以使用通常的`bus`或者使用`vuex`，但是在小型项目内为避免代码繁琐冗余一般不使用 Vux 进行状态管理，而是 Vue 2.6 新增加的`Observable API` ，通过使用这个 api 可以应对一些简单的跨组件数据状态共享的情况。

```javascript
const state = Vue.observable({ count: 0 });

const Demo = {
  render(h) {
    return h(
      "button",
      {
        on: {
          click: () => {
            state.count++;
          },
        },
      },
      `count is: ${state.count}`
    );
  },
};
```

> 在 Vue 2.x 中，被传入的对象`{ count: 0 }`会直接被 `Vue.observable` 变更，它和被返回的对象是同一个对象。在 Vue 3.x 中，则会返回一个可响应的代理，而对源对象直接进行变更仍然是不可响应的。因此，为了向前兼容，我们推荐始终操作使用 `Vue.observable` 返回的对象，而不是传入源对象。

创建一个 store.js：

```javascript
//store.js
import Vue from "vue";

// 分别用来指向数据和处理方法
export let store = Vue.observable({ count: 0, name: "htt" });
export let mutations = {
  setCount(count) {
    store.count = count;
  },
  changeName(name) {
    store.name = name;
  },
};
```

在需要使用的组件内直接使用：

```javascript
import { store, mutations } from "@/store";
export default {
  data() {
    return {};
  },
  computed: {
    count() {
      return store.count;
    },
    name() {
      return store.name;
    },
  },
  methods: {
    setCount: mutations.setCount,
    changeName: mutations.changeName,
  },
};
```

**简单来说就是将一个数据对象变成可响应的数据。**

参考：[https://cn.vuejs.org/v2/api/#Vue-observable](https://cn.vuejs.org/v2/api/#Vue-observable)
