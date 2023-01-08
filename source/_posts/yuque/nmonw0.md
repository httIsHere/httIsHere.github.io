---
title: 「ROAD 6」CSS-语法知识
urlname: nmonw0
date: '2021-12-13 09:54:50 +0800'
tags:
  - ROAD 6
categories:
  - 大前端
---

## 语法

![选择器.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1639641975124-bb1e4e2c-3a9d-4b9c-9a23-8c1278ab8d71.png#clientId=u85802699-b937-4&from=ui&id=u4219e71f&margin=%5Bobject%20Object%5D&name=%E9%80%89%E6%8B%A9%E5%99%A8.png&originHeight=1652&originWidth=2652&originalType=binary∶=1&size=372313&status=done&style=none&taskId=u426682d6-ab10-4108-8821-6f2f43bf916)

### 简单选择器

- -
- div svg|a (namespace)
- .cls
- `#id`
- [attr=value]
- :hover
- ::before

### 复合选择器

- <简单选择器> <简单选择器> <简单选择器>（同时满足）
- \*或者 div 必须写在前面

### 复杂选择器

- <复合选择器><复合选择器>（子孙选择器）
- <复合选择器>">"<复合选择器>（子选择器）
- <复合选择器>"~"<复合选择器>
- <复合选择器>"+"<复合选择器>
- <复合选择器>"||"<复合选择器>（level 4 的新增）（table 内选择一列的关系）

## 优先级

优先级关系：内联样式 > ID 选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器。

[https://www.w3.org/TR/selectors/#specificity](https://www.w3.org/TR/selectors/#specificity)

### 简单选择器计数

只有简单选择器存在优先级计数，复合选择器和复杂选择器就是将所有计数相加。

优先级分为 4 级，四元组（内联样式，ID 选择器，类选择器/属性选择器/伪类，元素选择器）。

```css
1 2 #id div.a#id {
} // [0, 2, 1, 1]
```

### 练习

- `div#a.b .c[id=x]`：[0, 1, 3, 1]（[id=x]的优先级要比#x 低）
- `#a:not(#b)`：[0, 1, 1, 0]❌，[0, 2, 0, 0]（:not 不占优先级）
- `*.a`：[0, 0, 1, 0]（通配符不改变优先级）
- `div.a`：[0, 0, 1, 1]

## 伪类

### 链接/行为

- :any-link
- :link :visited
- :hover：只会被鼠标触发
- :active
- :focus
- :target

### 树结构

- :empty
- :nth-child()
- :nth-last-child()
- :first-child :last-child :only-child

### 逻辑型

- :not
- :where :has

## 伪元素

- ::before (无中生有)
- ::after (无中生有)
- ::firstLetter
- ::firstLine

#### 可用属性

![](/Users/httishere/Downloads/Xnip2021-11-22_17-35-54.jpg#id=g4EyP&originalType=binary∶=1&status=done&style=none)

### ??

> 为什么 first-letter 可以设置 float 之类的，而 first-line 不行？

float 是脱离流，所以与 first-line 定义矛盾，那么就会重新选择 first line，就会陷入无限循环。

所以 first line 不能设置 float。

实际上并非是计算出真正的第一行并为其设置属性，而是根据浏览器将其属性置于 first line 的文字上（因为实际渲染上从左向右进行文字渲染），所以 first line 仅有文字属性并没有盒属性。

## 作业

编写 match 函数（toy-browser）。

```javascript
function match(selector, element) {}
```
