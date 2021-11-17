---
title: 「js」WeakMap & WeakSet
urlname: tvi69x
date: '2021-05-26 15:22:53 +0800'
tags: []
categories: []
---

## WeakMap

> 对象是**一组键/值对**的集合，其中的**键是弱引用**的。其键必须是对象，而值可以是任意的。

key 是弱引用：`WeakMaps hold "weak" references to key objects`。

> 在计算机程序设计中，弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。 一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。
> 弱引用的对象拥有更短暂的生命周期。在垃圾回收器线程扫描它所管辖的内存区域的过程中，一旦发现了**只具有弱引用**的对象，不管当前内存空间足够与否，都会回收它的内存

### 用法

```javascript
new WeakMap([iterable]);
```

`iterable`是一个数组（二元数组）或者其他可迭代的且其元素是键值对的对象。每个键值对会被加到新的 WeakMap 里。null 会被当做 undefined。

**注：WeakMap 的 key 只能是 `Object` 类型。 原始数据类型是不能作为 key 的（比如 String）。**

#### 使用 WeakMap 的原因

在 JavaScript 里，map API 可以通过使其四个 API 方法共用两个数组(一个存放键,一个存放值)来实现。给这种 map 设置值时会同时将键和值添加到这两个数组的末尾。从而使得键和值的索引在两个数组中相对应。当从该 map 取值的时候，需要遍历所有的键，然后使用索引从存储值的数组中检索出相应的值。

但这样的实现会有两个很大的缺点，首先赋值和搜索操作都是 O(n) 的时间复杂度( n 是键值对的个数)，因为这两个操作都需要遍历全部整个数组来进行匹配。另外一个缺点是可能会导致内存泄漏，因为数组会一直引用着每个键和值。这种引用使得垃圾回收算法不能回收处理他们，即使没有其他任何引用存在了。

原生的 WeakMap 持有的是每个键对象的“弱引用”，这意味着在没有其他引用存在时垃圾回收能正确进行。原生 WeakMap 的结构是特殊且有效的，其用于映射的 key 只有在其没有被回收时才是有效的。

由于这样的弱引用，`WeakMap` 的 key 是**不可枚举**的 (没有方法能给出所有的 key)。如果 key 是可枚举的话，其列表将会受垃圾回收机制的影响，从而得到不确定的结果。因此，如果你想要这种类型对象的 key 值的列表，你应该使用 [`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)。

如果你要**往对象上添加数据，又不想干扰垃圾回收机制**，就可以使用 WeakMap。

### 属性

- `WeakMap.length`：0
- `WeakMap.prototype`：WeakMap 构造器的原型，允许添加属性到所有的 WeakMap 对象。

### 方法

```javascript
var wm = new WeakMap();
wm.set(window, "foo");
```

#### WeakMap.prototype.delete(key)

从一个 `WeakMap` 对象中删除指定的元素。

```javascript
wm.delete(window); // 返回 true，表示删除成功。
wm.has(window); // 返回 false，因为 window 对象已经被删除了。
```

#### WeakMap.prototype.get(key)

返回  `WeakMap` 指定的元素，返回与指定键相关联的值，如果 `WeakMap` 对象找不到这个键则返回 `undefined`。

```javascript
wm.get(window); // 返回 "foo".
wm.get("baz"); // 返回 undefined.
```

#### WeakMap.prototype.has(key)

根据 WeakMap 对象的元素中是否存在 key 键返回一个 boolean 值。

```javascript
wm.has(window); // returns true
wm.has("baz"); // returns false
```

#### WeakMap.prototype.set(key, value)

根据指定的`key`和`value在` `WeakMap`对象中添加新/更新元素。

```javascript
var obj = {};
// Add new elements to the WeakMap
wm.set(obj, "foo").set(window, "bar"); // chainable
// Update an element in the WeakMap
wm.set(obj, "baz");
```

## WeakSet

> WeakSet 允许将*弱保持对象*存储在一个集合中。

### 用法

```javascript
new WeakSet([iterable]);
```

iterable：传入一个[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)作为参数, 则该对象的所有迭代值都会被自动添加进生成的 `WeakSet` 对象中。null 被认为是 undefined。

```javascript
var ws = new WeakSet();
var foo = {};
var bar = {};

ws.add(foo);
ws.add(bar);

ws.has(foo); // true
ws.has(bar); // true

ws.delete(foo); // 从set中删除 foo 对象
ws.has(foo); // false, foo 对象已经被删除了
ws.has(bar); // true, bar 依然存在
```

`WeakSet` 对象是一些对象值的集合, 并且其中的每个对象值都只能出现一次，在`WeakSet`的集合中是**唯一的**。

#### 和 [`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 对象的区别:

- 与`Set`相比，`WeakSet` 只能是**对象的集合**，而不能是任何类型的任意值。
- `WeakSet`持弱引用：集合中对象的引用为弱引用。 如果没有其他的对`WeakSet`中对象的引用，那么这些对象会被当成垃圾回收掉。 这也意味着 WeakSet 中没有存储当前对象的列表。 正因为这样，`WeakSet` 是不可枚举的。

WeakSet 非常适合处理这种情况：

```javascript
// 对 传入的subject对象 内部存储的所有内容执行回调
function execRecursively(fn, subject, _refs = null) {
  if (!_refs) _refs = new WeakSet();

  // 避免无限递归
  if (_refs.has(subject)) return;

  fn(subject);
  if ("object" === typeof subject) {
    _refs.add(subject);
    for (let key in subject) execRecursively(fn, subject[key], _refs);
  }
}

const foo = {
  foo: "Foo",
  bar: {
    bar: "Bar",
  },
};

foo.bar.baz = foo; // 循环引用!
execRecursively((obj) => console.log(obj), foo);
```

### 方法

#### WeakSet.prototype.add(value)

#### WeakSet.prototype.delete(value)

#### WeakSet.prototype.has(value)
