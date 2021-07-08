---
title: 「Less」使用总结
urlname: fyor46
date: 2020-12-15 11:59:22 +0800
tags: [less]
categories: [css/Less]
---

> less 相关知识点

<!-- more -->

> - Less 是一门 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展。
> - Less 可以运行在 Node 或浏览器端。

`Less` 和 `Sass` 在语法上有些共性，比如下面这些：

- 混入(`Mixins`)： `class` 中的 `class`；
- 参数混入：可以传递参数的 `class`，就像函数一样；
- 嵌套规则：`Class` 中嵌套 `class`，从而减少重复的代码；
- 运算—：`CSS`中用上数学；
- 颜色功能：可以编辑颜色；
- 名字空间(`namespace`)：分组样式，从而可以被调用；
- 作用域：局部修改样式；
- `JavaScript` 赋值：在 `CSS` 中使用 `JavaScript` 表达式赋值。

#### 安装使用，[#using-less](http://lesscss.cn/#using-less)

```bash
npm install -g less
lessc styles.less styles.css // 可以使用lessc将less解析为css文件
```

一般项目内使用`webpack`作为打包工具，可以在`webpack`打包时进行 less 编译解析，需要安装`less`和`less-loader`。

```bash
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },
    ],
  },
};


```

### 特性

#### 变量

`Less`内的变量是以`@`开头命名的，其实是常量，只可以被声明定义一次，实际应用实践中是将其单独放在一个常量声明的文件内，作为全局变量使用。

```css
// less
@primary-color: brown;
.container {
  color: @primary-color;
}
// 输出
.container {
  color: brown;
}
```

- 选择器（Selectors）：

```css
@mySelector: #wrap;
@Wrap: wrap;
@{mySelector}{ //变量名 必须使用大括号包裹
  color: #999;
  width: 50%;
}
.@{Wrap}{
  color:#ccc;
}
```

- 属性（Properties）：

```css
@property: color;

.widget {
  @{property}: #0ee;
  background-@{property}: #999;
}
```

- Urls

```css
// Variables
@images: "../img";

// Usage
body {
  color: #444;
  background: url("@{images}/white-sand.png");
}
```

- @import

```css
// Variables
@themes: "../../src/themes";

// Usage
@import "@{themes}/tidal-wave.less";
```

也可以声明定义整个属性：

```css
@background: {
  background: red;
};
#main {
  @background();
}
```

属性定义变量（使用`$`符号可以将某属性作为变量引用）：

```css
.widget {
  color: #efefef;
  background-color: $color;
}

//Compiles to:
.widget {
  color: #efefef;
  background-color: #efefef;
}
```

参考：[Less 学习笔记](https://www.clloz.com/programming/front-end/css/2020/10/25/less-tutorial/) · [Less 中文网](http://lesscss.cn)
