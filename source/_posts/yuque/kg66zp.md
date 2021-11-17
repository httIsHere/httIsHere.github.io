---
title: 「大前端」脚本 vs 模块
urlname: kg66zp
date: '2021-05-18 15:29:28 +0800'
tags:
  - js
categories:
  - Javascript
---

JavaScript 有两种源文件，一种叫做脚本，一种叫做模块。

这个区分是在 ES6 引入了模块机制开始的，在 ES5 和之前的版本中，就只有一种源文件类型（就只有脚本）。脚本是可以由浏览器或者 node 环境引入执行的，而模块只能由 JavaScript 代码用`import`引入执行。

从概念上，脚本是你具有主动性的 JavaScript 代码段，是控制宿主完成一定任务的代码；而模块是被动性的 JavaScript 代码段，是等待被调用的库。

实际上模块和脚本之间的区别仅仅在于是否包含 import 和 export。脚本是一种兼容之前的版本的定义，在这个模式下，没有 import 就不需要处理加载“.js”文件问题。现代浏览器可以支持用 script 标签引入模块或者脚本，如果要引入模块，**必须给 script 标签添加 type=“module”**，如果引入脚本，则不需要 type。

```html
<script type="module" src="xxxxx.js"></script>
```

脚本中可以包含语句。

模块中可以包含三种内容：import 声明，export 声明和语句。

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1621322989107-d866e463-32fb-4c31-88e7-0125ace294a7.jpeg#align=left&display=inline&height=596&margin=%5Bobject%20Object%5D&originHeight=596&originWidth=1040&size=0&status=done&style=none&width=1040)

#### import 声明

```javascript
import "mod"; //引入一个模块
import v from "mod"; //把模块默认的导出值放入变量v
```

直接 import 一个模块，只是保证了这个模块代码被执行，引用它的模块是无法获得它的任何信息的。

带 from 的 import 意思是引入模块中的一部分信息，可以把它们变成本地的变量。

- `import x from "./a.js"`，引入模块中导出的默认值。
- `import {a as x, modify} from "./a.js";`，引入模块中的变量。
- `import * as x from "./a.js"`，把模块中所有的变量以类似对象属性的方式引入。

语法要求不带 as 的默认值永远在最前。注意，这里的变量实际上仍然可以受到原来模块的控制。

```javascript
// 模块a
export var a = 1;

export function modify() {
  a = 2;
}

// 模块b
import { a, modify } from "./a.js";

console.log(a); // 1

modify();

console.log(a); // 2
```

当我们调用修改变量的函数后，b 模块变量也跟着发生了改变。这说明导入与一般的赋值不同，导入后的变量实际上并没有新建一个变量而是引用了原来的变量。

#### export 声明

与 import 相对，export 声明承担的是导出的任务。模块中导出变量的方式有两种，一种是独立使用 export 声明，另一种是直接在声明型语句前添加 export 关键字。

```javascript
export {a, b, c};

export var ~
export let ~
export const ~
export function ~
export class ~
```

`export default`表示导出一个**默认变量值**，它可以用于 function 和 class。这里导出的变量是没有名称的，可以使用`import x from "./a.js"`这样的语法，在模块中引入。

```javascript
var a = {};
export default a;
```

导出的是值，导出的就是普通变量 a 的值，以后 a 的变化与导出的值就无关了，修改变量 a，不会使得其他模块中引入的 default 值发生改变。

#### 函数体

执行函数的行为通常是在 JavaScript 代码执行时，**注册**宿主环境的某些事件触发的，而执行的过程，就是执行函数体（函数的花括号中间的部分）。

```javascript
setTimeout(function () {
  console.log("go go go");
}, 10000);
```

宏任务中可能会执行的代码包括“脚本 (script)”，“模块（module）”和“函数体（function body）”。

```javascript
// normal
function foo() {
  //Function body
}
// 异步函数体
async function foo() {
  //Function body
}
// 生成器函数体
function* foo() {
  //Function body
}
// 异步生成器函数体
async function* foo() {
  //Function body
}
```

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1621322988912-dd04d85c-a828-4f56-a49c-6fb19df8dac5.jpeg#align=left&display=inline&height=461&margin=%5Bobject%20Object%5D&originHeight=461&originWidth=914&size=0&status=done&style=none&width=914)

