#require "bundler/setup"
#Bundler.require
# not bundle
# my class
require File.expand_path("../yaml_util.rb", __FILE__)

module KyoRyoJoe

    class Tools

        def clone(junme_dir, url, mailaddress, password)
            auth_url = (mailaddress || password) ? GitUtil.get_auth_url(url, mailaddress, password) : url
            GitUtil.clone(auth_url, junme_dir)
        end

        def download repository_path
            name = File.basename(repository_path)
            message = "Tools.download(#{name}): #{Time.now}"
            begin
                GitUtil.refresh(GitUtil.open(repository_path), message)
            rescue Exception => e
                raise StandardError.new("#{name}のpullに失敗しました: #{e.message}")
            end
        end
        def upload repository_path
            name = File.basename(repository_path)
            message = "Tools.upload(#{name}): #{Time.now}"
            begin
                GitUtil.update(repository_path, message)
            rescue Exception => e
                raise StandardError.new("#{name}のcommit, pushに失敗しました: #{e.message}")
            end
        end

    end

end