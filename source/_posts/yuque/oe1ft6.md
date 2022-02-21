---
title: 「CSS」CSS那些事
urlname: oe1ft6
date: '2020-12-23 10:42:19 +0800'
tags:
  - css
categories:
  - CSS/Less
---

### 各种选择器

> 指定特定元素对其进行样式加工;

| 选择器                     | 说明                                                                                 | 版本                               |
| -------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------- |
| **基础选择器**             |                                                                                      |                                    |
| tag                        | 类型选择器                                                                           | 1                                  |
| #id                        | id 选择器                                                                            | 1                                  |
| .class                     | 类选择器                                                                             | 1                                  |
| \*                         | 通配选择器                                                                           | 2                                  |
| **层级选择器**             |                                                                                      |                                    |
| elemA elemB                | 后代元素                                                                             | 1                                  |
| elemA>elemB                | 子代元素                                                                             | 2                                  |
| elemA+elemB                | 相邻同胞                                                                             | 2                                  |
| elemA~elemB                | 元素后面的同胞元素                                                                   | 3                                  |
| **集合选择器**             |                                                                                      |                                    |
| elemA, elemB               | 并集                                                                                 | 1                                  |
| elemA.class/elemA#id       | 交集                                                                                 | 1                                  |
| **条件选择器**             |                                                                                      |                                    |
| :lang                      | 指定标记语言                                                                         | 2                                  |
| :dir()                     | 指定编写方向，文字书写方向为 ltr 或 rtl                                              | 4                                  |
| :has                       | 包含指定元素，如： `a:has(> img)` （只会匹配直接包含 `<img>`  子元素的 `<a>`  元素） | 4                                  |
| :is                        | 指定条件，如：`:is(section, article, aside, nav) h1`                                 | 4                                  |
| :not                       | 非指定条件，如：`p:not(.fancy)`，类名不是 `.fancy` 的 <p> 元素                       | 4                                  |
| :where                     | 指定条件，优先级总是为 0                                                             | 4                                  |
| :scope                     | css 伪类，作为选择器要匹配的参考点的元素                                             | 4                                  |
| :any-link                  | 选择器代表一个有链接锚点的元素，匹配每一个有 href 属性的 <a>、<area> 或 <link> 元素  | 4                                  |
| :local-link                | 所有包含`href`                                                                       |
| 且属于绝对地址的`链接元素` | 4                                                                                    |
| **结构选择器**             |                                                                                      |                                    |
| :first-child               | 元素中为首的`元素`                                                                   | 2                                  |
| :last-child                | 元素中为尾的`元素`                                                                   | 3                                  |
| :root                      | 文档根元素                                                                           | 3                                  |
| :empty                     | 无子元素的元素                                                                       | 3                                  |
| :nth-child(n)              | 元素中指定顺序索引的`元素`                                                           | 3                                  |
| :nth-last-child(n)         | 元素中指定逆序索引的`元素`                                                           | 3                                  |
| :only-child                | 父元素仅有该元素的`元素`                                                             | 3                                  |
| :nth-of-type(n)            | 标签中指定顺序索引的`标签`                                                           | 3                                  |
| :nth-last-of-type(n)       | 标签中指定逆序索引的`标签`                                                           | 3                                  |
| :first-of-type             | 标签中为首的`标签`                                                                   | 3                                  |
| :last-of-type              | 标签中为尾`标签`                                                                     | 3                                  |
| :only-of-type              | 父元素仅有该标签的`标签`                                                             | 3                                  |
| 状态选择器                 |                                                                                      |                                    |
| :active                    | 鼠标激活的`元素`                                                                     | 1                                  |
| :hover                     | 鼠标悬浮的`元素`                                                                     | 1                                  |
| :link                      | 未访问的链接元素                                                                     | 1                                  |
| :visited                   | 已访问的链接元素                                                                     | 1                                  |
| :target                    | 当前锚点的`元素`                                                                     | 3                                  |
| :focus                     | 输入聚焦的`表单元素`                                                                 | 3                                  |
| :required                  | 输入必填的`表单元素`                                                                 | 3                                  |
| :valid                     | 输入合法                                                                             | 3                                  |
| :invalid                   | 输入不合法                                                                           | 3                                  |
| :in-range                  | 输入范围内                                                                           | 3                                  |
| :out-of-range              | 输入范围外                                                                           | 3                                  |
| :checked                   | 选项选中                                                                             | 3                                  |
| :optional                  | 选项可选                                                                             | 3                                  |
| :enabled                   | 事件启用                                                                             | 3                                  |
| :disabled                  | 事件禁用                                                                             | 3                                  |
| :read-only                 | 只读                                                                                 | 3                                  |
| :read-write                | 可读可写                                                                             | 3                                  |
| :target-within             | 内部锚点元素处于激活状态的`元素`                                                     | 4                                  |
| :focus-within              | 内部表单元素处于聚焦状态的`元素`                                                     | 4                                  |
| :focus-visible             | 输入聚焦的`表单元素`                                                                 | 4                                  |
| :blank                     | 输入为空                                                                             | 4                                  |
| :user-invalid              | 输入合法                                                                             | 4                                  |
| :indeterminate             | 选项未定                                                                             | 4                                  |
| :placeholder-shown         | 占位显示                                                                             | 4                                  |
| :current()                 | 浏览中                                                                               | 4                                  |
| :past()                    | 已浏览                                                                               | 4                                  |
| :future()                  | 未浏览                                                                               | 4                                  |
| :playing                   | 开始播放                                                                             | 4                                  |
| :paused                    | 暂定播放                                                                             | 4                                  |
| **属性选择器**             |                                                                                      |                                    |
| [attr]                     | 指定属性的`元素`                                                                     | 2                                  |
| [attr=val]                 | 属性等于指定值的`元素`                                                               | 2                                  |
| [attr*=val]                | 属性包含指定值的`元素`                                                               | 2                                  |
| [attr^=val]                | 属性以指定值开头的`元素`                                                             | 2                                  |
| [attr$=val]                | 属性以指定值结尾的`元素`                                                             | 2                                  |
| [attr~=val]                | 属性包含指定值(完整单词)的`元素`                                                     |
| (不推荐)                   | 2                                                                                    |
| [att                       | r=val]                                                                               | 属性以指定值(完整单词)开头的`元素` |
| (不推荐)                   | 2                                                                                    |
| **伪元素**                 |                                                                                      |                                    |
| ::first-letter             | 元素的首字母，可实现首字母下沉等                                                     | 1                                  |
| ::first-line               | 元素的`首行`                                                                         | 1                                  |
| ::before                   | 在元素前插入的`内容`                                                                 | 2                                  |
| ::after                    | 在元素后插入的`内容`                                                                 | 2                                  |
| ::selection                | 鼠标选中的`元素`                                                                     | 3                                  |
| ::backdrop                 | 全屏模式的`元素`                                                                     | 4                                  |
| ::placeholder              | 表单元素的`占位`                                                                     | 4                                  |

