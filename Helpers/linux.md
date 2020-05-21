## Linux 帮助文档

- 刷新 DNS：ipconfig /flushdns

- 远程连接：~$ssh -p 59763 root@172.16.13.208

- 创建文件夹：mkdir XXX

- 移除文件夹：rm -rf XXX

- 移除当前文件夹下全部文件: rm -rf *

- 移除 XXX 文件夹下的全部文件：rm -rf backoffice/*

- 压缩文件：zip -r dist.zip dist（将 dist 文件夹压缩为 dist.zip）

- 解压文件：unzip dist.zip

- 解压文件到指定目录：unzip cmsApp.zip -d XXX

- 本地跳板机传输文件到服务器：scp -P 59763 ./dist.zip root@172.16.13.208:/opt/ci/workspace

- 服务器文件传输到本地跳板机：scp -P 37986 ./cloudbase-officialEN.zip hongy2@172.16.1.8:/tmp  密码 XXX（再用
WinSCP连接到hongy2@172.16.1.8，然后回到根目录找tmp）

- 下载服务器文件到本地 Windows：sz XXX

- 编辑文件： vi 文件名、i 输入模式、修改后 ESC 后 :wq 确定

- 修改文件夹名：mv ./a ./b（将 a 文件夹改名为 b）

- 复制文件：cp -r a b

- 查询文件里的字符： grep XXX 文件名

- 查看当前全路径：pwd