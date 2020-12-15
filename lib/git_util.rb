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

        # 競合したファイルはchangedで検出されるのは間違いない
        # statusで見たときの「type」「stage」が空じゃない？よくわからん
        #
        # status.changed
        # => {"bridges.yaml"=>#<Git::Sta...
        # status['bridges.yaml']
        # => #<Git::Status::StatusFile:0x0000000002fdbbf8 @base=#<Git::Base:0x000...>>, 
        #    @path="bridges.yaml", 
        #    @type="M", #←
        #    @stage="3", #←
        #    @mode_index="100644", 
        #    @mode_repo="100644", 
        #    @sha_index="0000000000000000000000000000000000000000", 
        #    @sha_repo="8d217cbbc094548a87446c39c893755a5e7b950d", 
        #    @untracked=nil>

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

    def self.refresh git, clear_change=false
        #※参照専用なのでローカルの変更を無効にする
        #  GitHubリポジトリ作っただけ（コミットなし？）だとエラー
        git.checkout if clear_change# git checkout .
        #最新に更新
        git.pull
    end

end