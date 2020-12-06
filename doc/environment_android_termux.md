動作環境/Termux on Android上に構築する
========================================

内部ストレージの拡張
-------------------

橋梁点検データは写真が多く、Androidストレージが不足する恐れがあります。
大容量のSDカードを追加して、内部ストレージを拡張させたうえでKyoRyoJoeを構築することをお勧めします。


Termuxインストール
-------------

1. Google PlayストからTermuxをインストールします。
   * [Termux | Google Play](https://play.google.com/store/apps/details?id=com.termux)
1. インストールしたTermuxを起動します。
   * Termux上で以下のコマンドを実行します
   * `pkg update -y`
     * Termuxを最新化するコマンドです。時々応答を求められますので、何も入力せずに`[Enter]`入力してください。
   * `termux-setup-storage`
     * Termuxのファイルシステムを初期化するコマンド？みたいです。Androidからストレージアクセスの許可を求められタ場合は許可してください。


セットアップスクリプトの実行
-----------------

1. Termux上で以下のコマンドを実行します
   * `eval "$(curl https://raw.githubusercontent.com/kyoryojoe/app/main/bin/setup_termux.sh)"`
   * ↑の入力が面倒な場合は↓のQRコードを読取って、Termux上に貼り付けます
   * ![セットアップスクリプト](qrcode_setup_termux.png)
1. 5分ほどで「セットアップが完了しました」と表示されます
   * 失敗した場合はもう一度実行してください
1. Termuxを再起動します
   * 一般的なAndroid同様、落としてください
     * [CTRL-D]を入力しても落とせます
   * Termuxを起動します
     * 「KyoRyoJoeが起動しました」と表示されます
     * ブラウザで以下のURLにアクセスしてください
       *  http://localhost:4567/


その後の操作
------------

1. GitHub上に巡目点検データリポジトリを作成する
   * TODO: →使い方にリンクする
1. 巡目点検データを配置する
   * TODO: →使い方にリンクする


その他（TODO: 
-----

* Termuxを自動起動させる方法
* Termuxを常駐（起動しっぱなし）にする方法
* Androidで音声入力を行う
* Androidで手書き入力を行う
* Androidの内部ストレージをSDカードで拡張する

* 動作実績のある機器