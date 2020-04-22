
---

title: Vue-cli3构建静态网站页面

urlname: uiq7gi

date: 2020-04-11 14:44:41 +0800

tags: []

categories: []

---
1. 请求本地json数据

在vue-cli3中，存放静态资源的位置在public文件夹内，所以需要在项目根目录下创建public文件，并存放相应的json文件，然后使用axios进行请求。
```javascript
this.$axios.get('/api/info-card.json').then(res => {})
```


2. vue cli3 UI控制台
```bash
vue ui
```


3. 全局使用less变量

使用 `style-resources-loader`，在vue.config.js内：
```json
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/theme/global.less')]
    }
  }
```

<br />


