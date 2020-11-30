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

    end

end