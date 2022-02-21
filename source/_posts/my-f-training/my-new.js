/*
 * @Author: your name
 * @Date: 2022-01-26 10:52:36
 * @LastEditTime: 2022-01-26 13:57:57
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /hexo-yuque-blog/source/_posts/my-f-training/my-new.js
 */

function myNew(obj) {
  let res = {};
  if (obj.prototype != null) {
    res.__proto__ = obj.prototype;
  }
  let ret = obj.apply(res, Array.prototype.slice.call(arguments, 1));
  if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
    return ret;
  }
  return res;
}

let A = function (x, y) {
  this.x = x;
  this.y = y;
};

// let _obj = myNew(res, 22)

function mySettimeout(fn, t) {
  let timer = null;
  function interval() {
    fn();
    timer = setTimeout(interval, t);
  }
  interval();
  return {
    cancel: () => {
      clearTimeout(timer);
    },
  };
}
// let a = mySettimeout(() => {
//   console.log(111);
// }, 1000);
function New(func) {
  var res = {};
  if (func.prototype !== null) {
    res.__proto__ = func.prototype;
  }
  var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
  if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
    return ret;
  }
  return res;
}

function myNew2(fn, ...args) {
  let obj = Object.create(fn.prototype);
  let res = fn.call(obj, ...args);
  if (res && (typeof res === "object" || typeof res === "function")) {
    return res;
  }
  return obj;
}
var obj = myNew2(A, 1, 2);
// equals to
// var obj = new A(1, 2);

console.log(obj);

function flatter(args) {
  if (!args.length) return;
  return args.reduce(
    (pre, cur) =>
      Array.isArray(cur) ? [...pre, ...flatter(cur)] : [...pre, cur],
    []
  );
}
console.log(flatter([1, 2, [1, [2, 3, [4, 5, [6]]]]]));

function currying(fn, ...args) {
    const length = fn.length;
    let allArgs = [...args];
    const res = (...newArgs) => {
      allArgs = [...allArgs, ...newArgs];
      if (allArgs.length === length) {
        return fn(...allArgs);
      } else {
        return res;
      }
    };
    return res;
  }
  
  // 用法如下：
  const add = (a, b, c) => a + b + c;
  const a = currying(add, 1);
  console.log(a(2,3))
