# ---------
# pullできないことの確認
# ---------

$ git pull
remote: Enumerating objects: 9, done.
remote: Counting objects: 100% (9/9), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 5 (delta 2), reused 5 (delta 2), pack-reused 0
Unpacking objects: 100% (5/5), 451 bytes | 16.00 KiB/s, done.
From https://github.com/yamahei/samplejunme
   0ff8f2c..5a06940  master     -> origin/master
error: Your local changes to the following files would be overwritten by merge:
        bridge1/b85e760fc7040670/inspect.yaml
Please commit your changes or stash them before you merge.
Aborting
Updating 0ff8f2c..5a06940


# ---------
# stashしてpull（最新のデータを取得、変更で上書き
# ---------

$ git stash save -u
Saved working directory and index state WIP on master: 0ff8f2c 競合テスト

$ git stash list
stash@{0}: WIP on master: 0ff8f2c 競合テスト

$ git pull
Updating 0ff8f2c..5a06940
Fast-forward
 bridge1/b85e760fc7040670/inspect.yaml | 6 ++++--
 1 file changed, 4 insertions(+), 2 deletions(-)

$ git stash pop # ①コンフリクトしなかった場合
Auto-merging bridge1/b85e760fc7040670/inspect.yaml
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   bridge1/b85e760fc7040670/inspect.yaml

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (9cd5f7ae2de5a24332698c4a5df863a38dbbd546)

$ git stash pop # ②コンフリクトした場合
Auto-merging bridge1/b85e760fc7040670/inspect.yaml
CONFLICT (content): Merge conflict in bridge1/b85e760fc7040670/inspect.yaml
The stash entry is kept in case you need it again.

$ vim bridge1/b85e760fc7040670/inspect.yaml
# 競合してるところは↓な感じで表示されている
#### <<<<<<< Updated upstream # サーバ上の変更内容
####     競合テスト用に変更→この行を競合させる
#### =======
####     競合テスト用に変更<-lets conflict!
#### >>>>>>> Stashed changes # ローカルの変更内容
#### 
# 2つの変更を見て↓に修正
####     競合テスト用に変更→この行を競合させる<-lets conflict!
# 競合してるファイル全部同様に修正して次項へ進む


# ---------
# add,commit,push（変更を送信する
# ---------

$ git add .
$ git commit -m "test"
[master 0bde3d5] test
 1 file changed, 1 insertion(+), 1 deletion(-)

$ git push
Enumerating objects: 9, done.
Counting objects: 100% (9/9), done.
Delta compression using up to 4 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (5/5), 411 bytes | 411.00 KiB/s, done.
Total 5 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/yamahei/samplejunme.git
   5a06940..0bde3d5  master -> master

$ git pull
Already up to date.
