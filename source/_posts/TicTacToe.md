---
title: 「编程训练」 TicTacToe
date: 2022-01-14 13:44:02
tags:
  - ROAD 6
categories:
  - 大前端
---

![](https://gitee.com/httishere/blog-image/raw/master/img/20220114134624.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TicTacToe</title>
    <style type="text/css">
      .item {
        width: 100px;
        height: 100px;
        border: 1px solid #ffffff;
        text-align: center;
        line-height: 100px;
        font-size: 36px;
        display: inline-block;
        background: gray;
        vertical-align: middle;
      }
    </style>
  </head>
  <body>
    <div class="box" id="box">
      <!-- <div class="row" id="row-0">
            <div class="item" id="item-0"></div>
            <div class="item" id="item-1"></div>
            <div class="item" id="item-2"></div>
        </div>
        <div class="row" id="row-1">
            <div class="item" id="item-3"></div>
            <div class="item" id="item-4"></div>
            <div class="item" id="item-5"></div>
        </div>
        <div class="row" id="row-2">
            <div class="item" id="item-6"></div>
            <div class="item" id="item-7"></div>
            <div class="item" id="item-8"></div>
        </div> -->
    </div>
  </body>
  <script>
    let pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let cur_obj = 1, winner = 0;

    function showTicTacToe(pattern) {
      let ele = document.getElementById("box");
      ele.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        let status = pattern[i] === 2 ? "❌" : pattern[i] === 1 ? "⭕️" : "";
        let _item = document.createElement("span");
        _item.classList.add('item');
        _item.innerHTML = status;
        _item.addEventListener("click", () => move(i, pattern))
        ele.appendChild(_item);
        if (i % 3 === 2) {
          ele.appendChild(document.createElement("br"));
        }
      }
    }
    function move(i, pattern) {
        if(pattern[i] || winner) return;
        pattern[i] = cur_obj;
        let _status = pattern[i] === 2 ? "❌" : pattern[i] === 1 ? "⭕️" : "";
        if(checkTicToe(i, pattern)) {
            alert(`${_status} is winner`);
            winner = pattern[i];
        }
        // 重刷
        showTicTacToe(pattern);
        if(willWin(pattern, cur_obj)) {
            console.log(`${_status} will win`)
        }
        cur_obj = 3 - cur_obj;
    }

    function computeMove() {
      let choice = bestChoice(pattern, cur_obj);
      if(choice.point) {
        pattern[choice.point] = cur_obj;
        showTicTacToe(pattern);
      }
    }

    function checkTicToe(i, pattern) {
        let status = pattern[i], _status = status === 2 ? "❌" : status === 1 ? "⭕️" : "";
        // 根据当前落子来判断
        // 上下左右
        let flag = true;
        let col = i % 3, row = Math.floor(i / 3), sum1 = true, sum2 = true, sum3 = false;
        // 纵横
        for(let j = 0; j < 3; j++) {
            sum1 = sum1 && (pattern[j * 3 + col] === status);
            sum2 = sum2 && (pattern[row * 3 + j] === status);
        }
        // 交叉方向，需要先判断中心点只有在中心点才可能成功
        if(pattern[4] && pattern[4] === cur_obj) {
            sum3 = true;
            sum3 = (pattern[0] === cur_obj && pattern[8] === cur_obj) || (pattern[2] === cur_obj && pattern[6] === cur_obj);
        }
        flag = sum1 || sum2 || sum3;
        return flag;
        // 交叉
    }
    function clone(pattern) {
      return JSON.parse(JSON.stringify(pattern))
    }
    // 辅助判断
    function willWin(pattern, cur_obj) {
        for(let j = 0; j < 9; j++) {
            if(pattern[j] || pattern[j] === cur_obj) continue;
            pattern[j] = cur_obj;
            if(checkTicToe(j, pattern)) {
                pattern[j] = 0;
                return j.toString(); // 0的特殊情况
            }
            pattern[j] = 0;
        }
        return null;
    }
    function willLose(pattern, cur_obj) {
        if(willWin(pattern, cur_obj)) return false;
    }

    let openings = new Map();
    openings.set([0, 0, 0, 0, 0, 0, 0, 0, 0].toString() + "1", {
      point: 4,
      result: 0
    });

    function bestChoice(pattern, cur_obj) {
      if(openings.has(pattern.toString() + "1")) return openings.get(pattern.toString() + "1")
      let point = null
      if(point = willWin(pattern, cur_obj)) {
        return {
          point,
          result: 1
        }
      }
      let result = -1;
      for(let j = 0; j < 9; j++) {
        if(pattern[j] !== 0) continue;
        let tmp = clone(pattern);
        tmp[j] = cur_obj;
        let oppo = bestChoice(tmp, 3 - cur_obj); // 对手状态
        if(- oppo.result >= result) { 
          point = j;
          result = - oppo.result;
        }
        if(result === 1) break;
      }
      return {
        point,
        result: point ? result : 0, // -1: lose, 1: win, 0: 平手
      }
    }

    showTicTacToe(pattern);
  </script>
</html>

```