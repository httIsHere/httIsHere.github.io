---
title: 「大前端」文法
urlname: mdsqnm
date: '2021-04-01 11:14:06 +0800'
tags:
  - js
categories:
  - JavaScript
---

文法是编译原理中对语言的写法的一种规定，一般来说，文法分成词法和语法两种。

> 词法规定了语言的最小语义单元：token，可以翻译成“标记”或者“词”。
> 词法分析技术上可以使用状态机或者正则表达式来进行。

## 词法

分类：

- WhiteSpace 空白字符
- LineTerminator 换行符
- Comment 注释
- Token 词
  - IdentifierName 标识符名称，典型案例是我们使用的变量名，注意这里关键字也包含在内了。
  - Punctuator 符号，我们使用的运算符和大括号等符号。
  - NumericLiteral 数字直接量，就是我们写的数字。
  - StringLiteral 字符串直接量，就是我们用单引号或者双引号引起来的直接量。
  - Template 字符串模板，用反引号` 括起来的直接量。

除法和正则表达式冲突问题。在 JavaScript 内不但支持除法运算符“ / ”和“ /= ”，还支持用斜杠括起来的正则表达式“ /abc/ ”。

但是，这时候对词法分析来说，其实是没有办法处理的，所以 JavaScript 的解决方案是定义两组词法，然后靠语法分析传一个标志给词法分析器，让它来决定使用哪一套词法。

还有比如：

```javascript
`Hello, ${name}`;
```

理论上，“ ${ } ”内部可以放任何 JavaScript 表达式代码，而这些代码是以“ } ” 结尾的，也就是说，这部分词法不允许出现“ } ”运算符。

是否允许“ } ”的两种情况，与除法和正则表达式的两种情况相乘就是四种词法定义，所以你在 JavaScript 标准中，可以看到四种定义：

- InputElementDiv；
- InputElementRegExp；
- InputElementRegExpOrTemplateTail；
- InputElementTemplateTail。

为了解决这两个问题，标准中还不得不把除法、正则表达式直接量和“ } ”从 token 中单独抽出来，用词上，也把原本的 Token 改为 CommonToken。
