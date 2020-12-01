require 'git'
require 'uri'
require 'fileutils'

module GitUtil

    def self.get_auth_url url, username=nil, password=nil
        auth = [
            URI.encode_www_form_component(username),
            (username && password) ? ':' : '',
            URI.encode_www_form_component(password),
        ].join("");
        if auth.empty? || url.match(/@/)
            return url
        else
            return url.gsub(/^https?:\/\//){|match|
                "#{match}#{auth}@"
            }
        end
    end

    def self.clone auth_url, repository_path
        if FileTest.exists?(repository_path)
            raise "local repository(#{repository_path}) already exists: #{auth_url}"
        end
        Git.clone auth_url, repository_path
    end

    def self.open repository_path
        if !FileTest.exists?(repository_path)
            raise "repository #{repository_path} is not found."
        end
        Git.open repository_path
    end

    def self.need_sync? dir#=> boolean
        git = open(dir)
        status = git.status
        count = status.changed.length + status.added.length + status.deleted.length + status.untracked.length
        count > 0 ? true : false
    end

    def self.create auth_url, repository_path, commit_message#, &pre_action
        git = clone(auth_url, repository_path)
        yield if block_given?

        sleep 1 #need wait...?
        commit_and_push(git, commit_message)
    end

    def self.update repository_path, commit_message#, &pre_action

        git = open(repository_path)
        yield if block_given?

        sleep 1 #need wait...?
        commit_and_push(git, commit_message)
    end

    def self.commit_and_push git, commit_message, allow_empty=true
        git.add# all
        git.commit_all(commit_message, { allow_empty: allow_empty })
        git.push
    end

    def self.refresh git
        #※参照専用なのでローカルの変更を無効にする
        #  GitHubリポジトリ作っただけ（コミットなし？）だとエラー
        git.checkout# git checkout .
        #最新に更新
        git.pull
    end

end