# Docker

虚拟机属于虚拟化技术，但是占有服务器资源较多，需要虚拟内存和 CPU，占有服务器大量资源，启动慢

Docker 容器技术是轻量级的虚拟化，它不需要虚拟出整个操作系统，只需要虚拟一个沙箱的小规模的环境，容器之间可共享同一个操作系统，资源利用率高，占用小，启动快

容器可以理解为一个集装箱，每个集装箱之间互不影响，每个集装箱都有自己的环境（如 node 环境、ubuntu 环境、nginx 服务），我们在容器里编写应用，再将自己的应用打包后，就可以在其它地方用 Docker 启动，而不会一个应用换了个环境，本来本地可以，测试环境就不行了

## 安装

[Docker](https://jspang.com/detailed?id=75#toc293)

## 基本命令

```sh
docker --version # 查看版本
docker network ls # 查看 local 网络信息
```

## Image 镜像

[官方地址](https://hub.docker.com/)

[第三方 Red Hat](https://quay.io/)

```sh
Docker Hub：
账号：karmiy
密码：karmiy@123
```

```sh
docker image # 查看镜像可用命令
docker image ls # 查看安装的镜像
docker image pull wordpress # 拉取 wordpress 镜像，image pull 是新版本支持，老版本为 docker pull wordpress，Red Hat 的镜像可在其官方复制，一般为 quay.io/xxx
docker image pull wordpress:beta-php8.1-fpm-alpine # 下载指定版本，可用在 Docker Hub 上找到 wordpress 后，Tags 里有全部版本，选择一个
docker image inspect 4f7 # 查看镜像信息（ls 可查看 IMAGE ID）
docker image rm 4f7 04a # 删除镜像
docker image save wordpress:latest -o mywordpress.image # 导出镜像到当前目录，: 冒号后跟 tag 版本，命名为 mywordpress
docker image load -i ./mywordpress.image # 导入镜像
docker image tag mywordpress kealm/mywordpress # 将镜像中 mywordpress 拷贝一份镜像命名为 kealm/mywordpress（image ls 后可以看到 2 个镜像 IMAGE ID 是一样的）
docker image history a5c # 查看镜像的分层（打包时每个指令生成的层的资源大小）
docker image prune -a # 删除全部镜像
```

> 我的理解是：docker 打包出来的镜像，内部是一个独立容器，容器里是一个类似 Linux 环境的空间，可以使用 -it 命令进入，并使用 shell 命令对这个空间进行操作，如 cd /app/index.js，node ./index.js 启动一个 node 服务

通常选择镜像的原则在于：

- 官方镜像（有个 Official Image 标记的）优于非官方的镜像

- 固定版本的 Tag，而不是每次都使用 latest

- 功能满足，选择体积小的镜像（如 `alpine` 版，体积非常小，是一款独立的非商业性的通用 Linux 发行版，关注安全性、简单性和资源效率）

## 容器常用命令

```sh
docker container run nginx # 创建名 nginx 的容器，以 attached 前台运行模式
docker container run -d --name my-nginx nginx # 命名为 my-nginx
docker container run -d nginx # detached 后台运行模式，防止不小心 ctrl + c 、exit、关窗口后把容器关了，-d 全程 --detach，通常生产环境会这样做，开发环境还是会用前台模式，可以看到实时日志
docker container attach 5df # 后台运行模式转前台
docker container run -it nginx sh # 使用交互模式，并使用 shell 命令控制，会出现个 #，可以对它进行交互操作，如 ls、clear、hostname，不过 exit 时退出会把容器也关了
docker container run -d -p 80:80 nginx # 端口映射，如容器内部启动了 nginx，因为在容器内外网是访问不到的，需要做端口映射（服务器端口:容器断开）
docker container run --rm -it nginx # --rm 即关闭时自动删除容器
docker container exec -it 3k81 sh # 进入交互模式，一般配合先 run -d 后台运行，执行此命令，这样 exit 就不会把容器关了
docker container start [hash]/[name] # 如 docker container run -it --name nginx nginx 在 exit 后，也可以用 start nginx1 再启动（容器停止后，是没有删除的，只是进入 EXITED 状态，可以再启动），也可以 docker container ls 查看 hash 来关。其实 docker container run 相当于 create + start
docker container ls # 查看正在运行的容器，旧版是 ps
docker container ls -a # 查看全部容器
docker container ps -aq # 查看全部容器的 hash
docker container stop [hash]/[name] # 停止容器，hash 和 name 可以 ls -a 查看
docker container stop 21 ff c8 # 可以多个
docker container rm [hash]/[name] # 删除容器（正在运行的需要先停）
docker container rm 21 ff c8 # 可以多个
docker container rm [hash]/[name] -f # 删除容器，即使是正在运行的
docker container stop $(doctor container ps -aq) # 组件命令，停止全部 + 显示全部 hash
docker container rm $(doctor container ps -aq) # 组件命令，删除全部 + 显示全部 hash
docker container logs b74 # 查看日志
docker container logs - f b74 # 开启实时日志（即前台模式那样）
docker container inspect 3k81 # 查看容器信息，里面有很多数据如占用的端口什么的
docker container inspect --format '{{.Config.ExposedPorts}}' 3k81 # 查看容器信息中 Config 下的 ExposedPorts，即看其对外暴露的端口
docker system prune -f # 删除全部容器，与 docker container rm $(doctor container ps -aq) 不同的是，开启状态的容器不会被删除
```

## 制作简单的 Python DockerFile 镜像

DockerFile 是用于构建 docker 镜像的文件，包含了构建镜像所需的命令，有其特定的语法规则

找个文件夹新建文件

```python
## test.py
print('Test')
```

```sh
## Dockerfile
# 安装 Ubuntu 系统，通常 latest 不是最优选择，会选择某个版本
FROM ubuntn:latest
# 下载安装 Python 环境
RUN apt-get update && \
DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y python3.9 python3-pip python3.9-dev
# 添加 ./test.py 到镜像根目录文件
ADD test.py /
# python3 执行 test.py 文件
CMD ["python3","/test.py"]
```

```sh
# 构建镜像
docker image build -t test . # [Name:tag] [file path]，构建名为 test 的镜像（有版本可以跟如 test:1.0），从 . 当前目
录找到构建资源（第一次比较慢）
docker image build -f Dockerfile.xxx -t test # -f 是指定文件
docker image ls # 就可用看到那个镜像
docker container run test # 执行后就可以看到打印了 'Test'
```

## 发布镜像到 Docker Hub

```sh
docker login # 登录，输入 Username Password
docker image push kealm/mywordpress # 发布，没有指定版本则为 tag:latest
```

发布后在 Docker Hub 上个人中心 My Profile 就可以看到了

## Dockerfile 指令

### RUN

通常如纯净 Ubuntu 系统是没用 ipinfo 命令的，需要安装时一般操作命令为：

```sh
$ apt-get update
$ apt-get install wget
$ wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz
$ tar zxf ipinfo_2.0.1_linux_amd64.tar.gz
$ mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo
$ rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

假设要这些操作移动到 Dockerfile 不好的做法是：

```sh
## Dockerfile.bad
FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y wget
RUN wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz
RUN tar zxf ipinfo_2.0.1_linux_amd64.tar.gz
RUN mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo
RUN rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

```sh
docker image build -f Dockerfile.bad -t ipinfo-bad . # 打包
docker image ls # 查看 hash
docker image history [hash] # 查看分层情况
```

```sh
# 会看到每个 RUN 命令都会有分层，导致包体积比较大
Usage:  docker image COMMAND

Manage images

Commands:
  build       Build an image from a Dockerfile
  history     Show the history of an image
  import      Import the contents from a tarball to create a filesystem image
  inspect     Display detailed information on one or more images
  load        Load an image from a tar archive or STDIN
  ls          List images
e9c79d165e5c   4 minutes ago   RUN /bin/sh -c rm -rf ipinfo_2.0.1_linux_amd…   0B        buildkit.dockerfile.v0
<missing>      4 minutes ago   RUN /bin/sh -c mv ipinfo_2.0.1_linux_amd64 /…   9.36MB    buildkit.dockerfile.v0
<missing>      4 minutes ago   RUN /bin/sh -c tar zxf ipinfo_2.0.1_linux_am…   9.36MB    buildkit.dockerfile.v0
<missing>      4 minutes ago   RUN /bin/sh -c wget https://github.com/ipinf…   4.85MB    buildkit.dockerfile.v0
<missing>      6 minutes ago   RUN /bin/sh -c apt-get install -y wget # bui…   7.6MB     buildkit.dockerfile.v0
<missing>      6 minutes ago   RUN /bin/sh -c apt-get update # buildkit        29.7MB    buildkit.dockerfile.v0
<missing>      3 weeks ago     /bin/sh -c #(nop)  CMD ["bash"]                 0B
<missing>      3 weeks ago     /bin/sh -c #(nop) ADD file:5c3d9d2597e01d1ce…   72.8MB
```

更好的做法是用 `&& \` 分割命令：

```sh
FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz && \
    tar zxf ipinfo_2.0.1_linux_amd64.tar.gz && \
    mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

```sh
# 再查看分层，会发现分层少了很多，体积也减小了
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
e893cd98aa4e   2 minutes ago   RUN /bin/sh -c apt-get update &&     apt-get…   46.7MB    buildkit.dockerfile.v0
<missing>      3 weeks ago     /bin/sh -c #(nop)  CMD ["bash"]                 0B
<missing>      3 weeks ago     /bin/sh -c #(nop) ADD file:5c3d9d2597e01d1ce…   72.8MB
```

### COPY

如基础 node 镜像，然后拷贝一个 `index.js`

```js
const http = require('http');
const server = http.createServer();
server.listen(3000, () => {
    console.log('Server is running...');
});
server.on('request', (req, res) => {
    // end方法能够将数据返回给浏览器，浏览器会显示该字符串
    res.end('Hello Nodejs');
});
```

```sh
## Dockerfile.copy
FROM node:alpine3.14
COPY index.js  /app/index.js
```

```sh
# 打包
docker image build -f Dockerfile.copy -t hello-copy .
# 运行，并进入交互模式
docker container run -it -p 3000:3000 hello-copy sh
# 运行 node 服务，这时就可以 3000 端口看到 node 服务了
ls
cd app
node ./index.js
```

### ADD

`ADD` 与不 `COPY` 不同的是会自动解压

```js
// index.js 同上代码，再把它压缩称一个 index.tar
```

```sh
## Dockerfile.add
FROM node:alpine3.14
ADD index.tar  /app/
```

```sh
# 打包
docker image build -f Dockerfile.add -t hello-gzip .
# 运行，并进入交互模式
docker container run -it -p 3000:3000 hello-gzip sh
# 进入 /app 可以看到 index.tar 已经被解压出来了，运行 node 服务，这时就可以 3000 端口看到 node 服务了
ls
cd app
node ./index.js
```

### WORKDIR

切换工作目录

Dockerfile 文件的默认操作目录是镜像的根目录，有时希望切换到某二级目录（类似 Linux 的 `cd`）

```sh
## Dockerfile.add
FROM node:alpine3.14
WORKDIR /app
ADD index.tar  index.js
```

### ENV、ARG

如下文件，里面有多个 `2.0.1`，这意味着修改起来比较繁琐也容易漏：

```sh
FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-2.0.1/ipinfo_2.0.1_linux_amd64.tar.gz && \
    tar zxf ipinfo_2.0.1_linux_amd64.tar.gz && \
    mv ipinfo_2.0.1_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_2.0.1_linux_amd64.tar.gz
```

这时将其作为一个变量来维护会更好：

```sh
## Dockerfile.ENV
FROM ubuntu:latest
ENV VERSION=2.0.1
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
    tar zxf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    mv ipinfo_${VERSION}_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz
```

```sh
# 构建
docker image build -f Dockerfile.ENV -t ipinfo-env .
# 查看变量，这时就可以看到有个 VERSION=2.0.1
env
```

### ARG

`ARG` 与 `ENV` 的区别在于：

- `ARG` 是构建环境中有效，不能带到镜像中作为那里的变量

```sh
## Dockerfile.ARG
FROM ubuntu:latest
ARG VERSION=2.0.1
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
    tar zxf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    mv ipinfo_${VERSION}_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz
```

```sh
# 构建
docker image build -f Dockerfile.ARG -t ipinfo-arg .
# 查看变量，这时并没有一个叫 VERSION 的变量
env
```

- `ARG` 可在构建时改变变量值，如已经有个 Dockerfile 里有 ARG 2.0.1 了，想再打一个 2.0.0，差异只是里面的版本号其他没动，这时不需要拷贝一份去改 ARG VERSION 变量，只需要在 --build-arg 去改变即可

```sh
docker image build -f Dockerfile.ARG -t ipinfo-arg-2.0.0 --build-arg VERSION=2.0.0 .
docker container run -it ipinfo-arg-2.0.0 
# 查看 ipinfo 版本，这时就可以看到是 2.0.0
ipinfo version
```

### CMD

`CMD` 命令原则：

- 容器启动时默认执行的命令

```sh
## Dockerfile.base
FROM ubuntu:latest
ENV VERSION=2.0.1
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
    tar zxf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    mv ipinfo_${VERSION}_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz
```

```sh
docker image build -f Dockerfile.base -t ipinfo-base .
# 启动后，会发现进入了 shell 模式，所以我们才可以执行如 ls 等操作命令
# 为什么可以进入这个模式呢？查看一下分层
docker container run -it ipinfo-base
```

```sh
# 查看分层后可以看到第 2 层（从下往上），ubuntu 镜像有启用了 CMD ["bash"] 命令，所以进入后我们才会直接在 shell 模式
docker image history ipinfo-base
```

```sh
IMAGE          CREATED        CREATED BY                                      SIZE      COMMENT
11217f4813e6   24 hours ago   RUN /bin/sh -c apt-get update &&     apt-get…   46.7MB    buildkit.dockerfile.v0
<missing>      24 hours ago   ENV VERSION=2.0.1                               0B        buildkit.dockerfile.v0
<missing>      2 weeks ago    /bin/sh -c #(nop)  CMD ["bash"]                 0B
<missing>      2 weeks ago    /bin/sh -c #(nop) ADD file:524e8d93ad65f08a0…   72.8MB
```

- 如果 `docker container run` 启动容器时指定了其它命令，Dockerfile 内的 `CMD` 命令会被忽略

```sh
# 比如我们在创建容器的时候，就启动 ipinfo 命令，这时会发现控制台直接打出了 2.0.1，而不是进入 shell 模式，这是因为 CMD 命令已经被我们 ipinfo version 覆盖了
docker container run -it ipinfo-base ipinfo version
```

- 如果定义多个 `CMD`，只有最后一个 `CMD` 执行

```sh
FROM ubuntu:latest
ENV VERSION=2.0.1
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/ipinfo/cli/releases/download/ipinfo-${VERSION}/ipinfo_${VERSION}_linux_amd64.tar.gz && \
    tar zxf ipinfo_${VERSION}_linux_amd64.tar.gz && \
    mv ipinfo_${VERSION}_linux_amd64 /usr/bin/ipinfo && \
    rm -rf ipinfo_${VERSION}_linux_amd64.tar.gz
# 这是 exe 写法，更规范，也可以 shell 写法 CMD ipinfo version
CMD ["ipinfo","version"]
```

```sh
# 构建
docker image build -f Dockerfile.base -t ipinfo-base .
# 进入交互模式，这时可以发现没有进入 shell 模式而是打印出了 2.0.1，说明我们的 CMD 命令，覆盖了 ubuntu 里的 CMD 命令
docker container run -it ipinfo-base
```

### ENTRYPOINT

`ENTRYPOINT` 与 `CMD` 的区别在于：

- `docker container run` 时后面传 CMD 的命令，会覆盖原来 Dockerfile 的 `CMD` 命令，而 `ENTRYPOINT` 可以将后面传的 `CMD` 命令会作为参数传给 `ENTRYPOINT`

```sh
## Dockerfile-cmd
FROM ubuntu:21.04
# echo 即打印出 'hello docker' 这段话，通常是提示效果
CMD ["echo","hello docker"]

# 构建
docker image build -f Dockerfile-cmd -t demo-cmd .
# 运行，可以看到打印了 'hello docker'
docker container run --rm -it demo-cmd
# CMD 覆盖，执行可以看到打印变成了 'hellow cmd'
docker container run --rm -it demo-cmd echo "hello cmd"
```

```sh
## Dockerfile-entrypoint
FROM ubuntu:21.04
ENTRYPOINT ["echo","hello docker"]

# 构建
docker image build -f Dockerfile-entrypoint -t demo-entrypoint .
# 运行，可以看到打印了 'hello docker'
docker container run --rm -it demo-cmd
# 执行可以看到打印了 'hello docker echo hello cmd'，没被覆盖，但是后面那段连 'echo' 都出来了
# 说明了它不是执行了两条命令，而是把 docker container run 后面的命令作为了参数，进行传递了过去，拼接在一起
# 通常配合 CMD 使用，见下例
docker container run --rm -it demo-cmd echo "hello cmd"
```

```sh
## Dockerfile-both
FROM ubuntu:21.04
ENTRYPOINT ["echo"]
CMD []

# 构建
docker image build -f Dockerfile-both -t demo-both .
# 可以看到打印出了 'hello both'
# 说明 container run 后面的 CMD 命令作为参数拼接在 ENTRYPOINT 的命令后了，形成了 'echo hello both'
# 即 ENTRYPOINT 作为命令的起始，CMD 作为接收的参数（看了下别的教程，好像不用也这句？），组成一个命令。通常会这样两者配合使用
docker container run --rm -t demo-both "hello both"

# 这在想让容器可以接收各种命令参数时很有用
# 例如想给 curl 传 -i 参数
## Dockerfile
FROM ubuntu:16.04
RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*
ENTRYPOINT [ "curl", "-s", "http://ip.cn" ]
# 这时执行后即可以给达到 'curl -s http://ip.cn -i' 的效果
docker container run myip -i
```

### VOLUME

设置数据持久化

通常容器删除后，里面的数据也会一起删除：

```sh
## Dockerfile
FROM NGINX

# 构建
docker image build -t my-image .
# 启动到后台
docker container run -d my-image
# 进入交互模式，并使用 shell 命令控制
docker container ls
docker container exec -it [hash] sh
# 安装 vim，按 i+Enter 是进入插入模式，ESC 是退出当前模式，输入 :wq 是保存并退出
apt-get update
apt-get install vim
# 新建并写入 test.txt 文件
cd /app
echo "hello" > test.txt
# 查看，也可以换成 more test.txt
vim test.txt

# 但是当容器删除后，我们新建的 test.txt 也没了
exit
```

然而有时我们可能希望里面的数据可用保存然后重复使用：

```sh
## Dockerfile
# 持久化 /app 下的数据
FROM NGINX
VOLUME ["/app"]

# 构建
docker image build -t my-image .
# 启动到后台
docker container run -d my-image
# 进入交互模式，并使用 shell 命令控制
docker container ls
docker container exec -it [hash] sh
apt-get update
apt-get install vim
# 新建并写入 test.txt 文件
cd /app
echo "hello" > test.txt
# 查看
vim test.txt
# 退出
exit
```

```sh
# 查看 docker volume 可用命令
docker volume COMMAND
```

```sh
# 查看持久化数据列表
docker volum ls
# 可用看到有这些数据
DRIVER    VOLUME NAME
local     c9fe0c3841af7d052034df6c1bc0b6092c75d9fb9a83d6d7a849ce465981a4d8
```

```sh
# 查看，不能简写
docker volume inspect c9fe0c3841af7d052034df6c1bc0b6092c75d9fb9a83d6d7a849ce465981a4d8
# 可用看到 Mountpoint，即存储的空间位置
[
    {
        "CreatedAt": "2021-08-16T10:07:52+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/c9fe0c3841af7d052034df6c1bc0b6092c75d9fb9a83d6d7a849ce465981a4d8/_data",
        "Name": "c9fe0c3841af7d052034df6c1bc0b6092c75d9fb9a83d6d7a849ce465981a4d8",
        "Options": null,
        "Scope": "local"
    }
]

# 查看持久化的数据，这时可用看到内容 'hello'
# 说明我们 test.txt 已经被持久化到了 docker 的 volumes 下了
/var/lib/docker/volumes/c9fe0c3841af7d052034df6c1bc0b6092c75d9fb9a83d6d7a849ce465981a4d8/_data/test.txt
```

不过上面的持久化数据不够直观，可用使用 `-v` 进行为 volume 取别名：

```sh
# 给 /app 这个持久化地址（因为可能有多个 VOLUME，需要完整的地址），取别名为 my-data
# -v [VOLUME name:Dockerfile VOLUME path]
docker container run -d -v my-data:/app my-image
# 查看持久化数据列表
docker volum ls
# 这时名称不再是一串 hash
DRIVER    VOLUME NAME
local     my-data

# 查看持久化详细地址
docker volume inspect my-data
# 这时可用看到 Mountpoint 那串 hash 变成 my-data 了
# docker volume inspect my-data
[
    {
        "CreatedAt": "2021-08-18T15:12:51+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/my-data/_data",
        "Name": "my-data",
        "Options": null,
        "Scope": "local"
    }
]

# 进入交互模式，并使用 shell 命令控制
docker container ls
docker container exec -it [hash] sh
# 新建并写入 test.txt 文件
echo "hello" > test.txt
# 查看
more test.txt
# 退出
exit

# 删除容器
docker container rm -f [hash]
# 查看 volume，可用看到 my-data 还在
docker volume ls

# 重新启动一个容器
docker container exec -it [hash]  sh
# 进入 /app 可用看到 test.txt 还在
more /app/test.txt
```

> 我的理解是持久化数据是一个绑定的效果，VOLUME ["/app"] 将 my-data 路径的内容和 /app 的内容进行绑定，my-data 的文件内容改了，容器里 /app 那边的内容也会跟着变化

### Bind Mount

上例的 `DATA VOLUME` 在 `Windows` 环境并不好使用，因为 my-data 生成的路径是虚拟机路径，不容易找到

可以使用 `Bind Mount` 的方式进行挂载绑定，把容器中的持久化数据绑定到本机的自定义地址来解决这个问题

```js
// 在当前目录新建 index.js
console.log('show Time');
setInterval(() => console.log(Date.now()),1000);
```

```sh
# 将别名 my-data 替换为自定义地址，如绑定到当前目录 pwd
# 这时当前目录的数据，就和 node 容器的 /app 达到一个绑定的效果
docker container run -it -v ${pwd}:/app node
cd /app
# 可用看到也有一份 index.js
# 且外面 pwd 的 index.js 改了代码，这里会同步更新
ls
# 启动
node ./index.js
```

## 端口映射

在 “常用命令” 小节有提过，容器启动的服务，是没法直接访问到的，如果想访问，就需要进行端口映射 `-p`

假设已经有了一个 wordpress 镜像：

```sh
# 本机的 80 端口映射到容器的 80 端口，这时就可以访问到了
docker container run -d -p 80:80 wordpress

# 不知道容器端口，可以查看
docker container inspect --format '{{.Config.ExposedPorts}}' [hash]
```

## Docker Compose

通常 Linux 中会把命令都放在一个 `.sh` 文件中运行来达到一个批量执行的效果

而之前的小节在操作 Docker 时都是一个个命令来编写执行的，有时一些固定的命令，可能需要一个类似 `.sh` 的工具

而 `docker-compose` 就是为了解决这个问题

```sh
# （安装完成后）执行这个命令就可以看到其可执行的命令列表
docker-compose
```

### 安装

- Windows/Mac 安装了 Docker，默认就已经安装了 docker-compose

```sh
docker-compose --version
```

- [Linux](https://docs.docker.com/compose/install/)

```sh
# 方式一，官方
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# 方式二，python 环境安装
sudo yum install epel-release
sudo yum -y update
sudo yum -y install python-pip
sudo pip install -U docker-compose
```

```sh
# 安装完成后
docker-compose --version
```

### yaml 文件

`yaml`文件里是对启动镜像相关设置的所有描述

基本格式：

```sh
version: "3.8"

services: # 容器
  servicename: # 服务名字，这个名字也是内部 bridge网络可以使用的 DNS name
    image: # 镜像的名字
    container_name: # 容器名称
    command: # 可选，如果设置，则会覆盖默认镜像里的 CMD命令
    environment: # 可选，相当于 docker run里的 --env
    volumes: # 可选，相当于docker run里的 -v
    networks: # 可选，相当于 docker run里的 --network
    ports: # 可选，相当于 docker run里的 -p
  servicename2:

volumes: # 可选，相当于 docker volume create

networks: # 可选，相当于 docker network create
```

如 `docker container run -d -p 80:80 wordpress`：

```sh
## docker-compose.yml
# 相当于 docker container run -d -p 80:80 wordpress
# version 版本见 https://docs.docker.com/compose/compose-file/，其中有项 Docker Engine release，要根据自己 Docker 引擎版本判断，即 docker --version
version: "3.8"

services:
  my-wordpress:
    image: wordpress:latest
    ports:
      - 80:80
```

### 基本命令

```sh
docker compose # 查看可用命令
docker compose up # 执行 docker-compose.yml，会去下载安装一些东西，可能比较慢，7、8 分钟
docker compose up -d # 不过上面这样启动后，会没法继续在控制台输入东西，可以加 -d 后台启动
docker compose -f my-docker-compose.yml up -d # 指定文件，貌似可多个 -f
docker compose ps # 查看 compose 列表，如上面那个 yml，启动后会看到，NAME 可能会叫如 test_my-wordpress_1 的（为什么会有 test 前缀，因为 docker-compose.yml 可能是放在 test 文件夹里），可用通过指定 container_name 解决（如上面 yml 加一条 container_name: kealm 后，ps 查看会看到 NAME 为 kealm，SERVICE 为 my-wordpress），通常会定义个文件夹名如 test 来控制它的前缀，不写 container_name
docker compose -p test up -d # 启动，且命名为 test（docker compose ps 查看时可用看到 NAME 为 test)
docker compose stop # 停止 compose
docker compose rm # 删除 compose，不过 rm 后其实 network 是没有被删除的（network 见后续小节），执行 docker network ls 可用看到还在列表里，要都删除可用 docker system prune -f
```

### 指定个人镜像

上例中，我们给 `yml` 文件配的 image 镜像为 `wordpress:latest`

有时可能希望用自己的镜像

```sh
## file/Dockerfile.dev
FROM node:latest
CMD []
```

```sh
## docker-compose.yml
version: "3.8"

services:
  my-node:
    build: ./file/Dockerfile.dev
    image: my-node:latest # 给镜像取名
```

```sh
# 启动（还会自动一起 build 镜像）
docker compose up
# 查看镜像
docker image ls
```

### 拉取镜像

有时没有拉过镜像，compose 启动很慢，如 wordpress

其实可用单独先拉取一下镜像

```sh
## docker-compose.yml
version: "3.8"

services:
  my-node:
    image: node:latest
```

```sh
docker compose pull # 先执行 docker-compose.yml 里的拉取镜像，但是不启动
docker image ls # 查看镜像
```

## Docker Network

可用先启动一个 nginx 容器

```sh
docker container run -d -p 80:80 nginx
docker container ls
docker container inspect [hash] # 查看容器信息，可用看到下面 "Networks"
```

```sh
"Networks": {
    "bridge": {
        "IPAMConfig": null,
        "Links": null,
        "Aliases": null,
        "NetworkID": "bd2fe52b4c98ec5c5a11131a0bec714035ae25c791a518f7302d7f02c0aa8a75",
        "EndpointID": "2b8e1ff95d9f0f56be7a9f3737a1a695f523c290aefcd8c5f08130b9fb4535df",
        "Gateway": "172.17.0.1",
        "IPAddress": "172.17.0.2", # 容器的内网地址，与外面通讯的地址
        "IPPrefixLen": 16,
        "IPv6Gateway": "",
        "GlobalIPv6Address": "",
        "GlobalIPv6PrefixLen": 0,
        "MacAddress": "02:42:ac:11:00:02",
        "DriverOpts": null
    }
}
```

再启动一个 nginx 容器

```sh
docker container run -d -p 8080:80 nginx
docker container ls
docker container inspect [hash]
```

```sh
"Networks": {
    "bridge": {
        "IPAddress": "172.17.0.3", # 可用看到 IP 变了，后面是 .3，之前是 .2，可用看到，一个容器就会有一个内网 IP 地址
    }
}
```

### 网络模式

```sh
docker network ls # 查看网络模式

NETWORK ID    NAME    DRIVER    SCOPE
6914506afd7a  bridge  bridge    local
81541dc742e3  host    host      local
6033d5ed83f8  none    null      local
```

- bridge：桥接模式，为每一个容器分配、设置 IP 等，并将容器连接到一个 `docker0` 虚拟网桥，默认为该模式

```sh
# 什么是 docker0？
# 查看本机 IP，可以看到一个 docker0
# 即 docker0 是安装 docker 后建立的虚拟网桥
ip addr
```

- host：主机模式，容器没有 IP 和网关这些，都是用实体主机的（如我们当前服务器）。容器将不会虚拟出自己的网卡，配置自己的 IP 等，而是使用宿主机的 IP 和端口

- none：不创建自己的 IP 网络，即没有网（容器有独立的 Network namespace，但并没有对其继续任何网络设置，如分配 veth pair 和网桥连接，IP 等），一般用于更灵活的配置网络模式

- container：其它容器有网络了，就用其它容器的网络，新创建的容器不会创建自己的网卡和配置 IP，而是跟一个指定的容器共享 IP、端口等

#### bridge

该模式中，Docker 守护进程创建了一个虚拟以太网桥 `docker0`，新建的容器会自动桥接到这个接口

![docker_bridge.jpeg](https://newimg.jspang.com/docker_bridge.jpeg)

如上图中，`eth0` 是主机网卡，`docker0` 是桥接网络，每个容器都有自己的 `eth0` 网卡，通过 `docker0` 与主机通信，形成内部局域网

默认情况下，守护进程会创建一对对等虚拟设备接口 `veth pair`，将其中一个接口设置为容器 `eth0` 接口，另一个接口放在主机命名空间中（如 veth8fa0887@if68），从而将主机上所有容器都连接到这个内部网络

```sh
# 查看 ip addr，可以看到有大致如下结构
ip addr

1: lo # local
2: eth0
3: docker0

# 交互式启动 busybox 容器
docker container run -it --name box01 busybox

# 查看容器的 ip addr，可以看到有个 68，eth0 以 69 尾
ip addr

1: lo
68: eth0@if69

# 退出，再查看，可以看到多出了一个，前面 69 后面 68，说明跟容器那是成对的，即虚拟出来的对等网络
ip addr

1: lo
2: eth0
3: docker0
69: veth8fa0887@if68
```

#### host

容器没有虚拟出自己的 IP、网卡，直接用实体主机 `eth0`

```sh
# 启动，直接可以在浏览器通过主机 IP 打开 nginx 首页，说明都不用 -p 映射，它使用的是主机的
docker container run -it --name nginx1 --network host

# 新开个控制台出来外面，查看 ip addr，可以看到并没有创建对等网络
ip addr

1: lo
2: eth0
3: docker0
```

#### none

禁用网络功能，只有 lo 接口 local 的简写，代表 `127.0.0.1`，既 localhost 本地环回接口

```sh
docker container run -it --name box1 --network none busybox

# 容器启动后 ip addr 可以看到只有一个 lo，也就是没有网络状态，需要自己进行配置
ip addr

1: lo
```

> none 有什么用：none 网络模式即不为 Docker Container 创建任何的网络环境，容器内部只能使用 loopback 网络设备，不会再有其他的网络资源。可以说 none 模式为 Docker Container 做了极少的网络设定。在没有网络配置的情况下，作为Docker 开发者，才能在这基础做其他无限多的可能的网络定制开发。这也体现了Docker设计理念的开发

#### container

```sh
# 先启动一个容器
docker container run -it --name box1 busybox

# 再启动一个，用 container 模式，复用 box1 的网络
docker container run -it --name box2 --network container:box1 busybox

# 新起一个控制台，ip addr 查看，可以看到多了一个 75:74 虚拟对等网络
ip addr

1: lo
2: eth0
3: docker0
75: vethda84779@if74

# 回到 box1 和 box2 的交互模式，都执行 ip addr，可以看到都是 74:75，说明这 2 个容器，都是一样的对等网络网卡
# 这样 2 个容器之间就可以互通，如利用 local 传输
ip addr

1: lo
74: eth0@if75

# 切到 box1 的交互模式，退出 box1，这时 box2 的网络也会没了
exit

# 再启动 box1，这时 box2 网络还是不行，因为主容器退出，副容器需要重启
docker container start box1

# 切到 box2 交互模式，需要退出再开启才可以通
docker container start box2
```

