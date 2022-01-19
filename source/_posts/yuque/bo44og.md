---
title: 「大前端」表达式&运算符
urlname: bo44og
date: '2021-05-24 09:45:19 +0800'
tags:
  - js
categories:
  - JavaScript
---

在一些通用的计算机语言设计理论中，能够出现在赋值表达式右边的叫做：右值表达式（RightHandSideExpression），而在 JavaScript 标准中，规定了在等号右边表达式叫做条件表达式（ConditionalExpression）。

#### 更新表达式 UpdateExpression

左值表达式搭配 ++ -- 运算符，可以形成更新表达式。

```javascript
--a;
++a;
a--;
a++;
```

#### 一元运算表达式 UnaryExpression

```javascript
// 搭配了一个一元运算符(delete, void, typeof, -, ~, !, await)
delete a.b;
void a;
typeof a;
-a;
~a;
!a;
await a;
```

#### 乘方表达式 ExponentiationExpression

```javascript
(++i) ** 30;
2 ** 30 - //正确
  2 ** 30; //报错 => (-2) ** 30
```

\*\* 运算是右结合的，这跟其它正常的运算符（也就是左结合运算符）都不一样。

```javascript
4 ** (3 ** 2);
// 计算等价
4 ** (3 ** 2);
```

#### 乘法表达式 MultiplicativeExpression

```javascript
*
/
%
```

#### 加法表达式 AdditiveExpression

```javascript
+
-
```

#### 移位表达式 ShiftExpression

```javascript
// 移位表达式由加法表达式构成，移位是一种位运算
<< 向左移位
>> 向右移位
>>> 无符号向右移位
```

移位运算把操作数看做二进制表示的整数，然后移动特定位数。所以左移 n 位相当于乘以 2 的 n 次方，右移 n 位相当于除以 2 取整 n 次。普通移位会保持正负数。无符号移位会把减号视为符号位 1，同时参与移位。

```javascript
-1 >>> 1; // 2147483647(2 的 31 次方)
```

#### 关系表达式 RelationalExpression

```javascript
<=
>=
<
>
instanceof
in
// <= 和 >= 关系运算，完全是针对数字的，所以 <= 并不等价于 < 或 ==
null <= undefined
//false
null == undefined
//true
```

#### 相等表达式 EqualityExpression

```javascript
==
!=
===
!==
```

类型不同的变量比较时==运算只有三条规则：

- undefined 与 null 相等；
- 字符串和 bool 都转为数字再比较；
- 对象转换成 primitive 类型再比较。

即：（一个是即使字符串与 boolean 比较，也都要转换成数字；另一个是对象如果转换成了 primitive 类型跟等号另一边类型恰好相同，则不需要转换成数字。）

```javascript
false == '0' // true
true == 'true' // false
[] == 0 // true
[] == false // true
new Boolean('false') == false // false
```

#### 位运算表达式

- 按位与表达式 BitwiseANDExpression
- 按位异或表达式 BitwiseANDExpression
- 按位或表达式 BitwiseORExpression。

按位与表达式由按位与运算符（&）连接按位异或表达式构成，按位与表达式把操作数视为二进制整数，然后把两个操作数按位做与运算。按位异或表达式由按位异或运算符（^）连接按位与表达式构成，按位异或表达式把操作数视为二进制整数，然后把两个操作数按位做异或运算。异或两位相同时得 0，两位不同时得 1。

```javascript
let a = 102,
  b = 324;

a = a ^ b;
b = a ^ b;
a = a ^ b;

console.log(a, b); // 324 102
```

异或运算有个特征，那就是两次异或运算相当于取消。所以有一个异或运算的小技巧，就是用异或运算来交换两个整数的值。

按位或表达式由按位或运算符（|）连接相等表达式构成，按位或表达式把操作数视为二进制整数，然后把两个操作数按位做或运算。

按位或运算常常被用在一种叫做 Bitmask 的技术上,Bitmask 相当于使用一个整数来当做多个布尔型变量，比如 Iterator API：

```javascript
var iterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT,
  null,
  false
);
var node;
while ((node = iterator.nextNode())) {
  console.log(node);
}
```

#### 逻辑与表达式和逻辑或表达式

逻辑与表达式由按位或表达式经过逻辑与运算符连接构成，逻辑或表达式则由逻辑与表达式经逻辑或运算符连接构成。

这两种表达式都不会做类型转换，所以尽管是逻辑运算，但是最终的结果可能是其它类型。

```javascript
false || 1; // 1
false && undefined; // false
true || foo(); // 短路
true && foo(); // 有时候喜欢用这个表达式来表示if逻辑判断和函数调用
```

#### 条件表达式 ConditionalExpression

由逻辑或表达式和条件运算符构成，条件运算符又称三目运算符，它有三个部分，由两个运算符?和:配合使用。

```javascript
condition ? branch1 : branch2;
```

#### Final

总结下 JavaScript 中所有的运算符优先级和结合性。

MDN 总结：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
