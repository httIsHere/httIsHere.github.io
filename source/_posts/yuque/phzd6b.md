---
title: 「Daily」本地添加多个github账户
urlname: phzd6b
date: '2022-02-22 16:11:52 +0800'
tags:
  - Daily
  - 配置
categories:
  - Daily
cover:
---

## 设置 RSA

每个账户都需要设置一个密钥。

```basic
# 找不到就说明还未创建ssh
cd ~/.ssh

# 使用自己的邮箱，然后根据自己的需求选择创建的目录等
ssh-keygen -t rsa -C xxxx@xxx.com

# 打开ssh key目录，查看id_rsa.pub这个文件并打开拷贝key值
open ~/.ssh
```

PS：每个密钥的命名不同，否则会被覆盖。
​

打开公钥复制并将其添加进相应的 Github 账户内。
​

### 添加私钥

将刚才生成的密钥进行添加。

```basic
ssh-add ~/.ssh/id_rsa

# 或者

ssh-add ~/.ssh/id_rsa_htt
```

## Config 文件配置

在当前目录下新建`config`文件，并将**账户信息进行配置**：

```basic
# Host后的内容自定义
Host TinaHuang0183.github.com
HostName github.com
User TinaHuang0183
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa # 对应的私钥文件

Host httIsHere.github.com
HostName github.com
User httIsHere
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_htt
```

## 命令操作

### ssh clone

需要将`@`和`:`之间的内容替换为配置的`Host`后的内容再进行 clone，这样才会正确访问到私钥。
比如需要拷贝 hexo-yuque-blog 这个项目，首先复制其 SSH 链接：

```git
git@github.com:httIsHere/hexo-yuque-blog.git
```

现改为：

```git
git@httIsHere.github.com:httIsHere/hexo-yuque-blog.git
```

### pull, push 等

需要将项目 git 配置的账户设置为当前项目所属账户。

```git
[user]
	name = httIsHere
	email = 178******39@163.com

```

![截屏2022-02-22 下午5.32.01.png](https://cdn.nlark.com/yuque/0/2022/png/250093/1645522441124-8b68cba7-e1cb-46c6-bdd0-071327180111.png#clientId=u612d8334-bcdd-4&crop=0&crop=0&crop=1&crop=1&from=drop&id=uf6c55a74&margin=%5Bobject%20Object%5D&name=%E6%88%AA%E5%B1%8F2022-02-22%20%E4%B8%8B%E5%8D%885.32.01.png&originHeight=616&originWidth=1224&originalType=binary∶=1&rotation=0&showTitle=false&size=144783&status=done&style=none&taskId=u8f01e9f2-d425-4e01-9174-6c2ca88be69&title=)
