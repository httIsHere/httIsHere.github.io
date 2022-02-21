---
title: js绑定call, apply, bind
date: 2019-01-23 16:01:15
tags: 
categories: JavaScript
---

> 在JavaScript内Function有3个自带的方法（call，apply，bind），均是为了改变函数体内的this指向。

相同：call，apply，bind函数第一个参数都是this要指向的对象，即想指定的上下文。

区别：
- apply的第二个参数是一个参数数组；
- call第二个及以后是多个参数（即参数数组内容全部列举）；
- bind会创建一个新函数（绑定函数），返回也是函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind() 方法的第一个参数 作为 this，传入 bind() 方法的 第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数，使用bind不会立即执行，在调用创建的新的函数才会执行。

apply和call功能是完全一样的，传参就在于传参的方式。

apply, call用法：
1. 数组追加
```
var array1 = [12, 'foo', {name:'Joe'}, -2458];
var array2 = ['Doe' , 555 , 100];
Array.prototype.push.call(array1, array2);
// [12, 'foo', {name:'Joe'}, -2458, ['Doe' , 555 , 100]]
// array1.length = 5

Array.prototype.push.apply(array1, array2); // 这里用 apply 第二个参数是一个数组
// [12, 'foo', {name:'Joe'}, -2458, 'Doe' , 555 , 100]
// array1.length = 7
```
2. 获得数组内的最大值，最小值
```
// 由于没有指向，第一个参数传null或本身
var numbers = [5, 458, 120, -215]; 
var maxInNumbers = Math.max.apply(Math, numbers),   // 458
    maxInNumbers = Math.max.call(Math,5, 458 , 120 , -215); // 458
```
3. 验证是否是数组（前提是toString（）方法没有被重写过）
```
function isArray(obj){ 
    return Object.prototype.toString.call(obj) === '[object Array]' ;
}
```

bind用法：
```
var bar = function(){
    console.log(this.x);
}
var foo = {
    x:3
}
bar(); // undefined
var func = bar.bind(foo); //此时this已经指向了foo，但是用bind（）方法并不会立即执行，而是创建一个新函数，如果要直接调用的话 可以 bar.bind(foo)（）


func(); // 3
```