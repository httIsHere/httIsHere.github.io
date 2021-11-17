---
title: 「ROAD 6」词法类型
urlname: whqse7
date: '2021-08-19 17:20:29 +0800'
tags:
  - ROAD 6
categories:
  - 大前端
---

#### [unicode](https://www.fileformat.info/info/unicode/block/index.htm)

> [https://home.unicode.org/](https://home.unicode.org/)

```javascript
for (let i = 0; i < 128; i++) {
  console.log(String.fromCharCode(i));
}
```

在需要使用“中文”作为变量名时，最好在声明时使用`\u`转译。

```javascript
var 厉害 = 1;
console.log(厉害); // 1

// 如何获取中文的字符编码
"厉害".charCodeAt(0).toString(16); // "5389"
"厉害".charCodeAt(1).toString(16); // "5bb3"
```

InputElement

- WhiteSpace
  - `<TAB>`：制表符
  - `<VT>` ：纵向制表符
  - `<FF>`
  - `<SP>`
  - `<NBSP>`
  - `<BOM>`
  - `<USP>`
- LineTerminater：换行符
  - `<LF>`：`/n`
  - `<CR>` ：`/r`
  - `<LS>`：超出 unicode 编码外，不建议使用
  - `<PS>`：超出 unicode 编码外，不建议使用
- Comment
- Token
  - Punctuator：符号（`(),<,>...`）
  - IdentifierName：标识符
    - Keywords
    - Future reserved Keywords：enum
    - Identifier：以字母开头
  - Literal：直接量（`true,false...`）
    - Number（0，0.，.2，1e3）=> (`0.1+0.2 != 0.3`问题，最小精度)
    - String（"abc", 'abc', 还支持反引号）

```javascript
(97).toString(2); // 获取一个数字的二进制
// 因为根据Number的定义，97.是一个合法的数字，所以需要在97后面加一个空格
```

      -  Boolean
      -  Object
      -  Symbol
      -  Null
      -  Undefined

> - 变量名：不能与关键字相同（不能定义一个变量名为`new`的变量，特殊：get（可以作为变量名，也可以作为关键字））
> - 属性名：可以与关键字相同
