---
title: vue source code 2.0
date: 2019-01-23 10:30:23 +0800
tags: 
    - '从入门到放弃'
categories: vue
---

## Vue options
核心代码->core/index，暴露一个Vue类（core/instance/index），在该文件内发现初始定义了一个Vue：
```
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```
其中传入的参数options，即我妈实例化Vue对象时传入的：
```
{
    el: '#data',
    data: {
        ...
    },
    methods: {
        ...
    }
}
```
再定义完这个Vue类之后执行了5个方法：

- initMixin(Vue)
主要为Vue原型定义了`_init`方法，再实例化过程中会执行`_init`方法，其中先对options进行了判断，若非组件则会进入`mergeOptions`方法，该方法是将`resolveConstructorOptions(vm.constructor)`和`options`合在一起。
那`resolveConstructorOptions`时干嘛的呢，`Ctor.super`可想而知是上级，所以主要是来判断该类是否为Vue的子类，进而判断父类中的options有没有发生变化，当Vue混入一些options时`superOptions`会发生变化，之后就会更新子类的`superOptions`，Vue混入options的情况：
```
Vue.extend(options)
Vue.mixin(options)
```
在`mergeOptions`根据不同的key采用不同的merge策略，ue提供了一个strats对象，其本身就是一个hook，如果strats有提供特殊的逻辑，就走strats，否则走默认merge逻辑，能很好的区分对待公共处理逻辑与特殊处理逻辑。
`initMixin`就是把业务逻辑以及组件的一些特性全都放到了vm.$options中了，后续的操作我们都可以从vm.$options拿到可用的信息，后续动态添加任何东西都可以规范的收入到`vm.$options`内。
后续的执行：
```
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm)
    initState(vm)
    initProvide(vm)
    callHook(vm, 'created')
```
需要先了解响应式数据原理（订阅-发布模式）：
![](https://camo.githubusercontent.com/f60a57d4d89744f5947ca53c6ce80d3105171185/687474703a2f2f696d672e736f756368652e636f6d2f6632652f38613963383033353763623834626161653532383564653437663461656165622e706e67)

#### Observer
```
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```
当实例化Observer对象时，会执行`walk`这个方法, 主要是遍历obj属性, 然后通过`Object.defineProperty`来定义响应式数据。
defineReactive: 
```
export function defineReactive (
 obj: Object,
 key: string,
 val: any,
 customSetter?: ?Function,
 shallow?: boolean
) {
  const dep = new Dep() // 订阅器
  ...
  Object.defineProperty(obj, key, {
      ...
      get: function reactiveGetter () {
        ...
        dep.depend()
        ...
        return value
      },
      set: function reactiveSetter (newVal) {
        ...
        dep.notify()
      }
    })
}
```
主要是做了Dep的两个操作: 
```
dep.depend()
dep.notify()
```
Dom上通过指令或者双大括号绑定的数据, 会添加观察者`watcher`, 当实例化Watcher的时候 会触发属性的getter方法，此时会调用dep.depend()。
```
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
```
在进行Watcher实例化时会调用内部get函数, 为其初始化:
```
get () {
  pushTarget(this) // 就是为Dep.target绑定此watcher实例
  ...
}
```
当更新data的时候, 会触发set方法, 执行dep.notify()函数:
```
notify () {
  // stabilize the subscriber list first
  const subs = this.subs.slice()
  for (let i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}
```
就是遍历dep中收集到的watcher实例，进行update()。也就是进行数据更新操作。这也就是简单的数据响应式。
其实还需要注意的是： 当数据的getter触发后，会收集依赖，但也不是所有的触发方式都会收集依赖，只有通过watcher触发的getter会收集依赖：`if (Dep.target) { dep.depend() }`，而所谓的被收集的依赖就是当前watcher，DOM中的数据必须通过watcher来绑定，只通过watcher来读取。

#### initLifecycle
```
export function initLifecycle (vm: Component) {
  const options = vm.$options
  /**
   * 这里判断是否存在父示例，如果存在，则通过 while 循环，建立所有组建的父子关系
   */
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }
  /**
   * 为组件实例挂载相应属性，并初始化
   */
  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```

#### initEvents
```
export function initEvents (vm: Component) {
  /**
   * 创建事件对象，用于存储事件
   */
  vm._events = Object.create(null)
  /**
   * 这里应该是系统事件标识位
   */
  vm._hasHookEvent = false
  // init parent attached events
  // _parentListeners其实是父组件模板中写的v-on
  // 所以下面这段就是将父组件模板中注册的事件放到当前组件实例的listeners里面
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```

#### initRender
主要是为组件实例，初始化一些渲染属性，比如$slots和$createElement等。
```
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context

  // 处理组件slot，返回slot插槽对象

  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject

  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)

  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)


  /**
   * 定义v2.4中新增的$attrs及$listeners属性，需要为其绑定响应式数据更新
   */
   
  const parentData = parentVnode && parentVnode.data

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}
```

#### callHook
调用钩子函数的方法，即触发之前options中定义的相应的生命周期函数。
进行到此处便开始调用了beforeCreate钩子函数。
```
export function callHook (vm: Component, hook: string) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
}
```

#### initInjections 和 initProvide
```
export function initInjections (vm: Component) {
  // 因为并没有vm._provided此时result 返回的是个 null，也就没有进行defineReactive
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    observerState.shouldConvert = false
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    observerState.shouldConvert = true
  }
}
export function initProvide (vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}
```

#### initState
主要是定义的数据进行defineReactive。