#### 两个 JavaScript 语法的全局机制：预处理和指令序言。

##### 预处理

JavaScript 执行前，会对脚本、模块和函数体中的语句进行预处理。预处理过程将会提前处理 var、函数声明、class、const 和 let 这些语句，以确定其中变量的意义。

- `var`声明：永远作用于脚本、模块和函数体这个级别，在预处理阶段，不关心赋值的部分，只管在当前作用域声明这个变量（变量提升）。

```javascript
console.log(a); // 只知道a已经被声明，但是不知道a被赋的值
var a = 2;
```

```javascript
var a = 1;

function foo() {
  console.log(a);
  var a = 2;
}

foo();
```

- 预处理过程在执行之前，所以有函数体级的变量 a，就不会去访问外层作用域中的变量 a 了，而函数体级的变量 a 此时还没有赋值，所以是 undefined。
  因为早年 JavaScript 没有 let 和 const，只能用 var，又因为 var 除了脚本和函数体都会穿透，人民群众发明了“**立即执行的函数表达式（IIFE）**”这一用法，用来产生作用域：

```javascript
for (var i = 0; i < 20; i++) {
  void (function (i) {
    var div = document.createElement("div");
    div.innerHTML = i;
    div.onclick = function () {
      console.log(i);
    };
    document.body.appendChild(div);
  })(i);
}
```

- 如果不使用 IIFE 则会打印出 20 个 20，因为全局只有一个 i，而执行完循环后 i 变成 20。
- `function`声明：在全局（脚本、模块和函数体），function 声明表现跟 var 相似，不同之处在于，function 声明不但在作用域中加入变量，还会给它赋值。

```javascript
console.log(foo); // ƒ foo(){}
function foo() {}
```

- 但是 function 声明出现在 if 等逻辑语句中的情况有点复杂，它仍然作用于脚本、模块和函数体级别，在预处理阶段，仍然会产生变量，它不再被提前赋值。

```javascript
console.log(foo); // undefined
if (false) {
  function foo() {}
}
```

- function 在预处理阶段仍然发生了作用，在作用域中产生了变量，没有产生赋值，**赋值行为发生在了执行阶段**。
- `class`声明：在 class 声明之前使用 class 名，会抛错。

```javascript
console.log(c);
class c {}

// 该情况下也会报错，说明后面的声明对作用域内的变量使用也会产生影响
var c = 1;
function foo() {
  console.log(c);
  class c {}
}
foo();
```

- class 声明也是会被预处理的，它会在作用域中创建变量，并且要求访问它时抛出错误。class 的声明作用不会穿透 if 等语句结构，所以只有写在全局环境才会有声明作用。
  class 设计比 function 和 var 更符合直觉，而且在遇到一些比较奇怪的用法时，倾向于抛出错误。

##### 指令序言机制

脚本和模块都支持一种特别的语法，叫做指令序言（Directive Prologs）。这里的指令序言最早是为了 use strict 设计的，它规定了一种给 JavaScript 代码添加元信息的方式。

```javascript
"use strict";
function f() {
  console.log(this);
}
f.call(null);
```

这里定义了函数 f，f 中打印 this 值，然后用 call 的方法调用 f，传入 null 作为 this 值，我们可以看到最终结果是 null 原封不动地被当做 this 值打印了出来，这是严格模式的特征。

在非严格模式下，则打印出 global。

"use strict"是 JavaScript 标准中规定的唯一一种指令序言，但是设计指令序言的目的是，留给 JavaScript 的引擎和实现者一些统一的表达方式，在静态扫描时指定 JavaScript 代码的一些特性。

JavaScript 的指令序言是只有一个字符串直接量的表达式语句，它只能出现在脚本、模块和函数体的最前面。

Final：试着用 babel，分析一段 JavaScript 的模块代码，并且找出它中间的所有 export 的变量。
