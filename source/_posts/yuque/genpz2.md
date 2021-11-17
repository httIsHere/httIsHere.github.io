---
title: 「ROAD 6」编程语言通识与JavaScript语言设计
urlname: genpz2
date: '2021-08-16 15:28:27 +0800'
tags:
  - ROAD 6
categories:
  - 大前端
---

> 语言按语法分类
>
> - 非形式语言
> - 形式语言（乔姆斯基谱系）
>   - 0 型：无限制文法（?::=?）
>   - 1 型：上下文相关文法(?[?::=?**?)**]()
>   - 2 型：上下文无关文法([::=?)]()
>   - 3 型：正则文法([::=]()[?)]()

文法：词法和语法。

#### 产生式（BNF）

- 用尖括号括起来的名字来表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的复合结构
  - 基础结构称终结符
  - 复合结构称非终结符
- 引号和中间的字符表示终结符
- 可以有括号
- \*表示重复多次
- ｜表示或
- +表示至少一次

```bash
# 可以用BNF来定义一些东西，比如加法

<Number>: "0" | "1" | "2" | ... | "9"
# 十进制数，即0或者1-9开头加任何数字
<DecimalNumber>: "0" | (("1" | "2" | ... | "9")<Number>*)
# 加减法表达式
<AdditiveExpression>: <DecimalNumber> | <Expression> "+" <DecimalNumber> ｜ <Expression> "-" <DecimalNumber>

## 四则运算
# 乘法除法
<MultiplicativeExpression>: <DecimalNumber> |
	<MultiplicativeExpression> "*" <DecimalNumber> ｜
	<MultiplicativeExpression> "/" <DecimalNumber>
# 然后根据运算符的优先级又可以优化“加法表达式”
<AdditiveExpression>: <MultiplicativeExpression> | <AdditiveExpression> "+" <MultiplicativeExpression> ｜ <AdditiveExpression> "-" <MultiplicativeExpression>
# 逻辑运算
<LogicalExpression>: <AdditiveExpression> |
	<LogicalExpression> "||" <AdditiveExpression> |
	<LogicalExpression> "&&" <AdditiveExpression>

# 在实际四则运算过程中会遇到"()"，且括号的优先级会高于乘除法
<PrimaryExpression>: <DecimalNumber> | "(" <LogicalExpression> ")"
```

    其中引号内容为终结符即基础结构，`AdditiveExpression`等则是非终结符。

```bash
# 使用正则进行预处理
<DecimalNumber> = /0|[1-9][0-9]*/
```

#### 其他产生式

> EBNF ABNF Customized

#### 动态&静态

- 动态
  - 在用户的设备/在线服务器上
  - 产品实际运行时
  - Runtime
- 静态
  - 在程序员的设备上
  - 产品开发时
  - Compiletime

#### 类型系统

- 动态类型系统与静态类型系统
- 强类型与弱类型
  - String + Number （隐式类型转换）
  - String == Boolean
- 复合类型
  - 结构体
  - 函数签名
- 子类型
  - 逆变/协变

#### 一般命令式编程语言

> Atom -> Expression -> Statement -> Structure -> Program
