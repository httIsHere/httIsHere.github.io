---
title: vue source code 1.0
date: 2019-01-22 15:00:23 +0800
tags: 
    - '从入门到放弃'
categories: vue
---

- 前置准备
![](https://upload-images.jianshu.io/upload_images/14447586-b4092d45e1f254ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/798/format/webp)
    - Flow基本语法
    对类型的限制，检测。
    ```
    function sum(a: number, b:number) {
        return a + b;
    }
    ```
    ```
    // vue源码内的一个函数
    export function renderList (
        val: any, // any表示传入的类型可以是任何类型
        render: (
            val: any,
            keyOrIndex: string | number, // 表示需要是字符串或者数字
            index?: number // ?代表index可以不传，但是传的话一定要传入数字类型；
                           // 如果问号是在冒号后面，则这个参数必须要传，但可以是数字类型也可以是空
        ) => VNode
    ): ?Array<VNode>{
        ...
    }
    ```

    - 原型和原型继承
    Vue代码中是使用原型继承的方式实现父子组件共享初始化代码的。
    ```
    function Student(props) {
        this.name = props.name || 'Unnamed';
    }

    Student.prototype.hello = function () {
        alert('Hello, ' + this.name + '!');
    }

    // 基于Student拓展出PrimaryStudent
    function PrimaryStudent(props) {
        // 调用Student构造函数，绑定this变量:
        Student.call(this, props);
        this.grade = props.grade || 1;
    }
    ```
    此时PrimaryStudent并没有继承Student，其原型链还是：
    ```
    new PrimaryStudent() ----> PrimaryStudent.prototype ----> Object.prototype ----> null
    ```
    若是继承则原型链：
    ```
    new PrimaryStudent() ----> PrimaryStudent.prototype ----> Student.prototype ----> Object.prototype ----> null
    ```
    此时需要一个中间对象来实现，将中间对象的原型要指向`Student.prototype`，不能直接`PrimaryStudent.prototype = Student.prototype;`。
    ```
    // 空函数F:
    function F() {}

    // 把F的原型指向Student.prototype:
    F.prototype = Student.prototype;

    // 把PrimaryStudent的原型指向一个新的F对象，F对象的原型正好指向Student.prototype:
    PrimaryStudent.prototype = new F();

    // 把PrimaryStudent原型的构造函数修复为PrimaryStudent:
    PrimaryStudent.prototype.constructor = PrimaryStudent;

    // 在PrimaryStudent原型（就是new F()对象）上定义方法：
    PrimaryStudent.prototype.getGrade = function () {
        return this.grade;
    };

    var Lilei = new PrimaryStudent({
        name: '李雷',
        grade: 2
    });
    // 验证原型:
    Lilei.__proto__ === PrimaryStudent.prototype; // true
    Lilei.__proto__.__proto__ === Student.prototype; // true

    // 验证继承关系:
    Lilei instanceof PrimaryStudent; // true
    Lilei instanceof Student; // true
    ```
    原来的原型链：
    ![](https://cdn.liaoxuefeng.com/cdn/files/attachments/001439872136313496e60e07ed143bda40a0200b12d8cc3000/l)
    新的原型链：
    ![](https://cdn.liaoxuefeng.com/cdn/files/attachments/001439872160923ca15925ec79f4692a98404ddb2ed5503000/l)

    封装这个继承过程：
    ```
    function inherits(Child, Parent) {
        var F = function () {};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
    }
    ```
    最后JavaScript的原型继承实现方式就是：
        定义新的构造函数，并在内部用call()调用希望“继承”的构造函数，并绑定this；
        借助中间函数F实现原型链继承，最好通过封装的inherits函数完成；
        继续在新的构造函数的原型上定义新方法。
    参考（还需要深入研究）：
    [廖雪峰js教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014344997013405abfb7f0e1904a04ba6898a384b1e925000)
    [继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

    - Object.defineProperty
    使用它实现响应式数据功能（数据绑定）。
    ```
    // vue 内定义响应式数据
    export function defineReactive (
        obj: Object,
        key: string,
        val: any,
        customSetter?: ?Function,
        shallow?: boolean
    ) {
        .....
        Object.defineProperty(obj, key, {
            enumerable: true, // 是否可以遍历该key
            configurable: true, // 是否可以删除该key或者重新配置该key
            get: function reactiveGetter () {
                const value = getter ? getter.call(obj) : val
                if (Dep.target) {
                    dep.depend()
                    if (childOb) {
                        childOb.dep.depend()
                        if (Array.isArray(value)) {
                            dependArray(value)
                        }
                    }
                }
                return value
            },
            set: function reactiveSetter (newVal) {
                const value = getter ? getter.call(obj) : val
                /* eslint-disable no-self-compare */
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                }
                /* eslint-enable no-self-compare */
                if (process.env.NODE_ENV !== 'production' && customSetter) {
                    customSetter()
                }
                if (setter) {
                    setter.call(obj, newVal)
                } else {
                    val = newVal
                }
                childOb = !shallow && observe(newVal)
                dep.notify()
            }
        })
    }
    ```
    `Object.defineProperty`这个函数有三个参数，第一个参数即为需要设置的对象，第二个参数为要设置的键值，第三个参数是一个配置对象，里面可以有：
    value: 对应key的值
    configurable：是否可以删除该key或者重新配置该key
    enumerable：是否可以遍历该key
    writable：是否可以修改该key
    get: 获取该key值时调用的函数
    set: 设置该key值时调用的函数

    ```
    let x = {}
    x['name'] = 'vue'
    console.log(Object.getOwnPropertyDescriptor(x,'name'))
    // Object.getOwnPropertyDescriptor可以获取对象某个key的描述对象
    /*
     * {
     *  value: "vue",
     *  writable: true, 
     *  enumerable: true, 
     *  configurable: true
     *  }
    */
    ```
    此时对其进行操作：
    ```
    Object.defineProperty(x, 'name', {
      configurable: false
    })
    // 结果
    delete x["name"]; // false

    Object.defineProperty(x, 0, {
        enumerable: false
    })
    // 不能使用for等循环对x进行遍历
    ```
    在vue的Observer类中有下面一行代码：
    ```
    def(value, '__ob__', this);
    ```
    这里def是个工具函数，目的是想给value添加一个key为__ob__，值为this，程序下面要遍历value对其子内容进行递归设置，如果直接用value.__ob__这种方式，在遍历时又会取到造成，这显然不是本意，所以def函数是利用Object.defineProperty给value添加的属性，同时enumerable设置为false。
    `set`和`get`类似于在获取对象值和设置对象值时加了一个代理。
    ```
    Object.defineProperty(x, 'name', {
        get: function(){
           console.log("getter called!")
        },
        set: function(newVal){
            console.log("setter called! newVal is:" + newVal)
        }
    })
    ```
    所以在访问x['name']时回打印getter called，在设置x['name'] = 'httishere'时会打印setter called! newVal is:httishere，正是通过这种方式实现了访问属性时收集依赖，设置属性时源码有一句dep.notify，里面便是通知视图更新的相关操作。

    - Vnode
    virtual node，虚拟节点，原生dom节点对象非常大，若直接操作dom，性能代价会比较大。
    ```
    // vue 内对vnode的定义
    export default class VNode {
        tag: string | void;
        data: VNodeData | void;
        children: ?Array<VNode>;
        text: string | void;
        elm: Node | void;
        ns: string | void;
        context: Component | void; // rendered in this component's scope
        key: string | number | void;
        componentOptions: VNodeComponentOptions | void;
        componentInstance: Component | void; // component instance
        parent: VNode | void; // component placeholder node

        // strictly internal
        raw: boolean; // contains raw HTML? (server only)
        isStatic: boolean; // hoisted static node
        isRootInsert: boolean; // necessary for enter transition check
        isComment: boolean; // empty comment placeholder?
        isCloned: boolean; // is a cloned node?
        isOnce: boolean; // is a v-once node?
        asyncFactory: Function | void; // async component factory function
        asyncMeta: Object | void;
        isAsyncPlaceholder: boolean;
        ssrContext: Object | void;
        fnContext: Component | void; // real context vm for functional nodes
        fnOptions: ?ComponentOptions; // for SSR caching
        fnScopeId: ?string;
        ....
    }
    ```
    发生修改时，从全局看问题的方式就是异步，先把修改放到队列中，然后整成一批去修改，做diff：
    ```
    queueWatcher(this);
    ```

    - 函数柯里化
    将多参数的函数化作多个部分函数去调用。
    ```
    // 例子 一个需要两个参数的函数
    function getSum(a,b){
        return a+b;
    }
    // 有时候可能参数的获得是异步的，其他参数会在另一个时间点再传入
    function getSum(a){
        return function(b){
            return a+b;
        }
    }
    let f = getSum(2)
    console.log(f(3))
    console.log(getSum(2)(3)) // 5
    ```
    这样参数就可以在不同的时间点传入，Vue源码中有一个platform目录，专门存放和平台相关的源码，对函数进行柯里化就可以不用每次运行就进行平台判断。
    ```
    function ...(平台相关参数){
        return function(平台不相关参数){
          处理逻辑
        }
    }
    ```
    在Vue的patch以及编译环节都应用了这种方式。

    - Macrotask与Microtask
    与js的事件循环机制息息相关，Vue更新不是数据一改马上同步更新视图，而是将更改都放入到队列中，同一个watcher不会重复，然后异步处理更新逻辑。在实现异步的方式时，js实际提供了两种task--Macrotask与Microtask。
    ```
    console.log('script start');
    setTimeout(function() {
        console.log('setTimeout');
        Promise.resolve().then(function() {
            console.log('promise3');
        }).then(function() {
            console.log('promise4');
        });
    }, 0);
    Promise.resolve().then(function() {
        console.log('promise1');
    }).then(function() {
        console.log('promise2');
    });
    console.log('script end');
    // 结果
    script start
    script end
    promise1
    promise2
    setTimeout
    promise3
    promise4
    ```
    js事件循环中有两个队列，一个叫MacroTask，一个MircroTask，大任务队列（MacroTask）跑大任务，比如主流程程序、事件处理函数、setTimeout等等，小任务队列（MircroTask）跑小任务，比如Promise，js总是先从大任务队列拿一个执行，然后再把所有小任务队列全部执行再循环往复。
    上述代码整体的代码段就是一个大任务在执行，执行完毕再执行同级所有小任务，执行完之后再取一个大任务执行，此时就是取setTimeout，之后再是这里面的小任务。
    重点是**上面程序本身也是一个大任务**，
    [Macrotask Vs Microtask](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
    [理解js中Macrotask和Microtask](https://juejin.im/entry/58d4df3b5c497d0057eb99ff)
    [阮一峰 Eventloop理解](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

    - 递归编程算法
    Vue源码中大量使用了递归算法--比如dom diff算法、ast的优化、目标代码的生成等等。
    ```
    // 经典dom diff算法
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    ```
    主要是用于比较新旧Vnode节点然后更新子节点，调用者是patchVnode函数，我们发现这部分函数中又会调用会patchVnode，调用链条为:patchVnode->updateChildren->patchVnode。同时，即便没有直接应用递归，在将模板编译成AST（抽象语法树）的过程中，其使用了栈去模拟了递归的思想，由此可见递归算法的重要性。不管是真实dom还是vnode，其实本质都是树状结构，本来就是递归定义的东西。

    - 编译原理基础知识
    ```
    // vue内
    const ast = parse(template.trim(), options)
    if (options.optimize !== false) {
        optimize(ast, options)
    }
    const code = generate(ast, options)
    return {
        ast,
        render: code.render,
        staticRenderFns: code.staticRenderFns
    }
    ```
    首先通过parse函数将template编译为抽象语法树ast，然后对ast进行代码优化，最后生成render函数。就是将模板html编译为render函数。
    AST（抽象语法树），就是一种表现大家共同点的结构，得到ast是翻译的基础。

参考文章：[Vue源码解析准备篇 from 海洋之木](https://www.jianshu.com/p/c914ccd498e7)