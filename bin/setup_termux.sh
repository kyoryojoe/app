# ----
# ディスプレイのスリープを解除しておくとよいかも
# Bluetoothキーボードで入力するとよいかも
# ----

# 初期化チェック
if [ ! -d ~/storage ]; then # まだなら実施
  echo Termuxが初期化されていません
  echo 以下のコマンドを入力してパッケージを最新化してください
  echo "  pkg update -y"
  echo 以下のコマンドを入力してストレージを初期化してください
  echo "  termux-setup-storage"
  exit 1
fi

cd #~
# 環境設定

echo Gitをインストールします
echo 成功するとバージョンを表示します
pkg list-all | grep git # これやると成功率が上がる？
pkg install git -y # 失敗することあり（もう一度試す
git --version

echo RubyとBundlerをインストールします
echo 成功するとバージョンを表示します
pkg list-all | grep ruby # これやると成功率が上がる？
pkg install ruby -y # 失敗することあり（もう一度試す
ruby -v;
gem install bundler
bundle -v

echo Vimをインストールします
echo 成功するとバージョンを表示します
pkg list-all | grep vim # これやると成功率が上がる？
pkg install vim -y # 失敗することあり（もう一度試す
vim --version

# アプリインストール#TODO git URL修正
echo KyoRyoJoeをインストールします
git https://github.com/kyoryojoe/app.git kyoryojoe
cd kyoryojoe/
bundle install

echo セットアップが完了しました
echo KyoRyoJoe起動します
echo ブラウザで以下のURLにアクセスしてください
echo http://localhost:4567/

# 起動
bundle exec ruby app.rb
