動作環境/Termux on Android上に構築する
========================================

Termuxインストール
-------------

以下のURLにアクセスして、Termuxをインストールします。

* [Termux | Google Play](https://play.google.com/store/apps/details?id=com.termux)

もしくはGoogleで`termux`と検索してもヒットします。


セットアップスクリプトの実行
-----------------

1. インストールしたTermuxを起動します。
1. 以下のコマンドを実行します
   * `curl https://raw.githubusercontent.com/kyoryojoe/app/main/bin/setup_termux.sh | sh`
   * ↑の入力が面倒な場合は↓のQRコードを読取って、Termux上に貼り付けます
   * ![セットアップスクリプト](qrcode_setup_termux.png)


その他（TODO: 
-----

* Termuxを自動起動させる方法
* Termuxを常駐（起動しっぱなし）にする方法
* Androidで音声入力を行う
* Androidで手書き入力を行う
* Androidの内部ストレージをSDカードで拡張する

* 動作実績のある機器