**有时候可以通过选择器在 css 层面就可以解决一下逻辑样式问题。**
**​**

### 自定义属性--

> 带有前缀--的属性名，比如--example--name，表示的是带有值的自定义属性，其可以通过 var 函数在全文档范围内复用的。

####

#### 用法：

```css
:root {
  --first-color: #488cff;
  --second-color: #ffff8c;
}

#firstParagraph {
  background-color: var(--first-color);
  color: var(--second-color);
}
```

#### 实践：

在需要多个同级子元素且不同样式时可以对其进行设置，可以减少冗余代码。

```html
<ul class="strip-loading">
  <li style="--line-index: 1;"></li>
  <li style="--line-index: 2;"></li>
  <li style="--line-index: 3;"></li>
  <li style="--line-index: 4;"></li>
  <li style="--line-index: 5;"></li>
  <li style="--line-index: 6;"></li>
</ul>
```

```html
li { --time: calc((var(--line-index) - 1) * 200ms); border-radius: 3px; width:
6px; height: 30px; background-color: #f66; animation: beat 1.5s ease-in-out
var(--time) infinite; & + li { margin-left: 5px; } }
```

参考：[8 个硬核技巧带你迅速提升 CSS 技术 ｜ 掘金直播总结](https://juejin.cn/post/6908879198933221383#heading-12)，[CSS（层叠样式表）](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
