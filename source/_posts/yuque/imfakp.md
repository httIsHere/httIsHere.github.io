---
title: 「js」Proxy & Reflect
urlname: imfakp
date: '2021-05-25 10:52:38 +0800'
tags: []
categories: []
---

## Proxy

> 用于创建一个**对象的代理**，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。
> 用于**修改某些操作的默认行为**，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

语法：

```javascript
var proxy = new Proxy(target, handler);
```

- `target`: 要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
- `handler`: 通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `proxy` 的行为。

对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。比如，上面代码中，配置对象有一个`get`方法，用来拦截对目标对象属性的访问请求。`get`方法的两个参数分别是目标对象和所要访问的属性。如果`handler`没有设置任何拦截，那就等同于直接通向原对象。

注意，要使得`Proxy`起作用，必须针对`Proxy`实例（上例是`proxy`对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

一个技巧是将 Proxy 对象，设置到`object.proxy`属性，从而可以在`object`对象上调用。

```javascript
var object = { proxy: new Proxy(target, handler) };
```

Proxy 实例也可以作为其他对象的原型对象:

```javascript
var proxy = new Proxy(
  {},
  {
    get: function (target, property) {
      return 35;
    },
  }
);

let obj = Object.create(proxy);
```

`handler`可以包含的拦截函数：

- **get(target, propKey, receiver)**
  拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
  最后一个参数`receiver`是一个对象，可选，参见下面`Reflect.get`的部分。
- **set(target, propKey, value, receiver)**
  拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
- **has(target, propKey)**
  拦截`propKey in proxy`的操作，以及对象的`hasOwnProperty`方法，返回一个布尔值。
- **deleteProperty(target, propKey)**
  拦截`delete proxy[propKey]`的操作，返回一个布尔值。
