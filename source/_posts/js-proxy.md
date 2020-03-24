---
title: js内proxy检测
date: 2019-01-24 09:44:41
tags:
categories: js
---

> let p = new Proxy(target, handler);
用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

target：用`Proxy`包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）；
handler：一个对象，其属性是当执行一个操作时定义代理的行为的函数。

`Proxy`构造函数获取一个` target `对象，和一个用来拦截` target `对象不同行为的` handler `对象。可以设置下面这些拦截项：
- has — 拦截 in 操作。比如，你可以用它来隐藏对象上某些属性。
- get — 用来拦截读取操作。比如当试图读取不存在的属性时，你可以用它来返回默认值。
- set — 用来拦截赋值操作。比如给属性赋值的时候你可以增加验证的逻辑，如果验证不通过可以抛出错误。
- apply — 用来拦截函数调用操作。比如，你可以把所有的函数调用都包裹在 try/catch 语句块中。

```
const Car = {
  maker: 'BMW',
  year: 2018,
};

// 验证属性的赋值（set：用来拦截赋值操作）
const proxyCar = new Proxy(Car, {
  set(obj, prop, value) {
    // 为maker属性赋值时长度必须大于0
    if (prop === 'maker' && value.length < 1) {
      throw new Error('Invalid maker');
    }

    // 为year赋值时数据类型必须是number
    if (prop === 'year' && typeof value !== 'number') {
      throw new Error('Invalid year');
    }
    obj[prop] = value;
    return true;
  }

});
```

这样Proxy就可以来监测对象了，比如：
- 函数执行时间
- 函数的调用者或属性的访问者
- 统计每个函数或属性的被访问次数
...

通过一个新构造函数来扩展一个已有的构造函数：
```
function extend(sup,base) {
  var descriptor = Object.getOwnPropertyDescriptor(
    base.prototype,"constructor"
  ); // 返回指定对象上一个自有属性对应的属性描述符
  base.prototype = Object.create(sup.prototype);
  var handler = {
    construct: function(target, args) {
      var obj = Object.create(base.prototype);
      this.apply(target,obj,args);
      return obj;
    },
    apply: function(target, that, args) {
      sup.apply(that,args);
      base.apply(that,args);
    }
  };
  var proxy = new Proxy(base,handler);
  descriptor.value = proxy;
  Object.defineProperty(base.prototype, "constructor", descriptor);
  return proxy;
}

var Person = function(name){
  this.name = name
};

var Boy = extend(Person, function(name, age) {
  this.age = age;
});

Boy.prototype.sex = "M";

var Peter = new Boy("Peter", 13);
console.log(Peter.sex);  // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age);  // 13
```

[Proxy | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)