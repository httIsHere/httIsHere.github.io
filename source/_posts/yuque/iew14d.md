---
title: 「大前端」浏览器的工作-2
urlname: iew14d
date: '2021-06-29 16:50:26 +0800'
tags:
  - browser
categories:
  - browser
---

> 如何解析请求回来的 HTML 代码，DOM 树又是如何构建的。

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1624957540017-1335aa73-05b5-4026-8f2d-2dc46497da0d.png#align=left&display=inline&height=279&margin=%5Bobject%20Object%5D&name=image.png&originHeight=279&originWidth=732&size=40030&status=done&style=none&width=732)

### 解析代码

HTTP 的 Response 的 body。
HTML 的结构不算太复杂，我们日常开发需要的 90% 的“词”（指编译原理的术语 token，表示最小的有意义的单元），种类大约只有标签开始、属性、标签结束、注释、CDATA 节点几种。

#### 词（token）是如何被拆分的

```html
<p class="a">text text text</p>
```

起始标签也是会包含属性的，最小的意义单元其实是 `<p`。
继续拆分，可以把这段代码依次拆成词（token）：

- 开始标签： `<p`
- 属性： `class="a"`
- 开始标签的结束： `>`
- 文本： `text text text`
- 结束标签： `</p>`

![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1625018471742-e211f6dd-480e-41dd-8e98-89eb7537bad2.png#align=left&display=inline&height=252&margin=%5Bobject%20Object%5D&name=image.png&originHeight=252&originWidth=624&size=40366&status=done&style=none&width=624)
代码开始从 HTTP 协议收到的字符流读取字符：
比如，假设我们接受了一个字符“ < ” 我们一下子就知道这不是一个文本节点啦。
之后我们再读一个字符，比如就是 x，那么我们一下子就知道这不是注释和 CDATA 了，接下来我们就一直读，直到遇到“>”或者空格，这样就得到了一个完整的词（token）了。
在这样的条件下，浏览器工程师要想实现把字符流解析成词（token），最常见的方案就是使用状态机。

#### 状态机

绝大多数语言的词法部分都是用状态机实现的。token 的解析
![image.png](https://cdn.nlark.com/yuque/0/2021/png/250093/1625018668766-dcb91c36-b69d-4fc1-8443-097fa7cb156f.png#align=left&display=inline&height=739&margin=%5Bobject%20Object%5D&name=image.png&originHeight=739&originWidth=768&size=226214&status=done&style=none&width=768)
[HTML 官方文档](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)规定了 80 个状态（顺便一说，HTML 是我见过唯一一个标准中规定了状态机实现的语言，对大部分语言来说，状态机是一种实现而非定义）。
