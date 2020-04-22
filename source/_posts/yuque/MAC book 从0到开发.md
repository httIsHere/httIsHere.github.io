
---

title: MAC book 从0到开发

urlname: ovolxl

date: 2020-04-21 10:56:45 +0800

tags: []

categories: []

---
<a name="QFqNQ"></a>
## node


> [https://nodejs.org/en/download/](https://nodejs.org/en/download/) 下载node安装包

点击安装成功之后，在命令行输入node -v检查是否成功安装：<br />![截屏2020-04-21下午1.37.12.png](https://cdn.nlark.com/yuque/0/2020/png/250093/1587447473899-35e0b89f-9835-4df6-bfe1-d33f4170f411.png#align=left&display=inline&height=55&margin=%5Bobject%20Object%5D&name=%E6%88%AA%E5%B1%8F2020-04-21%E4%B8%8B%E5%8D%881.37.12.png&originHeight=110&originWidth=2160&size=76268&status=done&style=none&width=1080)
<a name="pStNy"></a>
## git


> [https://git-scm.com/downloads](https://git-scm.com/downloads) 下载git安装包


<br />下载成功后双击pkg文件弹出无法安装的弹窗，需要按住control同时点击pkg文件。<br />安装后，在命令行输入git检查git是否安装成功，成功后在命令行配置git信息：<br />

- 创建ssh key
```basic
# 找不到就说明还未创建ssh
cd ~/.ssh 

# 使用自己的邮箱，然后根据自己的需求选择创建的目录等
ssh-keygen -t rsa -C xxxx@xxx.com

# 打开ssh key目录，查看id_rsa.pub这个文件并打开拷贝key值
open ~/.ssh
```
登录github并在设置中创建ssh粘贴刚刚复制的ssh key。
```basic
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```


<a name="rbdUA"></a>
## docker
> [https://www.docker.com](https://www.docker.com) 下载安装docker

同样的等待安装完成并启动，启动成功之后，将docker镜像设置为国内镜像加快速度，网易镜像比较快`[http://hub-mirror.c.163.com](http://hub-mirror.c.163.com)。`
```json
{
  "registry-mirrors": [
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn",
    "http://f1361db2.m.daocloud.io"
  ],
  "insecure-registries": [],
  "debug": true,
  "experimental": false
}
```
进入配置文件目录，启动所有容器：
```basic
docker-compose up -d
```
发生以下报错：<br />ERROR: Get [https://docker-registry.lanqb.com/v2/:](https://docker-registry.lanqb.com/v2/:) net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)<br />原因：项目镜像源错误。
```yaml
  maestro-api-gateway:
    image: registry.cn-hangzhou.aliyuncs.com/duojii/nginx-php-fpm-alpine
    environment:
      WEBROOT: '/var/www/html/public'
      ERRORS: 1
      RUN_SCRIPTS: 0
      ENABLE_XDEBUG: 1
      XDEBUG_CONFIG: "remote_host=192.168.1.133"
      XDEBUG_PORT: 9015
      PUID: 1000
      PGID: 1000
    volumes:
      - /Users/httishere/workspace/maestro-api-gateway:/var/www/html
    ports:
      - "8015:80"
```



