## Git 帮助文档

- 更新分支列表：git remote update origin --prune

- 更新远程分支到本地: git pull origin xxxxx

- 查看当前分支：git branch

- 查看当前分支及远程分支：git branch -a

- 切换当前分支：git checkout XXX

- 合并分支：git merge XXX（把 XXX 合并到当前分支）

- 删除本地分支：git branch -d XXX

- 合并某次 commit 到某分支：git cherry-pick \<commit id>（先 git log 看 commit id，或 gitlab 找到那次合并的 commit id，本地切到需要合的分支执行这个命令）