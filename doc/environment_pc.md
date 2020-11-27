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
   * git clone https://github.com/kyoryojoe/app.git kyoryojoe
1. インストール
   * `cd kyoryojoe/`
   * `bundle install`
1. 実行（関連ディレクトリ作成など）
   * `bundle exec ruby app.rb`
   * `http://localhost:4567/`にアクセスすると「リポジトリがありません」と表示されている

その後の操作
------------

1. GitHub上に巡目点検データリポジトリを作成する
   * TODO: →使い方にリンクする
1. 巡目点検データを配置する
   * TODO: →使い方にリンクする


