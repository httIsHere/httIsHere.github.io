---
title: canvas 基础
date: 2019-02-19 10:35:44
tags: 
    - 'canvas'
categories: HTML
---

### Canvas

- 画布栅格
canvas元素默认被网格所覆盖。通常来说网格中的一个单元相当于canvas元素中的一像素。栅格的起点为左上角（坐标为（0,0））。所有元素的位置都相对于原点定位。
![](https://mdn.mozillademos.org/files/224/Canvas_default_grid.png)

- 绘制矩形
`fillRect(x, y, width, height)`: 绘制一个填充的矩形;
`strokeRect(x, y, width, height)`: 绘制一个矩形的边框;
`clearRect(x, y, width, height)`: 清除指定矩形区域，让清除部分完全透明;
x与y指定了在canvas画布上所绘制的矩形的左上角（相对于原点）的坐标，width和height设置矩形的尺寸。

- 绘制路径
需要创建起点，绘制出路径，封闭路径，渲染路径区域。
`beginPath()`: 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
`closePath()`: 闭合路径之后图形绘制命令又重新指向到上下文中。
`stroke()`: 通过线条来绘制图形轮廓。
`fill()`: 通过填充路径的内容区域生成实心的图形。