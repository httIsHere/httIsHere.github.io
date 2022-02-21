---
title: 「CSS」env()和constant()设置安全区域
urlname: asobyi
date: '2020-12-23 16:55:21 +0800'
tags:
  - css
categories:
  - CSS/Less
---

> 全面屏内的安全区域。

#### 属性：

env()和 constant()，是 IOS11 新增特性，Webkit 的 css 函数，用于设定安全区域与边界的距离，有 4 个预定义变量：

- safe-area-inset-left：安全区域距离左边边界的距离
- safe-area-inset-right：安全区域距离右边边界的距离
- safe-area-inset-top：安全区域距离顶部边界的距离
- safe-area-inset-bottom ：安全距离底部边界的距离

**H5 网页设置**`**viewport-fit=cover**`**的时候才生效，小程序里的 viewport-fit 默认是 cover。**
**​**

#### 使用：

```css
.tab-bar {
  height: calc(~"50px+ constant(safe-area-inset-bottom)"); //兼容 IOS<11.2
  height: calc(~"50px + env(safe-area-inset-bottom)"); //兼容 IOS>11.2
  padding-bottom: constant(safe-area-inset-bottom); ///兼容 IOS<11.2/
  padding-bottom: env(safe-area-inset-bottom); ///兼容 IOS>11.2/
}
```

#### 效果：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1608713924335-570d46c1-fe61-4fd5-845c-e713a7afbf43.png#height=102&id=eaWPE&margin=%5Bobject%20Object%5D&name=image.png&originHeight=203&originWidth=826&originalType=binary∶=1&size=53434&status=done&style=none&width=413)
