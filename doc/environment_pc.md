動作環境/PC上に構築する
==========================================

Windows・Mac・Linuxで同じ手順で構築できます。

必要なツールのインストール
--------------------------

1. git
1. ruby(>=2.5)
1. bundler(>=2.1.4)

あと、データ格納用にGitHubアカウントが必要

ソースコードの取得と実行
------------------------

1. gitHubからソースコードを`clone`する
   * https://github.com/kyoryojoe/app.git kyoryojoe
1. インストール
   * `cd kyoryojoe/`
   * `bundle install`
1. 実行（関連ディレクトリ作成など）
   * `bundle exec ruby app.rb`
   * `http://localhost:4567/`にアクセスすると「リポジトリがありません」と表示されている
   * `public`ディレクトリの下に`inspects/repositories`が作成されている
1. GitHub上に巡目データリポジトリを作成する
   * TODO: 作り方を書く
   * TODO: Toolから同期するやり方

