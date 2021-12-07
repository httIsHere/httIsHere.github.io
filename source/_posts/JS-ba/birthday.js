/*
 * @Author: httishere
 * @Date: 2021-12-03 11:45:44
 * @LastEditTime: 2021-12-03 15:14:54
 * @LastEditors: Please set LastEditors
 * @Description: 生日文案
 * @FilePath: /hexo-yuque-blog/source/_posts/JS-ba/birthday.js
 */
function life(age) {
  let alive = true, datetime = new Date();
  function makeBirthdayCake() {
    let args = [...arguments];
    let bday_cake = args.join(", ");
    return bday_cake;
  }
  if (alive && datetime.getMonth() + 1 === 12 && datetime.getDate() === 3) {
    console.log(`我${age}啦！`)
    age++;
    makeBirthdayCake("flour", "eggs", "cream", "chocolate", "strawberry");
    setTimeout(() => {
      life(age)
    }, 365 * 24 * 60 * 60 * 1000);
  }
}

life(26); 
