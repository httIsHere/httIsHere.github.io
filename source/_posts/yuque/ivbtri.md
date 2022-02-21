---
title: 「CSS」flex的设计、原理和应用
urlname: ivbtri
date: '2021-06-28 14:29:49 +0800'
tags:
  - css
categories:
  - CSS/Less
---

​

> 仅学习记录，非原创。

### 设计

Flex 排版的核心是 display:flex 和 flex 属性，它们配合使用。

- 具有 display:flex 的元素我们称为 flex 容器;
- 它的子元素或者盒被称作 flex 项。

flex 项如果有 flex 属性，会根据 flex 方向代替宽 / 高属性，形成“填补剩余尺寸”的特性——“根据外部容器决定内部尺寸”。

### 原理

Flex 布局支持横向和纵向，把 Flex 延伸的方向称为“主轴”，把跟它垂直的方向称为“主轴”，把跟它垂直的方向称为“交叉轴”。这样，flex 项中的 width 和 height 就会称为交叉轴尺寸或者主轴尺寸。
Flex 布局中有一种特殊的情况，那就是 flex 容器没有被指定主轴尺寸，这个时候，实际上 Flex 属性完全没有用了，所有 Flex 尺寸都可以被当做 0 来处理，Flex 容器的主轴尺寸等于其它所有 flex 项主轴尺寸之和。
​

#### 分行

有 flex 属性的 flex 项可以暂且认为主轴尺寸为 0，它可以一定放进当前行。
把 flex 项逐个放入行：

- 不允许换行，把所有 flex 项放进同一行，如果剩余空间不足则进行等比例缩小。
- 允许换行，先设定主轴剩余空间为 Flex 容器主轴尺寸，每放入一个就把主轴剩余空间减掉该 flex 项的主轴尺寸，直到某个 flex 项放不进去为止，换下一行，重复前面动作。

分行过程中，我们会顺便对每一行计算两个属性：交叉轴尺寸和主轴剩余空间，交叉轴尺寸是本行所有交叉轴尺寸的最大值。
​

#### 计算主轴

计算每个 flex 项主轴尺寸和位置：

- Flex 容器是不允许换行，并且最后主轴尺寸超出了 Flex 容器，就要做等比缩放。
- Flex 容器可多行，根据分行算法，必然有主轴剩余空间，此时需要找出本行所有的带 Flex 属性的 flex 项，把剩余空间按 Flex 比例分给它们即可。

之后，可以根据主轴排布方向，确定每个 flex 项的主轴位置坐标了。
如果本行完全没有带 flex 属性的 flex 项，justify-content 机制就要生效了，它的几个不同的值会影响剩余空白如何分配，作为实现者，我们只要在计算 flex 项坐标的时候，加上一个数值即可。
**justify-content**：例如，如果是 flex-start 就要加到第一个 flex 项身上，如果是 center 就给第一个 flex 项加一半的尺寸，如果是 space-between，就要给除了第一个以外的每个 flex 项加上“（flex 项数减一）分之一”。
​

#### 计算交叉轴

计算 flex 项的交叉轴尺寸和位置。
交叉轴的计算首先是根据 align-content 计算每一行的位置，这部分跟 justify-content 非常类似。
再根据 alignItems 和 flex 项的 alignSelf 来确定每个元素在行内的位置。
计算完主轴和交叉轴，每个 flex 项的坐标、尺寸就都确定了，基本就完成了整个的 Flex 布局。
​

### 应用

#### 垂直居中

```css
 {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
```

创建一个只有一行的 flexbox，然后用 align-items:center; 和 align-content:center; 来保证行位于容器中，元素位于行中。
​

#### 两列等高

```html
<div class="parent">
  <div class="child" style="height: 300px"></div>
  <div class="child"></div>
</div>
```

```css
.parent {
  display: flex;
  width: 300px;
  justify-content: center;
  align-content: center;
  align-items: stretch;
}
.child {
  width: 100px;
  outline: solid 1px;
}
```

### 实例

#### 一般情况

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>

<style>
  ul {
    display: flex;
    margin: 50px;
    padding: 20px;
    border: 1px solid black;
  }
  li {
    width: 200px;
    height: 200px;
    border: 1px solid pink;
    list-style: none;
  }
</style>
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624932385854-0ddc858c-532e-4321-a20a-757c444dd6a1.png#height=279&id=b6Cmg&margin=%5Bobject%20Object%5D&name=image.png&originHeight=558&originWidth=2460&originalType=binary∶=1&size=48082&status=done&style=none&width=1230)

#### 存在拥有 flex 属性的 flex 项

##### 单个

```css
li:first-child {
  flex: 1;
}
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624932502396-f5f517b3-c01b-4fef-a6fa-4c6a2409a1d5.png#height=267&id=DNJ7f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=534&originWidth=2442&originalType=binary∶=1&size=49526&status=done&style=none&width=1221)
当前行没有剩余空间（自动被压缩）：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624932785234-dab3360a-8091-418c-9bd8-9908b11da063.png#height=263&id=m5gZO&margin=%5Bobject%20Object%5D&name=image.png&originHeight=526&originWidth=2444&originalType=binary∶=1&size=46163&status=done&style=none&width=1222)

##### 多个

```css
li:nth-child(5) {
  flex: 1;
}
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624932567638-cb040c48-839d-4b83-870b-4072d26ac051.png#height=273&id=XOyIC&margin=%5Bobject%20Object%5D&name=image.png&originHeight=546&originWidth=2470&originalType=binary∶=1&size=53881&status=done&style=none&width=1235)
不同的 flex 属性值，按 flex 值比例分配剩余空间：

```css
li:nth-child(5) {
  flex: 3;
}
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624932705288-a3e95e2a-7d92-4a59-aa23-95fdaca71ec0.png#height=271&id=Ebzf6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=542&originWidth=2438&originalType=binary∶=1&size=46845&status=done&style=none&width=1219)
当前行没有剩余空间（自动按比例被压缩）：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624932847979-8430e3b9-67bd-4a35-9f6f-08718eeab891.png#height=259&id=EoriQ&margin=%5Bobject%20Object%5D&name=image.png&originHeight=518&originWidth=2438&originalType=binary∶=1&size=45169&status=done&style=none&width=1219)
