# frozen_string_literal: true

# sudo bundle install --without production

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

gem 'rake'
gem 'rspec'
#https://qiita.com/yuya_takeyama/items/25fe83dc2f03a5b67ef9
gem 'sinatra', '~> 2.0.0.rc2'
gem 'sinatra-validation'
gem 'sinatra-contrib'
#gem 'sinatra-namespace'
#gem 'activerecord'
#gem 'sinatra-activerecord'
#gem 'pg'
gem 'rack-contrib'
gem 'eventmachine', :github => 'eventmachine/eventmachine'

#Rubyからgitする
#https://qiita.com/b_a_a_d_o/items/9f7768392a0f935c7543
#https://github.com/ruby-git/ruby-git
gem 'git'

# #Dotenv使ってみた
# #https://qiita.com/ogawatti/items/e1e612b793a3d51978cc
# gem 'dotenv'

#設定ファイルの読み込みにHashie::Mash使ってる
#http://shokai.org/blog/archives/7976
gem 'hashie', github: "hashie/hashie"