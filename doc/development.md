開発に関する情報
================

言語、ツール、ミドル
--------------------
* Ruby
  * Bundler
  * sinatra
* Git


プログラム構成
--------------

大まかにレイヤーを構成するファイルと役割を以下に記載

### サーバ側

* `kyo-ryo-joe_inspect.rb`
  * サーバ側業務ロジックの本体（橋梁点検）
* `app.rb`
  * サーバプログラムのトップ
* `app_main.rb`
  * 業務ロジックへのWebIF
* `sinatra`
  * サーバIFライブラリはSinatraを利用

### クライアント側

* `api.js`
  * サーバプログラムへのWebIF
* `biz.js`
  * クライアント側業務ロジックの本体
* `app.js`
  * 画面全体・遷移の制御
  * `pages/`
    * 各ページ処理
  * `components/`
    * 部品置き場
* `vue.js`
  * クライアントUIライブラリはVue2.6を利用
* `index.html`
  * UI