- **ownKeys(target)**


    拦截Object.getOwnPropertyNames(proxy)，Object.getOwnPropertySymbols(proxy)，Object.keys(proxy`，返回一个数组。该方法返回对象所有自身的属性，而Object.keys()仅返回对象可遍历的属性。

- **getOwnPropertyDescriptor(target, propKey)**
  拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- **defineProperty(target, propKey, propDesc)**
  拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- **preventExtensions(target)**
  拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- **getPrototypeOf(target)**


    拦截`Object.getPrototypeOf(proxy)`，返回一个对象。

- **isExtensible(target)**


    拦截`Object.isExtensible(proxy)`，返回一个布尔值。

- **setPrototypeOf(target, proto)**
  拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- **apply(target, object, args)**
  拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
- **construct(target, args)**
  拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。

### get

利用 Proxy，可以将读取属性的操作（`get`），转变为执行某个函数，从而实现属性的链式操作。

```javascript
var pipe = (function () {
  return function (value) {
    var funcStack = [];
    var oproxy = new Proxy(
      {},
      {
        get: function (pipeObject, fnName) {
          if (fnName === "get") {
            return funcStack.reduce(function (val, fn) {
              return fn(val);
            }, value);
          }
          funcStack.push(window[fnName]);
          return oproxy;
        },
      }
    );

    return oproxy;
  };
})();
var double = (n) => n * 2;
var pow = (n) => n * n;
var reverseInt = (n) => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63
```

### set

用来拦截某个属性的赋值操作。

```javascript
let validator = {
  set: function (target, prop, value) {
    console.log(target, value);
    if (prop === "age") {
      if (!Number.isInteger(value)) {
        throw new TypeError("The age is not an integer");
      }
      if (value > 200) {
        throw new RangeError("The age seems invalid");
      }
    }

    // 对于age以外的属性，直接保存
    target[prop] = value;
  },
};

let person = new Proxy({}, validator);

person.age = 100;

person.age; // 100
person.age = "young"; // 报错
person.age = 300; // 报错
```

由于设置了存值函数`set`，任何不符合要求的`age`属性赋值，都会抛出一个错误。

利用`set`方法，还可以**数据绑定**，即每当对象发生变化时，会自动更新 DOM。

```javascript
let validator = {
  set: function (target, prop, value) {
    if (!target[prop] || target[prop] !== value) {
      // 更新dom
    }
    target[prop] = value;
  },
};
```

有时，我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合`get`和`set`方法，就可以做到防止这些内部属性被外部读写。

```javascript
var handler = {
  get(target, key) {
    invariant(key, "get");
    return target[key];
  },
  set(target, key, value) {
    invariant(key, "set");
    target[key] = value;
    return true;
  },
};
function invariant(key, action) {
  if (key[0] === "_") {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
var target = {};
var proxy = new Proxy(target, handler);
proxy._prop;
// Error: Invalid attempt to get private "_prop" property
proxy._prop = "c";
// Error: Invalid attempt to set private "_prop" property
```

### apply

拦截函数的调用、call 和 apply 操作，`apply`方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（`this`）和目标对象的参数数组。

```javascript
// 使用方法
var handler = {
  apply(target, ctx, args) {
    return Reflect.apply(...arguments);
  },
};

// 例1
var target = function () {
  return "I am the target";
};
var handler = {
  apply: function () {
    return "I am the proxy";
  },
};

var p = new Proxy(target, handler);

p(); // "I am the proxy"

// 例2
var twice = {
  apply(target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  },
};
function sum(left, right) {
  return left + right;
}
var proxy = new Proxy(sum, twice);
proxy(1, 2); // 6
proxy.call(null, 5, 6); // 22
proxy.apply(null, [7, 8]); // 30
// 每当执行proxy函数（直接调用或call和apply调用），就会被apply方法拦截。
// 另外，直接调用Reflect.apply方法，也会被拦截。
```

### has

用来拦截`HasProperty`操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是`in`运算符。

如果原对象不可配置或者禁止扩展，这时`has`拦截会报错。

```javascript
var handler = {
  has(target, key) {
    if (key[0] === "_") {
      return false;
    }
    return key in target;
  },
};
var target = { _prop: "foo", prop: "foo" };
var proxy = new Proxy(target, handler);
"_prop" in proxy; // false
```

注：`has`方法拦截的是`HasProperty`操作，而不是`HasOwnProperty`操作，即`has`方法不判断一个属性是对象自身的属性，还是继承的属性。

`has`拦截只对`in`循环生效，**对`for...in`循环不生效**，导致不符合要求的属性没有被排除在`for...in`循环之外。

### construct

用于拦截`new`命令。

```javascript
// 用法
var handler = {
  construct(target, args, newTarget) {
    return new target(...args);
  },
};

// construct方法返回的必须是一个对象，否则会报错。
var p = new Proxy(function () {}, {
  construct: function (target, argumentsList) {
    return 1;
  },
});
new p(); // 报错
```

`construct`可以接受两个参数：1. `target`: 目标对象；2. `args`：构建函数的参数对象

### deleteProperty

用于拦截对对象属性的 [`delete`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete) 操作。

```javascript
// 用法
var p = new Proxy(target, {
  deleteProperty: function (target, property) {},
});
```

### defineProperty

用于拦截对对象的 [`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 操作，以一个 [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 返回，表示定义该属性的操作成功与否。

```javascript
// 用法
var p = new Proxy(target, {
  defineProperty: function (target, property, descriptor) {},
});

// 例1
var p = new Proxy(
  {},
  {
    defineProperty: function (target, prop, descriptor) {
      console.log("called: " + prop);
      return true;
    },
  }
);

var desc = { configurable: true, enumerable: true, value: 10 };
Object.defineProperty(p, "a", desc); // "called: a"

// 例2
var handler = {
  defineProperty(target, key, descriptor) {
    return false;
  },
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = "bar";
// TypeError: proxy defineProperty handler returned false for property '"foo"'
```

- target：目标对象。
- property：待检索其描述的属性名。
- descriptor：待定义或修改的属性的描述符。

该方法会拦截目标对象的以下操作 :

- [`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [`Reflect.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/defineProperty)
- `proxy.property='value'`

异常：

- 如果目标对象不可扩展， 将不能添加属性。
- 不能添加或者修改一个属性为不可配置的，如果它不作为一个目标对象的不可配置的属性存在的话。
- 如果目标对象存在一个对应的可配置属性，这个属性可能不会是不可配置的。
- 如果一个属性在目标对象中存在对应的属性，那么 `Object.defineProperty(target, prop, descriptor)` 将不会抛出异常。
- 在严格模式下， `false` 作为`handler.defineProperty` 方法的返回值的话将会抛出 [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 异常.

### getOwnPropertyDescriptor

拦截`Object.getOwnPropertyDescriptor`，返回一个属性描述对象或者`undefined`。

```javascript
var p = new Proxy(target, {
  getOwnPropertyDescriptor: function (target, prop) {
    console.log("called: " + prop);
    return { configurable: true, enumerable: true, value: 10 };
  },
});
Object.getOwnPropertyDescriptor(p, "a").value;
// called: a
// 10

var handler = {
  getOwnPropertyDescriptor(target, key) {
    if (key[0] === "_") {
      return;
    }
    return Object.getOwnPropertyDescriptor(target, key);
  },
};
var target = { _foo: "bar", baz: "tar" };
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, "wat"); // undefined
Object.getOwnPropertyDescriptor(proxy, "_foo"); // undefined
Object.getOwnPropertyDescriptor(proxy, "baz");
// { value: 'tar', writable: true, enumerable: true, configurable: true }
```

### getPrototypeOf

当读取代理对象的原型时，该方法就会被调用。

- [`Object.getPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)
- [`Reflect.getPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getPrototypeOf)
- [`__proto__`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)
- [`Object.prototype.isPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)
- [`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)

```javascript
const monster1 = {
  eyeCount: 4,
};

const monsterPrototype = {
  eyeCount: 2,
};

const handler = {
  getPrototypeOf(target) {
    return monsterPrototype;
  },
};

const proxy1 = new Proxy(monster1, handler);

console.log(Object.getPrototypeOf(proxy1) === monsterPrototype);
// expected output: true

console.log(Object.getPrototypeOf(proxy1).eyeCount);
// expected output: 2
```

### isExtensible

用于拦截对对象的`Object.isExtensible()`（判断一个对象是否是可扩展的，是否可以在它上面添加新的属性），返回一个 Boolean 值或可转换成 Boolean 的值。

```javascript
var p = new Proxy(
  {},
  {
    isExtensible: function (target) {
      console.log("called");
      return true; //也可以return 1;等表示为true的值
    },
  }
);

console.log(Object.isExtensible(p));
```

注：`Object.isExtensible(proxy)`必须同`Object.isExtensible(target)`返回相同值，也就是必须返回 true 或者为 true 的值，返回 false 和为 false 的值都会报错。

```javascript
var p = new Proxy(
  {},
  {
    isExtensible: function (target) {
      return false; //return 0;return NaN等都会报错
    },
  }
);

Object.isExtensible(p); // TypeError is thrown
```

### ownKeys

用于拦截 [`Reflect.ownKeys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)，必须返回一个可枚举对象。

该拦截器可以拦截以下操作::

- [`Object.getOwnPropertyNames()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)
- [`Object.getOwnPropertySymbols()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
- [`Object.keys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
- [`Reflect.ownKeys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)

```javascript
var p = new Proxy(
  {},
  {
    ownKeys: function (target) {
      console.log("called");
      return ["a", "b", "c"];
    },
  }
);

console.log(Object.getOwnPropertyNames(p));
// "called"
// [ 'a', 'b', 'c' ]
```

- `ownKeys` 的结果必须是一个数组.
- 数组的元素类型要么是一个 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) ，要么是一个 [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol).
- 结果列表必须包含目标对象的所有不可配置（non-configurable ）、自有（own）属性的 key.
- 如果目标对象不可扩展，那么结果列表必须包含目标对象的所有自有（own）属性的 key，不能有其它值.

### preventExtensions

用于设置对[`Object.preventExtensions()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)（让一个对象变的不可扩展，也就是永远不能再添加新的属性）的拦截，返回一个布尔值。

```javascript
var p = new Proxy(
  {},
  {
    preventExtensions: function (target) {
      console.log("called");
      Object.preventExtensions(target); // proxy.preventExtensions方法返回true，但这时Object.isExtensible(proxy)会返回true，因此报错，所以需要在这里调用一下这个
      return true;
    },
  }
);

console.log(Object.preventExtensions(p)); // "called"
// false
```

注：如果目标对象是可扩展的，那么只能返回 false。

### setPrototypeOf

主要用来拦截 [`Object.setPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)（设置一个指定的对象的原型--即内部[[Prototype]]属性，到另一个对象或  [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)。），返回 `true`,否则返回 `false`。

```javascript
var handlerReturnsFalse = {
  setPrototypeOf(target, newProto) {
    return false;
  },
};

var newProto = {},
  target = {};

var p1 = new Proxy(target, handlerReturnsFalse);
Object.setPrototypeOf(p1, newProto); // throws a TypeError
Reflect.setPrototypeOf(p1, newProto); // returns false
```

注：如果 target 不可扩展, 原型参数必须与 Object.getPrototypeOf(target) 的值相同。

### Proxy.revocable()

创建一个可撤销的 Proxy 对象，返回一个包含了代理对象本身和它的撤销方法的可撤销 `Proxy` 对象。

```javascript
let target = {};
let handler = {};

let { proxy, revoke } = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo; // 123

revoke();
proxy.foo; // TypeError: Revoked
```

### Final

- this：在 Proxy 代理的情况下，目标对象内部的`this`关键字会指向 Proxy 代理。

```javascript
const target = {
  m: function () {
    console.log(this === proxy);
  },
};
const handler = {};
const proxy = new Proxy(target, handler);
target.m(); // false
proxy.m(); // true
```

## Reflect

> 一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与[proxy handlers](https://wiki.developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)的方法相同。`Reflect`并非一个构造函数，所以不能通过[new 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)对其进行调用，或者将`Reflect`对象作为一个函数来调用。`Reflect`的所有属性和方法都是静态的（就像[`Math`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)对象）。

是 ES6 为了操作对象而提供的新 API，`Reflect`对象的设计目的：

- 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。
- 修改某些 Object 方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。

```javascript
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}
// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```

- 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。

```javascript
// 老写法
"assign" in Object; // true
// 新写法
Reflect.has(Object, "assign"); // true
```

- `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

```javascript
Proxy(target, {
  set: function (target, name, value, receiver) {
    var success = Reflect.set(target, name, value, receiver);
    if (success) {
      log("property " + name + " on " + target + " set to " + value);
    }
    return success;
  },
});
```

### 静态方法

- Reflect.apply(target,thisArg,args)
- Reflect.construct(target,args)
- Reflect.get(target,name,receiver)
- Reflect.set(target,name,value,receiver)
- Reflect.defineProperty(target,name,desc)
- Reflect.deleteProperty(target,name)
- Reflect.has(target,name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

## 参考

[Proxy 和 Reflect](http://caibaojian.com/es6/proxy.html)

[Proxy-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
