# ----
# ディスプレイのスリープを解除しておくとよいかも
# Bluetoothキーボードで入力するとよいかも
# ----

# 初期設定
cd #~

echo パッケージを更新します
echo 時々応答を求められることがあります
echo その時は何も入力せず[Enter]を押して下さい
pkg update -y

if [ ! -d ~/storage ]; then # まだなら実施
  echo Termuxの初期化を行います
  echo ストレージへのアクセスを許可してください
  termux-setup-storage
fi

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
gem install bundler
ruby -v; bundle -v

echo Vimをインストールします
echo 成功するとバージョンを表示します
pkg list-all | grep vim # これやると成功率が上がる？
pkg install vim -y # 失敗することあり（もう一度試す
vim --version

# アプリインストール#TODO git URL修正
echo kyo-ryo-joeをインストールします
git clone https://github.com/yamahei/kyo-ryo-joe.git
cd kyo-ryo-joe/
bundle install

echo kyo-ryo-joeをインストールしました
echo セットアップが完了しました
echo kyo-ryo-joe起動します
echo ブラウザで以下のURLにアクセスしてください
echo http://localhost:4567/

# 起動
bundle exec ruby app.rb
