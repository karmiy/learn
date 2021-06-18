## Git 帮助文档

- 添加文件到暂存区

```sh
git add xxx
git add . # 全部文件
```

- 提交到本地仓库

```sh
git commit 
git commit -m 'feat: 添加弹框功能'
```

- 提交到远程仓库

```sh
git push
```

- 从远程仓库拉取代码合并到本地

```sh
git pull
git pull <远程主机名><远程分支名>:<本地分支名>（git pull origin feat-test）
git pull --rebase <远程主机名><远程分支名>:<本地分支名>
```

- 拉取远程的更改

```sh
# 与 git pull 不同，fetch 只拉取远程的更改，如 origin 新增了 feature-test-1.5 分支，不会自动 merge
git fetch
git fetch --al
git fetch <远程主机名><分支名>
```

- 更新分支列表

```sh
git remote update origin --prune
```

- 查看/操作分支

```sh
# 新建分支，但不切换
git branch <branch-name>
# 查看本地分支
git branch
# 查看远程分支
git branch -r
# 查看本地和远程分支
git branch -a
# 删除本地分支
git branch -D <branch-name>
# 重命名
git branch -m <old-branch-name> <new-branch-name>
```

- 合并某次 commit 到某分支

```sh
#（先 git log 看 commit id，或 gitlab 找到那次合并的 commit id，本地切到需要合的分支执行这个命令）
git cherry-pick <commit-id> 

# 多个，可以是个区间，左开右闭
git cherry-pick <commit-id1>...<commit-id2>
# 左右都闭合
git cherry-pick <commit-id1>^...<commit-id2>
```

- 切换当前分支

```sh
git checkout XXX
```

- 从当前本地分支创建一个新本地分支

```sh
git checkout -b XXX
```

- 合并分支

```sh
git merge XXX（把 XXX 合并到当前分支）
git merge origin/feat-test
```

- 回滚某次提交

```sh
# 直接将提交记录退回到某次指定的 commit
git reset <commit-id>
# 新建一条 commit 信息来撤回之前的修改
git revert <commit-id>
# 回滚多次，这是个前开后闭的区间，不包括 commit1 包括 commit2
git revert <commit-id1> <commit-id2> ...
```

- 暂存文件

```sh
# 有时开发一半临时要去别的分支改东西，又不想 commit，就可以暂存
# 把本地改动暂存
git stash
git stash save 'feat: 更新弹框'
# 应用最近的一次暂存修改，并删除暂存的记录
git stash pop
# 应用某次暂存，但不会从暂存列表删除，默认使用暂存的第一个 stash@{0}
git stash apply
# 指定应用的暂存
git stash apply stash@{$num}
# 暂存列表
git stash list
# 删除所有暂存
git stash clear
```

- 查看状态、撤销修改

```sh
# 查看当前分支的状态，如有改代码（没 commit），会出现修改的文件
git status
# 撤销指定文件的修改
git checkout -- <filename>
# 已经提交到暂存区，撤销
git reset <filename>
# 撤销所有暂存区修改
git reset
```

- 别名 alias

```sh
$ git config --global alias.co checkout
$ git config --global alias.ci commit
$ git config --global alias.br branch
```

学习至 [我在工作中是如何使用 git 的](https://juejin.cn/post/6974184935804534815#heading-16)
```sh
[alias]
st = status -sb
co = checkout
br = branch
mg = merge
ci = commit
ds = diff --staged
dt = difftool
mt = mergetool
last = log -1 HEAD
latest = for-each-ref --sort=-committerdate --format=\"%(committername)@%(refname:short) [%(committerdate:short)] %(contents)\"
ls = log --pretty=format:\"%C(yellow)%h %C(blue)%ad %C(red)%d %C(reset)%s %C(green)[%cn]\" --decorate --date=short
hist = log --pretty=format:\"%C(yellow)%h %C(red)%d %C(reset)%s %C(green)[%an] %C(blue)%ad\" --topo-order --graph --date=short
type = cat-file -t
dump = cat-file -p
lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```