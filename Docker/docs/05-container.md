# Container

## run

启动容器，注意每次 run 都是启动一个新容器，如果只想对原有容器进行启停，可以使用 start/stop

```bash
# 如果没有 pull 过，docker run 会先去 pull
sudo docker run nginx

# 或 run 镜像 id
sudo docker run [image_id]
```

但这种命令会导致 terminal 窗口被占用，没法继续在 terminal 干别的事了

![](imgs/2025-07-12-12-37-19.png)

---

## run -d

更常见的是加 -d 表示在后台执行

```bash
sudo docker run -d nginx
```

---

## ps

```bash
# 查看正在 run 的容器
sudo docker ps

# 查看正在 run 和已经 stop 的容器
sudo docker ps -a
```

---

## run -p

正常启动时 localhost:80 是访问不到的，因为容器内的网络和宿主机网络是隔离的。使用 -p 命令把宿主机和容器的端口绑定

```bash
# 映射 [宿主机]:[容器] 的端口
sudo docker run -d -p 80:80 nginx
```

这时访问 http://localhost:80 就有内容了

---

## rm

```bash
# 删除容器，其中 -f 是强制删除，也可以用 --name 自定义的 container_name 来删
sudo docker rm -f [container_id]
```

---

## run -v

-v 是挂载卷技术

### 绑定挂载

把宿主机和容器的文件目录绑定，**容器内对文件夹的修改会影响宿主的文件夹，反之同理**

**作用：** 数据持久化保存，因为当删除容器时，容器内的数据也会被一起删除，使用挂载卷，容器内对应目录的数据就会保存在宿主机对应目录

```bash
sudo docker run -d -p 80:80 -v /website/html:/usr/share/nginx/html nginx

# 如在 windows 电脑上，把容器内 /usr/share/nginx/html 目录绑定到电脑 D:/Docker/data_nginx/html
# 但这时打开 http://localhost/ 会发现 403 了，这是因为使用挂载后，宿主机的目录会暂时覆盖掉容器内的目录
# 可以随便放一个 index.html 到宿主机的 D:/Docker/data_nginx/html，就会有内容了
sudo docker run -d -p 80:80 -v D:/Docker/data_nginx/html:/usr/share/nginx/html nginx
```

### 命名卷挂载

让 Docker 自动创建一个存储空间，我们为这个空间取名，接着使用 `-v 卷名:容器内的目录`

命名卷第一次使用时，**Docker 会把容器的文件夹同步到命名卷里进行初始化，而绑定挂载就没这个功能**

```bash
sudo docker volume create nginx_html
sudo docker run -d -p 80:80 -v nginx_html:/usr/share/nginx/html nginx
```

**查看挂载卷信息：**

```bash
# 查看这个挂载卷被 Docker 放在宿主机哪里
sudo docker volume inspect nginx_html
```

返回结果：
```json
[
    {
        "CreatedAt": "2025-07-12T06:02:33Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/nginx_html/_data",
        "Name": "nginx_html",
        "Options": null,
        "Scope": "local"
    }
]
```

> **注意：** 这个目录是在 Docker 引擎所在的宿主机的文件系统中，在 Windows 上是不能直接打开的，不是 Windows 直接可见的路径。Windows 上用的 Docker Desktop（基于 WSL2），这个路径实际上是 Linux 虚拟机（WSL2）内部的路径，不是 Windows 文件资源管理器能直接访问的

**管理挂载卷：**

```bash
# 查看挂载卷列表
sudo docker volume list

# 删除指定卷
sudo docker volume rm [volume_name]

# 删除所有没有任何容器在使用的卷
sudo docker volume prune -a
```

---

## run -e

往容器里传递环境变量，一般在 Docker hub 上找到对应镜像，文档里都会说有哪些参数

```bash
# 如传递 mongo DB 的账号密码
# 告诉 mongo DB 容器启动时，创建一个管理员用户，用户名是 aaa，密码是 bbb
sudo docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=aaa -e MONGO_INITDB_ROOT_PASSWORD=bbb mongo

# 这时再去连接可以连得上
sudo mongosh "mongodb://aaa:bbb@111.111.111.111:27017"
```

---

## run --name

给容器起自定义名字，这个名字**在宿主机必须的唯一的不能重复**

```bash
sudo docker run -d --name my_nginx nginx
```

---

## run -it --rm

这 2 个一般会一起使用，用于临时调试容器

- **rm:** 容器停止时自动删除
- **it:** 让控制台进入容器

```bash
sudo docker run -it --rm alpine # 进入后可以 ls 查看容器内文件夹，exit 退出
```

> **注意：** alpine 镜像默认启动一个 shell，所以可以直接进去交互式终端。但其他别的镜像如 nginx 默认启动服务进程，不是启动 shell，所以 `docker run -it --rm nginx` 没法进入交互式终端，需要指定 shell：

```bash
sudo docker run -it --rm nginx /bin/sh
```

![](imgs/2025-07-12-14-38-17.png)

---

## run --restart

配置容器在停止时的重启策略，一般在**生产环境很有用**

```bash
# 只要容器停止了就会立即重启，包含容器因为内部错误崩溃或宿主机断电等场景
sudo docker run -d --restart always nginx

# 效果类似 always，差异在手动启动的容器不会尝试重启，这对生产环境很有用
sudo docker run -d --restart unless-stopped nginx
```

---

## start/stop

如果只想对原有容器进行启停，可以使用 start/stop

> **注意：** 使用 stop/start 启停容器时，不需要再去传如 -p -e 等参数，Docker 已经保存下来了

```bash
# 先启动一个容器
sudo docker run ....

# 停止容器
sudo docker stop [container_id]

# 查看停止的容器
sudo docker ps -a

# 再次启动
sudo docker start [container_id]
```

---

## inspect

有时忘了之前启动容器时传了哪些参数，可以使用 inspect

```bash
# 会出一串非常长的数据，直接贴给 AI 让它看启动了什么参数，有没有传 -p 之类的
sudo docker inspect [container_id]
```

---

## create

和 run 用法一样，但只创建容器，不启动

```bash
sudo docker create -d -p 80:80 nginx
sudo docker start [container_id]
```

---

## logs

查看容器日志

```bash
sudo docker logs [container_id]

# 更常用，滚动查看
sudo docker logs [container_id] -f
```

---

## exec

在容器内部执行 linux 命令

```bash
# ps -ef 是查看进程的 linux 命令
sudo docker exec [container_id] ps -ef
```

![](imgs/2025-07-12-15-01-51.png)

---

## exec -it

进入正在运行的容器内部，获得一个交互式命令行环境，类似前面 run -it

```bash
# 进入容器内部
sudo docker exec -it [container_id] /bin/sh
```

![](imgs/2025-07-12-15-06-42.png)

但当我们在容器内使用如 `vi index.html` 时会发现 `vi` 不是可用命令。这是因为 Docker 为了尽量压缩镜像大小，内部是个极简的操作系统，很多工具都是缺少的，**需要自己安装**

### 在容器内安装工具

```bash
# 在容器内先运行如下命令查看容器 linux 发行版
cat /etc/os-release
```

输出示例（Debian）：
```bash
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
NAME="Debian GNU/Linux"
VERSION_ID="12"
VERSION="12 (bookworm)"
VERSION_CODENAME=bookworm
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

**安装 vim（Debian/Ubuntu）：**

```bash
# 先更新 apt 索引
apt update

# 安装 vim
apt install vim
```