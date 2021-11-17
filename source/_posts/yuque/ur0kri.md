---
title: 「ROAD 6」浏览器原理-CSS计算
urlname: ur0kri
date: '2021-09-28 17:07:22 +0800'
tags:
  - ROAD 6
categories:
  - 大前端
---

> 主要分析将 DOM 树加上 CSS 规则的步骤。

### STEP 0: 环境准备

```bash
npm install css
```

[CSS](https://www.npmjs.com/package/css)库

### STEP 1: 收集 CSS 规则

- 遇到 style 标签时，需要将 CSS 规则保存收集；
- 调用 CSS parser 分析 CSS 规则；
- 必须仔细研究此库分析 CSS 规则的格式；

### STEP 2: 添加调用

- 创建元素之后，**立即计算 CSS**`cssComputer.computeCss(element);`；
- 理论上，当分析一个元素时，所有的 CSS 规则已经收集完毕；
- 在真实浏览器中，可能遇到写在 body 内的 style 标签，需要重新进行 CSS 计算的情况，但在这里我们进行忽略（CSS 重新计算，重排，重绘，所以需要在编写代码时需要将 style 写在所有元素最前面）；

### STEP 3: 获取父元素序列

```javascript
let elements = stack.slice().reverse();
```

- 在 computeCSS 函数内，必须知道元素的所有父元素才能判断元素与规则是否匹配；
- 从上一步骤的 stack 内可以获取本元素的所有元素；
- 因为我们首先获取的事“当前元素”，所以**获取和计算父元素匹配的顺序是从内向外**；

### STEP 4: 拆分选择器

- 选择器也需要从当前元素向外排列；
- 复杂选择器需要拆成针对单个元素的选择器，用**循环来匹配父元素队列**；

### STEP 5: 计算选择器与元素匹配

- 根据选择器的类型和元素属性，计算是否与当前元素匹配；
- 该 toy-browser 仅实现三种基本选择器，实际浏览器中要处理更复杂的复合浏览器；

### STEP 6: 生成 computed 属性

- 一旦选择匹配，就应用选择器到元素上，形成 computedStyle；

PS：可能会涉及到**选择器的优先级（specificity）**。

### STEP 7: 确定规则覆盖关系

选择器优先级的计算和比较。

### 基本代码

```javascript
// css-computed.js
const css = require("css");
let rules = [];

// **** 添加CSS规则 **** //
function addCSSRules(text) {
  let ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, "    "));
  rules.push(...ast.stylesheet.rules);
}

// *** 针对对象：元素 **** //
function computeCss(element, stack) {
  // console.log(JSON.stringify(rules, null, " "));
  // & 使用slice避免污染原始stack
  let elements = stack.slice().reverse();
  // console.log(elements)

  if (!element.computeStyle) element.computeStyle = {};

  // 遍历所有规则
  for (let rule of rules) {
    // console.log(JSON.stringify(rule, null, " "));
    // 全部选择器
    let selectorParts = rule.selectors[0].split(" ").reverse();

    // ! 匹配当前元素
    if (!match(element, selectorParts[0])) continue;

    console.log(
      "matched element: " + element.tagName + " and " + selectorParts[0]
    );

    // ^ 已经匹配到当前“元素”

    let matched = false; // 每条规则的标识

    // & 双循环检查父元素是否匹配
    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) matched = true;

    if (matched) {
      // ^ 计算当前的选择器优先级
      let sp = specificity(rule.selectors[0]);
      // 如果匹配到，将规则加入element
      // console.log(`Element: ${element}, rule: ${rule}`);
      let computeStyle = element.computeStyle;
      for (let declaration of rule.declarations) {
        if (!computeStyle[declaration.property]) {
          computeStyle[declaration.property] = {};
        }
        // ^ 可能会出现样式覆盖
        computeStyle[declaration.property].value = declaration.value;
        if (!computeStyle[declaration.property].specificity) {
          computeStyle[declaration.property].specificity = sp;
        } else if (
          (compare(computeStyle[declaration.property].specificity), sp)
        ) {
          computeStyle[declaration.property].specificity = sp;
        }
        computeStyle[declaration.property].value = declaration.value;
      }
      element.computeStyle = computeStyle;
      // {color: {value: …}, font-size: {value: …}}
    }
  }
}

// *** 匹配元素 *** //
function match(element, selector) {
  if (!selector || !element.attributes) return false;

  // ^ 简单处理，仅判断id选择器，class选择器和标签选择器
  if (selector.charAt(0) === "#") {
    let attr = element.attributes.filter((attr) => attr.name === "id");
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    let attr = element.attributes.filter((attr) => attr.name === "class");
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
    // ? class还可以使用空格，所以后续可以补充有空格的情况匹配
    // ? 难道不会被split嘛？
  } else if (element.tagName === selector) {
    return true;
  }
}

// *** 计算优先级 *** //
function specificity(selector) {
  // 从高到低
  // 0 表示行内样式，最高优先级
  let p = [0, 0, 0, 0]; // ! 表示当前的优先级
  let selectorParts = selector.split(" ");
  for (let part of selectorParts) {
    if (part.charAt(0) === "#") {
      p[1] += 1;
    } else if (part.charAt(0) === ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

// *** 比较优先级 *** //
function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) return sp1[0] - sp2[0];
  if (sp1[1] - sp2[1]) return sp1[1] - sp2[1];
  if (sp1[2] - sp2[2]) return sp1[2] - sp2[2];
  return sp1[3] - sp2[3];
}

module.exports = {
  rules,
  addCSSRules,
  computeCss,
};
```
