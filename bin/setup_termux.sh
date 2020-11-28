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
git clone https://github.com/kyoryojoe/app.git kyoryojoe
cd kyoryojoe/
bundle install

# 自動起動スクリプト
cd #~
if [ ! -f ~/.bashrc ]; then # まだなら実施
  echo '#! $PREFIX/bin/bash' >>  ~/.bashrc
  chmod +x ~/.bashrc
fi
echo '#KyoRyoJoe start' >> ~/.bashrc
echo 'cd ~/kyoryojoe/' >> ~/.bashrc
echo 'bundle exec ruby app.rb &' >> ~/.bashrc
echo 'echo KyoRyoJoeが起動しました' >> ~/.bashrc
echo 'cd -' >> ~/.bashrc


echo セットアップが完了しました
echo Termuxを再起動してください

