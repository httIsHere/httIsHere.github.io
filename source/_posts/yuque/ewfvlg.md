---
title: 「js」记录一下滚动抽奖逻辑
urlname: ewfvlg
date: '2020-11-03 16:18:15 +0800'
tags:
  - daily
categories:
  - Daily
---

> 记录日常问题

<!-- more -->

在实现活动页的时候经常会遇到要写滚动抽奖游戏的需求，类似如下，按顺时针滚动：

|  0  |    1     |  2  |
| :-: | :------: | :-: |
|  7  | 抽奖按钮 |  3  |
|  6  |    5     |  4  |

#### 思路：根据定位索引判断结束点。

一般情况下，会有一个奖品个数 award_num（比如上图就是 8 个），默认的滚动圈数 default_times，在默认滚动圈数 default_times 完成后进行结果 result 定位，所以当前累计的滚动次数 interval_times 要大于等于默认滚动次数 default_times，对结果定位就是使累计次数对奖品个数取余，如果相同则定位正确：

```javascript
if (interval_times >= default_times && interval_times % award_num === result) {
  // 定位到结果奖品
}
```

完整代码：

```javascript
function postLottery() {
  const _this = this;
  let result = -1, // 结果索引
    interval_index = 0,
    lottery_index = 0, // 当前定位索引
    award_num = 8,
    _times = award_num * 2,
    _speed = 100;
  let lotteryInterval = setInterval(roundFunction, _speed);
  function roundFunction() {
    if (result > -1) {
      // ^ 接口产生结果，判断并定位结果
      if (interval_index >= _times && interval_index % award_num === result) {
        clearInterval(lotteryInterval);
        setTimeout(() => {
          // 展示结果
        }, 300);
        return;
      }
    }
    lottery_index = lottery_index === award_num - 1 ? 0 : lottery_index + 1;
    interval_index++;
  }
  // 抽奖post请求，异步获取结果result
  $.ajax({
    type: "POST",
    url: "...",
    dataType: "json",
    headers: _this.getRequestHeaders(),
    success: function (res) {
      result = res.result; // 请求抽奖结果
    },
    error: (err) => {
      showMessage("抽奖失败", 2000, true);
    },
  });
}
```

#### 新优化：动态改变滚动速度，提高用户体验

然后此时为了更好的用户体验需求又来了，为了增加紧张感需要进行动态的改变滚动速度，快要结束时速度变慢。
以上图为例，定位到结果前 4（n）个开始速度变慢。
思路：在还剩最后一圈时候对当前定位进行判断，所以需要在结果出来之后先计算定位到结果需要的滚动次数 total_times，需要在结果前 n 个开始速度变慢，那么在最后一圈的时候需要当前是否为前第 n 个：

```javascript
if (
  total_times - interval_times >= award_num &&
  Math.abs((interval_times % award_num) - result) === n
) {
  // 当前可以开始改变速度
}
```

完整代码：

```javascript
function postLottery() {
  const _this = this;
  let result = -1,
    init_result = 0,
    total_interval = 0, // 定位结果需要的总次数
    lottery_index = 0,
    interval_index = 0,
    award_num = 8,
    _times = award_num * 2,
    _speed = 100,
    slow_index = 4; // 速度需要变慢的地方
  let lotteryInterval = setInterval(roundFunction, _speed);
  function roundFunction() {
    if (result > -1) {
      if (!init_result) {
        // ^ 结果产生时，先计算当前累计滚动次数
        total_interval = roundTotal(interval_index, _times, result);
      }
      init_result = true;
      // ! 产生结果后判断需要速度变慢的位置
      // TODO 计算最后一圈
      if (
        total_interval - interval_index <= award_num &&
        Math.abs(result - (interval_index % award_num)) === slow_index
      ) {
        _speed = 300; // 改变速度
        clearInterval(lotteryInterval);
        lotteryInterval = setInterval(roundFunction, _speed);
      }
      // ^ 接口产生结果
      if (interval_index >= _times && interval_index % award_num === result) {
        clearInterval(lotteryInterval);
        setTimeout(() => {
          // 展示结果
        }, 300);
        return;
      }
    }
    lottery_index = lottery_index === award_num - 1 ? 0 : lottery_index + 1;
    interval_index++;
  }
  // & 计算滚动到结果需要的累计次数
  function roundTotal(current, _times, result) {
    let total = 0;
    if (current <= _times) {
      total = _times + result;
    } else {
      total = current + Math.abs(award_num - result);
    }
    return total;
  }
  // 抽奖post请求，异步获取结果result
  $.ajax({
    type: "POST",
    url: "...",
    dataType: "json",
    headers: _this.getRequestHeaders(),
    success: function (res) {
      result = res.result; // 请求抽奖结果
    },
    error: (err) => {
      showMessage("抽奖失败", 2000, true);
    },
  });
}
```
