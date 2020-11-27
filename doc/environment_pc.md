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
   * https://github.com/yamahei/kyo-ryo-joe.git
1. インストール
   * `bundle install`
1. 実行（関連ディレクトリ作成など）
   * `bundle exec ruby app.rb`
   * `http://localhost:4567/`にアクセスすると「リポジトリがありません」と表示されている
   * `public`ディレクトリの下に`inspects/repositories`が作成されている(`//kyo-ryo-joe/public/inspects/repositories`)
1. GitHub上に巡目データリポジトリを作成する
   * 1巡目ごとに1ディレクトリ
   * `public/inspects/repositories`配下に`clone`する
     * `clone`する際のディレクトリ名は「junme1」（1は任意の巡目）
     * 「junme1」（1は任意の巡目）直下に「bridges.yaml」が必要
       * ⇒[サンプルファイル](bridges.yaml)
   * `http://localhost:4567/`にアクセスすると「1巡目」（1は任意の巡目）のリンクが表示されている
