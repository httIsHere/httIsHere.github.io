---
title: constructor & prototype
date: 2019-01-22 10:08:03 +0800
tags: 
    - 'js'
categories: Javascript
---

> 定义：constructor 是一个对象的属性，这个属性存在在此对象的 prototype 中, 指向此对象的构造函数。

- constructor 是一个对象属性；
- constructor 在 prototype 中；
- constructor 指向构造函数；

> prototype 是一个函数属性, 此属性同时也是一个对象, 保存着对象实例所共有的属性和方法。

- prototype 是函数属性, 只要是函数, 就有 prototype 属性. 而不管是构造函数还是普通函数.
- prototype 同时也是对象.
- prototype 放的是公共的东西, 包括属性和方法.

在 JavaScript 内将使用 function 定义的称为函数：

```
function Person(name) {
    this.name = name;
    this.showMyName = function() {
        alert(this.name);
    }
}
```

而对于 Person 还可以使用 new 操作符进行实例化，`var Lilei = new Person('Lilei');`，于是此时 Person 就类似于类，但是其没有关键字 class，所以就称之为类的构造函数。
按照 javascript 的说法，function 定义的这个 Person 就是一个 Object（对象），而使用 function 生成的对象和使用 new 操作符生成的对象是不同的，function 定义的对象有 prototype（原型）属性，而 new 生成的对象没有该属性。
prototype 属性是指向一个 prototype 对象的。
prototype 对象中又有一个 constructor 属性，这个 constructor 属性同样指向一个 constructor 对象，而这个 constructor 对象恰恰就是这个 function 函数本身。

```
function Person(name) {
    this.name = name;
    this.showMyName = function() {
        alert(this.name);
    }
}
var Lilei = new Person('Lilei');
console.log(Lilei.prototype); // undefined
console.log(typeof Person.prototype); // Object
console.log(Person.prototype.constructor);// function Person(name) {...}
```

```
// type 1 （所有对象实例共享）
Person.prototype.getName = function(){
    alert(this.name);
}
var Meimei = new Person('Meimei');
alert(obj.constructor == Person);// true
// type 2
Person.prototype = {
    getName: function(){
        alert(this.name);
    }
}
var Meimei = new Person('Meimei');
alert(obj.constructor == Person);// false
// type2情况下就是将Person的prototype进行重写，导致原来的constructor被覆盖
Person.prototype = {
    constructor: Person, // 强制指回Person
    getName: function(){
        alert(this.name);
    }
}
var Lilei = new Person('Lilei');
var Meimei = new Person('Meimei');
Lilei.getName(); // 'Lilei'
Meimei.getName(); // 'Meimei'
Lilei.getName() == Meimei.getName(); // true
```

> 同时说说 this，定义是`this`就是函数赖以执行的对象：

- this 是对象；
- this 以来函数执行的上下文环境；
- this 存在于函数内；

```
alert(this); // 全局环境，此时this指向window
function Person(name) {
    console.log(this);
    this.name = name;
    this.showMyName = function() {
        alert(this.name);
    }
}
Person('Lilei'); // 全局环境执行Person函数，this指向window
var Lilei = new Person('Lilei'); // 将Person作为构造函数实例化对象
                                 // 此时this指向Object
```

```
function Person2(){
    alert(this.name);
}
Person2(); // this指向window，所以输出了也就是window.name，此时未在窗口内定义name，所以为undefined
function Person(name) {
    this.name = name;
    alert(this.name);
}
Person('Lilei'); // 'Lilei'
Person2(); // 'Lilei'，两个函数都是对window.name进行操作，所以会互相影响
var person = new Person2();
console.log(person); // undefined，this.name = Object.name
```

```
// 综合例子
var Tinker = function(){
    this.elements = [];
};
// 对Tinker定义一个对象，动态为对象原型增加方法
Tinker.fn = Tinker.prototype = {
    constructor: Tinker,
    extend: function(obj){
        var p;
        for(p in obj){
            this.constructor.prototype[p] = obj[p];
        }
    }
}
// 为原型增加了get和each方法
Tinker.fn.extend({
    get: function(){ // 查找页面内id元素
        var length = arguments.length, i = 0;
        for(; i < length; i++){
            this.elements.push(document.getElementById(arguments[i])); 
        }
        return this;
    },
    each: function(fn){ // 对所查找到的元素绑定方法
        var i = 0, length = this.elements.length;
        for(; i < length; i++){
            fn.call(this.elements[i], i, this.elements[i]);
        }
        return this;
    }
});
//假设有id = 'data', id = 'message'
var obj = new Tinker();
obj.get('data', 'message').each(function(i, item){
    this.style.color = 'red';
})
```
