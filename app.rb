require "bundler/setup"
Bundler.require
# load env
#Dotenv.load

require 'sinatra/reloader' #if development?

require File.expand_path("../lib/kyo-ryo-joe_inspect.rb", __FILE__)
require File.expand_path("../lib/kyo-ryo-joe_tools.rb", __FILE__)
require File.expand_path("../app_main.rb", __FILE__)


if $0 == __FILE__ then
   MyApp.run! :host => 'localhost'
end
