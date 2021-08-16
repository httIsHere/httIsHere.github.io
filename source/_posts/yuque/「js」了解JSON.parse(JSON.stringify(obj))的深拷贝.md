---
title: 「js」了解JSON.parse(JSON.stringify(obj))的深拷贝
urlname: ozne2o
date: 2021-07-26 10:10:40 +0800
tags: [js,daily]
categories: [Javascript]
---

### JSON

> **J**ava**S**cript **O**bject **N**otation，是轻量级的数据交换格式，JSON 的语法是来自 JavaScript 对象符号的语法，但 JSON 格式是纯文本。读取和生成 JSON 数据的代码可以在任何编程语言编写的。
> 数据规则： 1.简单值:字符串,数值,布尔值，null(特别注意：不支持 undefined) 2.对象：支持有序键值对，每个值可以是复杂类型也可以是简单值 3.数组：数组值可以是任意类型，包含简单值，对象,甚至其它数组。

### JSON.stringify（序列化）

> 将一个值转换为表示它的 JSON 符号。

```javascript
JSON.stringify({}); // '{}'
JSON.stringify(true); // 'true'
JSON.stringify("foo"); // '"foo"'
JSON.stringify([1, "false", false]); // '[1,"false",false]'
JSON.stringify([NaN, null, Infinity]); // '[null,null,null]'
JSON.stringify({ x: 5 }); // '{"x":5}'

JSON.stringify(new Date(2006, 0, 2, 15, 4, 5));
// '"2006-01-02T15:04:05.000Z"'
```

#### 规则：

- 在序列化 js 对象时，**所有函数和原型成员**都会有意的在结果中**省略**。
- **值为 undefined**的任何属性也会被跳过，最终等到的就是**所有实例属性均为有效**JSON 数据类型的表示。

![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1627265472172-53391a3c-06ff-47a3-aacb-a34a2db2c15a.jpeg#align=left&display=inline&height=147&margin=%5Bobject%20Object%5D&originHeight=147&originWidth=484&size=0&status=done&style=none&width=484)

MDN:[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#:~:text=JSON.stringify () converts a value to JSON notation,stringification%2C in accord with the traditional conversion semantics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#:~:text=JSON.stringify%20%28%29%20converts%20a%20value%20to%20JSON%20notation,stringification%2C%20in%20accord%20with%20the%20traditional%20conversion%20semantics).

#### 参数

JSON.stringify 还可以接收另两个参数：

- **replacer**：如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，表示指定返回当前对象的属性；如果该参数为 null 或者未提供，则对象所有的属性都会被序列化。
  ![](https://cdn.nlark.com/yuque/0/2021/jpeg/250093/1627265472176-5058c9e2-2ae4-43cd-922d-4111c943b16f.jpeg#align=left&display=inline&height=79&margin=%5Bobject%20Object%5D&originHeight=79&originWidth=451&size=0&status=done&style=none&width=451)
- **space**：指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为 10。该值若小于 1，则意味着没有空格；如果该参数为字符串（当字符串长度超过 10 个字母，取其前 10 个字母），该字符串将被作为空格；如果该参数没有提供（或者为 null），将没有空格。

### JSON.parse()

> 用来解析 JSON 字符串，构造由字符串描述的 JavaScript 值或对象。
> 提供可选的 **reviver** 函数用以在返回之前对所得到的对象执行变换(操作)。

```javascript
const json = '{"result":true, "count":42}';
const obj = JSON.parse(json); // {result: true, count: 42}
```

#### 扩展

参数`reviver` ：转换器, 如果传入该参数(函数)，可以用来修改解析生成的原始值，调用时机在 parse 函数返回之前。

```javascript
JSON.parse('{"p": 5}', function (k, v) {
  if (k === "") return v; // 如果到了最顶层，则直接返回属性值，
  return v * 2; // 否则将属性值变为原来的 2 倍。
});
```

#### 注意：不允许用逗号作为结尾

```javascript
// both will throw a SyntaxError
JSON.parse("[1, 2, 3, 4, ]");
JSON.parse('{"foo" : 1, }');
```

### 缺点

所以在使用`JSON.parse(JSON.stringify(obj))` 实现深拷贝时很可能因为序列化而丢失某些数据。

- 无法实现对函数 、RegExp 等特殊对象的克隆；
- 会抛弃对象的 constructor,所有的构造函数会指向 Object；
- 对象有循环引用,会报错；
- 含有 symbol 属性名的对象拷贝会漏掉 symbol 属性；
- 如果原对象中有时间对象，那么拷贝后时间将只是字符串的形式，而不是时间对象；
- 只能序列化对象的可枚举的自有属性；
