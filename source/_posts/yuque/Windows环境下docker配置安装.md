---
title: Windows环境下docker配置安装
urlname: qen7rl
date: 2020-02-02 20:30:04 +0800
tags: []
categories: []
---

tags: [docker, 配置]
categories: [docker]
cover:

---

<!-- more -->

1. 开启 cpu 虚拟化

在任务管理器 → 性能 → 选择 CPU → 右侧“虚拟化”属性查看是否开启，若未开启虚拟化，则重启电脑时长按 F1/F12（根据电脑类型不同自行查询）进入 dios 模式，在 Configuration 选项或者 Security 选项下找到 Virtualization，进入 Virtualization 后将` Intel (R) ``Virtualization Technology `属性值设为 Enable。
![vm.PNG](https://cdn.nlark.com/yuque/0/2020/png/250093/1580649379168-febc0a55-5cae-4303-81cd-8df2990aedcf.png#align=left&display=inline&height=304&margin=%5Bobject%20Object%5D&name=vm.PNG&originHeight=304&originWidth=647&size=15454&status=done&style=none&width=647)

2. [docker 官网](https://hub.docker.com/editions/community/docker-ce-desktop-windows)下载安装 docker（系统用户名必须为英文）（下载地址：[Docker for Windows](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)）

网盘：

```
链接：https://pan.baidu.com/s/1p8e_IBY6qLgMu_Msz_0n-A
提取码：v4ug
```

errors：

1. start 失败
   ![error.PNG](https://cdn.nlark.com/yuque/0/2020/png/250093/1580651886751-15bbd2e4-ae11-439e-a3da-ab50d1928a3a.png#align=left&display=inline&height=866&margin=%5Bobject%20Object%5D&name=error.PNG&originHeight=866&originWidth=1018&size=155367&status=done&style=none&width=1018)
   原因：docker 不支持 Windows 家庭版。
   解决：将 Windows 家庭版升级为企业版或者专业版并激活。

3) 设置 docker 的 shared dives（工作区），电脑需要设置开机密码

4. 拉取 local-dev-env 和项目代码库，两者文件夹平级，并在 local-dev-env\dpcker-compose.yml 内增加项目配置

例如：

```yaml
maestro-api-gateway:
  image: registry.cn-hangzhou.aliyuncs.com/duojii/nginx-php-fpm-alpine
  environment:
    # 详细环境变量作用请查看 git@lqbyun.com:devops/nginx-php-fpm-alpine.git 里的 scripts/start.sh
    WEBROOT: "/var/www/html/public" # 网站根目录
    ERRORS: 1 # 是否显示错误，PHP 层级
    RUN_SCRIPTS: 1 # 是否运行启动脚本，一般来说是代码库下 scripts 目录下的脚本
    ENABLE_XDEBUG: 1 # 是否启动 xdebug
    XDEBUG_CONFIG: "remote_host=192.168.0.113" # 设置远程调试主机地址，一般来说为宿主机地址
    XDEBUG_PORT: 9001 # xdebug 端口，默认开启
    PUID: 1000 # 设置容器中 nginx 用户的 uid，最好是和本机的当前用户 uid 保持一致，否则在 Linux,OSX环境下可能会出现权限问题
    PGID: 1000 # 设置容器中 nginx 用户的 gid
  volumes:
    - E:/httishere/work/maestro-api-gateway:/var/www/html # 宿主机代码目录映射到容器中
  ports:
    - "8015:80"
```

5. docker 登录

```git
docker login registry.cn-hangzhou.aliyuncs.com
// 在Windows系统下须在最前面增加winpty
```

![docker-login.PNG](https://cdn.nlark.com/yuque/0/2020/png/250093/1580657621970-6de2bb85-4817-47e8-be31-d98df37a0ed1.png#align=left&display=inline&height=100&margin=%5Bobject%20Object%5D&name=docker-login.PNG&originHeight=100&originWidth=770&size=10424&status=done&style=none&width=770)

6. 进入 local-dev-env 在后台启动并运行所有的容器：`docker-compose up -d`

将 docker 镜像设置为国内镜像加快速度，网易镜像比较快`http://hub-mirror.c.163.com`

7. 首次添加项目时需要进入项目容器安装项目依赖

```git
docker-compose exec program_name bash
composer install
```

![composerinstall.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1580710175621-5e102702-9f06-43e3-a74b-251e359d5e4f.png#align=left&display=inline&height=411&margin=%5Bobject%20Object%5D&name=composerinstall.png&originHeight=411&originWidth=906&size=44255&status=done&style=none&width=906)
若 composer install 速度较慢可使用国内镜像加快速度，`composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/`，[https://developer.aliyun.com/composer](https://developer.aliyun.com/composer)。

8. docker 后台服务运行成功后，进入项目目录，并`npm install`  安装依赖

errors：

1. 安装失败，报错 npm ERR! code Z_BUF_ERROR
   ![npm-install.PNG](https://cdn.nlark.com/yuque/0/2020/png/250093/1580698180249-a44d4b92-4f8c-4632-8081-614af727c9dc.png#align=left&display=inline&height=184&margin=%5Bobject%20Object%5D&name=npm-install.PNG&originHeight=184&originWidth=1195&size=14578&status=done&style=none&width=1195)
   解决：清除 npm 缓存

```git
npm cache clean --force
```

![cache.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1580698282547-df9678d5-fd2a-41e1-9f8a-2f26a30c79f3.png#align=left&display=inline&height=267&margin=%5Bobject%20Object%5D&name=cache.png&originHeight=267&originWidth=766&size=19726&status=done&style=none&width=766)

9. 使用`yarn watch` 监听项目代码更改

> 准则：多喝热水，重启试试。
