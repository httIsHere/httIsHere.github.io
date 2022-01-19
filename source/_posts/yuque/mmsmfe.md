---
title: 「JS」数据结构
urlname: mmsmfe
date: '2020-09-27 14:22:14 +0800'
tags:
  - js
categories:
  - JavaScript
---

- 栈（Stack）
- 堆（Heap）
- 队列（Queue）
- 链表（Linked）
- 数组（Array）
- 树（Tree）
- 集合（Set）
- 哈希表（Map）

js 内变量类型：

- 基础类型（Undefined, Null, Boolean, Number, String, Symbol）
- 引用类型（Object）

### 栈：先进后出，后进先出（LIFO）

数组的`push`和`pop`方法就是应用了栈的存取方式。

#### 变量应用：基础类型的值保存在栈中，这些类型的值有固定大小，**"按值来访问"**；

#### 应用：四则远算表达式处理

给出一个四则远算表达式，计算结果，参考：[堆栈实现四则运算](https://blog.csdn.net/u011268787/article/details/78878991)。
如："19+(3-1)*3+10/2-(2+30)*2"

机器不会知道相对的优先级，所以需要我们自己去转化优先级方案，我们的`19+(3-1)*3+10/2-(2+30)*2`自然表达式是一个中缀表达式，需要将其转换为后缀表达式，便于优先级的计算。
![截屏2020-09-29 上午11.11.36.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1601349113526-ceb91087-5a79-4d5a-8de4-e830dc6f4b3a.png#height=1052&id=o62A8&margin=%5Bobject%20Object%5D&name=%E6%88%AA%E5%B1%8F2020-09-29%20%E4%B8%8A%E5%8D%8811.11.36.png&originHeight=1052&originWidth=944&originalType=binary∶=1&size=162902&status=done&style=none&width=944)

```javascript
class Stack {
  constructor() {
    this._i = Symbol("Stack"); // 唯一标识，防止直接操作当前对象，只能通过开放方法操作
    this[this._i] = {};
    this.length = 0;
  }
  push(node) {
    this[this._i][this.length] = node;
    this.length++;
  }
  pop() {
    if (this.isEmpty()) return null;
    this.length--;
    const _last = this[this._i][this.length];
    delete this[this._i][this.length]; // 释放内存
    return _last;
  }
  getItems() {
    return this[this._i];
  }
  peek() {
    // 栈顶节点
    if (this.isEmpty()) return null;
    return this[this._i][this.length - 1];
  }
  isEmpty() {
    return this.length === 0;
  }
  clear() {
    this[this._i] = {};
    this.length = 0;
  }
}
```

先将表达式转成后序表达式：

```javascript
// ^ 中缀表达式转后缀表达式
function matchInBrackets(s) {
  let f_stack = new Stack();
  let result = [];
  let _num = ""; // 存储当前数字
  let f_array = ["+", "-", "*", "/", "(", ")"];
  for (let i = 0; i < s.length; i++) {
    if (!isNaN(parseInt(s[i]))) {
      // 当前元素是数字
      _num += s[i];
      if (i === s.length - 1) {
        _num && result.push(parseInt(_num)); // 记录当前数字
      }
    } else {
      _num && result.push(parseInt(_num)); // 记录当前数字
      _num = "";
      let _peek = f_stack.peek(); // 栈顶元素
      if (_peek) {
        if (s[i] === ")") {
          let _p = f_stack.peek();
          // pop 出"()"内所有的元素
          while (_p && _p !== "(") {
            result.push(f_stack.pop());
            _p = f_stack.peek();
          }
          if (f_stack.peek() === "(") f_stack.pop();
        } else if (s[i] === "(" || compareSymbols(s[i], _peek) >= 0) {
          f_stack.push(s[i]);
        } else if (compareSymbols(s[i], _peek) < 0) {
          let _p = null;
          // pop出栈内比当前优先级低的
          do {
            _p = f_stack.pop();
            result.push(_p);
          } while (compareSymbols(s[i], _p) <= 0 && !f_stack.isEmpty());
          f_stack.push(s[i]);
        }
      } else {
        f_stack.push(s[i]);
      }
    }
  }
  while (!f_stack.isEmpty()) {
    result.push(f_stack.pop());
  }
  return result;
}

// ^ 比较算数符号的优先级
function compareSymbols(a, b) {
  let _arr = ["(", ")", "", "+", "-", "", "*", "/"];
  let _i = _arr.indexOf(a);
  let _j = _arr.indexOf(b);
  // ! 1: 优先级高，0: 同等优先级，-1: 优先级低
  return _i - _j >= 2 ? 1 : _i - _j === 1 ? 0 : -1;
}

// ^ 两个数字的四则运算
function numCalculate(a, b, f) {
  switch (f) {
    case "+":
      return a + b;
    case "-":
      return b - a;
    case "*":
      return a * b;
    case "/":
      return b / a;
    default:
      return null;
  }
}
```

计算结果：

```javascript
function calculateS(s) {
  s.replace(/\s/g, "");
  let expression = matchInBrackets(s);
  // [19,  3,   1, '-', 3, '*', '+', 10,  2, '/', '+', 2, 30,  '+', 2, '*', '-']
  let r_stack = new Stack();
  let result = null;
  for (let i in expression) {
    if (!isNaN(expression[i])) {
      r_stack.push(expression[i]);
    } else {
      let a = r_stack.pop();
      let b = r_stack.pop();
      let _r = numCalculate(a, b, expression[i]);
      r_stack.push(_r);
    }
  }
  result = r_stack.peek();
  delete r_stack;
  return result;
}
```

#### 实践：执行上下文和执行栈

---参考：[前端进击的巨人（一）：执行上下文与执行栈，变量对象](https://segmentfault.com/a/1190000017890535)
js 执行到一个环境时，就会为该环境创建一个执行上下文，只要作用是确定当前环境的一个执行顺序，并做一些准备工作（确定作用域，创建局部变量）等。

1. 执行上下文（包括全局执行上下文、函数执行上下文、eval 执行上下文）

生命周期：

- 创建（创建执行上下文，函数被调用时，进入函数环境，为其创建一个执行上下文）
  1. 创建变量对象（函数环境会初始化创建`Arguments`对象并赋值，函数声明并赋值，变量声明和函数表达式声明不赋值）
  1. 确定`this`指向
  1. 确定作用域
- 执行（执行代码，执行函数内代码）
  4. 变量对象赋值（变量赋值，函数表达式赋值）
  5. 调用函数
  6. 顺序执行其他代码

2. 执行栈（函数调用栈）

程序执行进入一个执行环境时，它的执行上下文就会被创建，并被推入执行栈中(入栈)；
程序执行完成时，它的执行上下文就会被销毁，并从栈顶被推出(出栈)，控制权交由下一个执行上下文。
因为 JS 执行中最先进入全局环境，所以处于**"栈底的永远是全局环境的执行上下文"**。而处于**"栈顶的是当前正在执行函数的执行上下文"**，当函数调用完成              后，它就会从栈顶被推出（理想的情况下，闭包会阻止该操作，闭包后续文章深入详解）。
**"全局环境只有一个，对应的全局执行上下文也只有一个，只有当页面被关闭之后它才会从执行栈中被推出，否则一直存在于栈底"。**

> JavaScript 中函数的执行过程，其实就是一个入栈出栈的过程:
>
> 1. 当脚本要调用一个函数时，JS 解析器把该函数推入栈中（push）并执行；
> 1. 当函数运行结束后，JS 解析器将它从堆栈中推出（pop）；

**​**

**变量对象和活动对象**
当进入到一个执行上下文后，这个变量对象才会被激活，所以叫活动对象(AO)，这时候活动对象上的各种属性才能被访问。
**"创建阶段对函数声明做赋值，变量及函数表达式仅做声明，真正的赋值操作要等到执行上下文代码执行阶段"**。

- 变量提升

```javascript
function foo() {
  console.log(a); // 输出undefined
  var a = "I am here"; // 赋值
}
foo();
```

- 函数声明优先级

````javascript
function foo() {
    console.log(bar);
    var bar = 20;
    function bar() {
      return 10;
    }
    var bar = function() {
        return 30;
    }
}
foo();  // 输出bar的函数声明
// ƒ bar() {
      return 10;
    }
```</div>warning
**函数声明，变量声明，函数表达式的优先级**

- 函数声明，如果有同名属性，会替换掉
- 变量，函数表达式
- 函数声明优先 > 变量，函数表达式

**函数声明和变量声明在准备阶段都会被声明，但函数声明会被优先赋值，变量声明赋值在执行阶段。**</div>
**​**

**总结：**

1. JavaScript是单线程；
1. 栈顶的执行上下文处于执行中，其它需要排队；
1. 全局上下文只有一个处于栈底，页面关闭时出栈；
1. 函数执行上下文可存在多个，但应避免递归时堆栈溢出；
1. 函数调用时就会创建新的上下文，即使调用自身，也会创建不同的执行上下文；




### 堆：只需要属性名即可取数据，与数据存储顺序无关，且不限制出入口
> 为了便于存储和索引，在应用时常常使用二叉堆「优先级队列」解决问题，决定哪个事件先执行。-- 参考：[内存与数据结构](https://www.yuque.com/coreadvance/kagkke/lpabps#10F9H)




#### 变量应用：引用类型的值保存在堆中，栈中存储的是引用类型的引用地址（地址指针），**"按引用访问"**，引用类型的值没有固定大小，可扩展（一个对象我们可以添加多个属性）。
![](https://cdn.nlark.com/yuque/0/2020/png/250093/1602295756238-02579881-d6c4-47e2-acf5-419d745b59e4.png#height=413&id=JCGXl&margin=%5Bobject%20Object%5D&name=&originHeight=413&originWidth=560&originalType=binary∶=1&size=0&status=done&style=none&width=560)

- **浅拷贝：栈存储拷贝**
- **深拷贝：栈堆存储拷贝"**

**所以在进行对象拷贝时可利用利用JSON对象方法实现深拷贝，**`JSON.parse(JSON.stringify())`。
函数调用时，会对参数赋值。而参数传递过程其实同样是变量复制的过程，所以它是按值传递。`var person = person`，因为传递参数是对象时，变量复制仅复制的栈存储（浅拷贝），所以修改对象属性会造成外部变量对象的修改。
```javascript
let _o = {
  age: 10
}
function foo(obj) {
  obj.age = 100;
}
foo(_o);
_o.age // 100
````

### 队列：FIFO，**First in, first out**

是一种先进先出的数据结构。
![](https://cdn.nlark.com/yuque/0/2020/png/105266/1599036437935-98501859-8a05-48a3-8235-3cbc7184d0ea.png?x-oss-process=image%2Fresize%2Cw_1492#height=441&id=U9wGg&margin=%5Bobject%20Object%5D&name=&originHeight=441&originWidth=1492&originalType=binary∶=1&status=done&style=none&width=1492)

#### 应用：优先级队列

根据优先级排队，始终让优先级最高的成员处于队列队首，因此任何队列成员的变动都需要重新排序，确保队列队首成员优先级最高。

#### 实践：事件轮询（Event Loop）的执行机制

​

### 链表：递归的数据结构

由多个节点组成，节点直接通过引用相互关联。

- 在内存内，链表是不连续的内存，通过引用关联节点；
- 链表没有序列，如果引用是单向的，则只能通过上一个节点查询下一个节点；
- 节点之间的引用可以是单向的（“单向链表”），也可以是双向的（“双向链表”），还可以首位连接（“循环链表”）；

```typescript
type Node = {
  next: Node,
  prev: Node,
  // 其他...
  id: number,
  value: number,
  ...
}
```

#### 实践：原型链

每个实例对象都有一个`__proto__`属性，用于指向该实例的原型对象，该原型对象也会有个`__proyo__`对象指向自身的原型对象。
因此原型链是一个由`__proto__`进行关联的链表。

### 数组：有顺的连续内存地址

### 树

### 集合

### 哈希表
