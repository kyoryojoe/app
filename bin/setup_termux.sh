# ----
# ディスプレイのスリープを解除しておくとよいかも
# Bluetoothキーボードで入力するとよいかも
# ----

# 初期化チェック
if [ ! -d ~/storage ]; then # まだなら実施
  echo [Termuxが初期化されていません]
  echo 以下のコマンドを入力してパッケージを最新化してください
  echo "  pkg update -y"
  echo 以下のコマンドを入力してストレージを初期化してください
  echo "  termux-setup-storage"
  exit 1
fi
if [ -d ~/kyoryojoe ]; then # あれば確認
  echo [KyoRyoJoeがインストールされています]
  echo 再インストールすると点検データは削除されます
  echo 同期が必要な場合、中断して下さい
  read -p "続行しますか？(y/n): " confirm
  case "$confirm" in
    [yY] ) $(rm -f -d -r ~/kyoryojoe);;
    * ) exit 1 ;;
  esac
fi

# kyoryojoe停止
kill -9 $(ps aux | grep -v grep | grep ruby | grep "app.rb" | awk '{ print $2}')

# 環境設定
cd #~

echo [SSHをインストールします]
echo 成功するとバージョンを表示します
pkg list-all | grep openssh # これやると成功率が上がる？
pkg install -y openssh # 失敗することあり（もう一度試す
echo 鍵を生成します
ssh-keygen -t rsa

echo [Gitをインストールします]
echo 成功するとバージョンを表示します
pkg list-all | grep git # これやると成功率が上がる？
pkg install git -y # 失敗することあり（もう一度試す
git --version

echo [RubyとBundlerをインストールします]
echo 成功するとバージョンを表示します
pkg list-all | grep ruby # これやると成功率が上がる？
pkg install ruby -y # 失敗することあり（もう一度試す
ruby -v
gem install bundler
bundle -v

echo [Vimをインストールします]
echo 成功するとバージョンを表示します
pkg list-all | grep vim # これやると成功率が上がる？
pkg install vim -y # 失敗することあり（もう一度試す
vim --version

# GitHubアカウント関連
if [ -z $(git config --global user.email) ]; then
  echo [GitHubアカウントを登録します]
  read -p "mail address for github: " mailaddr
  git config --global user.email "$mailaddr"
fi
if [ ! -f ~/.ssh/known_hosts ]; then # まだなら実施
  ssh-keyscan github.com >> ~/.ssh/known_hosts
fi

# アプリインストール
echo [KyoRyoJoeをインストールします]
git clone https://github.com/kyoryojoe/app.git kyoryojoe
cd kyoryojoe/
bundle install

# 自動起動スクリプト
cd #~
if [ ! -f ~/.bashrc ]; then # まだなら実施
  echo '#! $PREFIX/bin/bash' >>  ~/.bashrc
  echo '#KyoRyoJoe start' >> ~/.bashrc
  echo 'cd ~/kyoryojoe/' >> ~/.bashrc
  echo 'bundle exec ruby app.rb &' >> ~/.bashrc
  echo 'echo KyoRyoJoeを起動します' >> ~/.bashrc
  echo 'cd -' >> ~/.bashrc
  chmod +x ~/.bashrc
fi

# おわり
echo [セットアップが完了しました]
echo Termuxを再起動してください
