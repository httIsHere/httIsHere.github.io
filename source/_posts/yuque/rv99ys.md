---
title: 「Taro3」 Taro@3.0.3内设置分享朋友圈时自定义内容（title，imageUrl）失效
urlname: rv99ys
date: '2020-08-27 14:02:46 +0800'
tags:
  - Taro
categories:
  - React
  - Taro
cover:
---

<!-- more -->

taro@3.0.3 内缺失相应的类型定义，在设置分享朋友圈自定义内容时导致自定义内容失效。
![](https://cdn.nlark.com/yuque/0/2020/png/250093/1598508174868-3cf8b356-4d70-43c8-aa33-8d1205b5af1d.png#align=left&display=inline&height=117&margin=%5Bobject%20Object%5D&originHeight=117&originWidth=787&size=0&status=done&style=none&width=787)

解决：
• 升级至 3.0.3 以上；
• 在`global.d.ts`内添加缺失的类型定义，并在需要分享朋友圈的页面配置文件内添加`enableShareTimeline: true`。

```typescript
// global.d.ts
declare module "*.json" {
  const value: any;
  export default value;
}
declare module "@tarojs/taro" {
  interface PageConfig {
    /**
     * 是否启用分享给好友。
     *
     * @default false
     */
    enableShareAppMessage?: boolean;
    /**
     * 是否启用分享到朋友圈。
     *
     * @default false
     */
    enableShareTimeline?: boolean;
  }
}
```

参考#7055: [https://github.com/NervJS/taro/pull/7055](https://github.com/NervJS/taro/pull/7055)

注：
设置自定义分享时 query 需要采用 object 的形式。

```javascript
  // 分享朋友圈
  onShareTimeline(res) {
    let { detail, user_info, is_myRep, work_pos } = this.state;
    return {
      // 这是我创作的第3幅作品，获得了5星评价，快来给我点赞吧
      title: `这是我创作的第3幅作品，获得了5星评价，快来给我点赞吧`,
      // query: `is_fromShare=true&id=${detail.id}`,
      query: {is_fromShare: true, id: detail.id},
      imageUrl: detail.work_img
    };
  }
```

效果：
![](https://cdn.nlark.com/yuque/0/2020/png/250093/1598508174936-a76ce0a5-32de-43ea-b493-8983e89ff680.png#align=left&display=inline&height=226&margin=%5Bobject%20Object%5D&originHeight=226&originWidth=352&size=0&status=done&style=none&width=352)
