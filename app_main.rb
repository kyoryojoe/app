require "bundler/setup"
Bundler.require

require "date"

# cleaner
EM::defer do
    #biz = Biz.new
    loop do
        begin
            #biz.cleaning
            #sleep 15 * 60
        rescue
            #sleep 5 * 60
        end
    end
end

# server
class MyApp < Sinatra::Base

    GIT_FORMAT = /^https?:\/\/.*\.git$/
    MAIL_FORMAT = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    UUID_FORMAT = /^[0-9a-zA-Z\-]{36}$/
    HEX8_FORMAT = /^[0-9a-zA-Z]{16}$/
    DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/
    DATETIME_FORMAT = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)? [+-]?\d{4}$/
    BASE64IMG_FORMAT = /^data:image\/[a-z]+;base64,[a-zA-Z0-9+\/]+=*$/
    ADMIN_FLG = true # ATTENTION: 競合回避のため1台のみ設定すること
    ADMIN_URL = nil # [ADMIN_FLG = false]のとき必須

    PUBLIC_ROOT_DIR = File.expand_path("public")
    INSPECT_BASE_DIR = File.expand_path("public/inspects")
    FileUtils.mkdir_p(INSPECT_BASE_DIR) if !FileTest.exists?(INSPECT_BASE_DIR)
    
    configure do
        set :bind, '0.0.0.0'
        enable :sessions
        use Rack::JSONBodyParser
        register Sinatra::Validation
        register Sinatra::Namespace
        register Sinatra::Reloader#TODO: not working?
        set :show_exceptions, :after_handler# in development, false or :after_handler
    end
    helpers do
        def inspect
            @inspect ||= KyoRyoJoe::Inspect.new(PUBLIC_ROOT_DIR, INSPECT_BASE_DIR)
        end
        def tools
            @tools ||= KyoRyoJoe::Tools.new
        end
        def current_junme
            ((Date.today.year - 2014) / 5).floor + 1;
        end
    end
    error 500 do
        p e = env['sinatra.error']
        status 500
        {:message => e.message}.to_json
    end
    # web helper

    # 
    # APP
    # 
    get /\..+/ do
        404
    end
    get '/' do
        redirect '/index.html'
    end

    # settings for all
    # get "/api/config" do #=> get config
    #     {
    #         admin: is_admin,
    #         myself: is_myself,
    #         junme: current_junme,
    #     }.to_json
    # end

    #########
    # Tools
    #########
    URL_FOR_TOOLS = "/api/tools"
    namespace URL_FOR_TOOLS do
        put '/clone/:junme' do
            validates{ params{
                required(:junme).filled(:integer)
                required(:url).filled(:string, format?: GIT_FORMAT)
                optional(:mailaddress).maybe(:string, format?: MAIL_FORMAT)
                optional(:password).maybe(:string)
            }}
            junme_dir = inspect.junme_to_dirpath(params[:junme].to_i)
            tools.clone(junme_dir, params[:url], params[:mailaddress], params[:password])
            200
        end
        
    end


    #########
    # Inspect
    #########
    URL_FOR_INSPECT = "/api/inspect"
    namespace URL_FOR_INSPECT do
    
        get '/' do
            inspect.get_repositories.to_json
        end
        get '/:junme/bridges' do
            validates{ params{
                required(:junme).filled(:integer)
            }}
            inspect.get_bridges(params[:junme].to_i).to_json
        end
        get '/:junme/bridges/:bridge_id' do
            validates{ params{
                required(:junme).filled(:integer)
                required(:bridge_id).filled(:integer)
            }}
            bridges = inspect.get_bridges(params[:junme].to_i)
            bridges.find{|bridge|
                bridge[:id] == params[:bridge_id].to_i
            }.to_json
        end
        put '/:junme/inspects/:bridge_id' do
            validates{ params{
                required(:junme).filled(:integer)
                required(:bridge_id).filled(:integer)
            }}
            inspect_cd = inspect.create_new_inspect(params[:junme].to_i, params[:bridge_id].to_i)
            { inspect_cd: inspect_cd }.to_json
        end
        get '/:junme/inspects/:bridge_id/:inspect_cd' do
            validates{ params{
                required(:junme).filled(:integer)
                required(:bridge_id).filled(:integer)
                required(:inspect_cd).filled(:string, format?: HEX8_FORMAT)
            }}
            _inspect = inspect.get_inspect(params[:junme].to_i, params[:bridge_id].to_i, params[:inspect_cd].downcase)
            _inspect.to_json
        end
        get '/:junme/inspects/:bridge_id/:inspect_cd/templates' do
            validates{ params{
                required(:junme).filled(:integer)
                required(:bridge_id).filled(:integer)
                required(:inspect_cd).filled(:string, format?: HEX8_FORMAT)
            }}
            {
                members: BRIDGE_MEMBER_TREE,
                check: {
                    image: nil, seq: nil, memo: "",
                    map: { x: 0, y: 0, z: 0 },# xy: -1.0~1.0, z: 0<0.5
                    damages: [],
                },
                damage: {
                    image: nil, seq: nil, memo: "", 
                    judge_kbn: 0,# 0, 1 ~ 4
                    map: { x: 0, y: 0, z: 0 },# xy: -1.0~1.0, z: 0<0.5
                }
            }.to_json
        end
        post '/:junme/inspects/:bridge_id/:inspect_cd' do
            # TODO: 深い定義。。
            # inspect_key_type = Dry::Schema.Params do
            #     required(:junme).filled(:integer)
            #     required(:bridge_id).filled(:integer)
            #     required(:inspect_cd).filled(:string, format?: HEX8_FORMAT)
            # end
            # header_type = Dry::Schema.Params do
            #     required(:junme).filled(:integer)
            #     required(:bridge_id).filled(:integer)
            #     required(:inspect_cd).filled(:string, format?: HEX8_FORMAT)
            #     required(:judge_kbn).filled(:integer)
            #     required(:created).filled(:string, format?: DATETIME_FORMAT)
            #     optional(:finished).maybe(:string, format?: DATETIME_FORMAT)
            #     optional(:latest).maybe(inspect_key_type)
            # end    
            # bridge_type = :hash #TODO: 定義疲れた
            # outline_type = Dry::Schema.Params do
            #     optional(:image).maybe(:string)
            #     optional(:memo).maybe(:string)
            # end    
            # inspect_type = :hash #TODO: 定義疲れた
            validates{ params{
                required(:junme).filled(:integer)
                required(:bridge_id).filled(:integer)
                required(:inspect_cd).filled(:string, format?: HEX8_FORMAT)
                # required(:data).value(inspect_type)
                required(:header).filled()
                required(:bridge).filled()
                required(:outline).filled()
                required(:inspects).filled()#.value(:array).each(assign_type)
            }}
            data = {
                header: params[:header],
                bridge: params[:bridge],
                outline: params[:outline],
                inspects: params[:inspects],
            }
            inspect.save_inspect(params[:junme].to_i, params[:bridge_id].to_i, params[:inspect_cd].downcase, data)
            200
        end

        post '/:junme/inspects/:bridge_id/:inspect_cd/image/outline' do
            validates{ params{
                required(:junme).filled(:integer)
                required(:bridge_id).filled(:integer)
                required(:inspect_cd).filled(:string, format?: HEX8_FORMAT)
                required(:base64).filled(:string, format?: BASE64IMG_FORMAT)
            }}
            inspect.save_outline_image(params[:junme].to_i, params[:bridge_id].to_i, params[:inspect_cd].downcase, params[:base64])
        end
        post '/:junme/inspects/:bridge_id/:inspect_cd/image/part/:part_cd/:part_seq' do
            validates{ params{
                required(:junme).filled(:integer)
                required(:bridge_id).filled(:integer)
                required(:inspect_cd).filled(:string, format?: HEX8_FORMAT)
                required(:part_cd).filled(:string)
                required(:part_seq).filled(:integer)
                required(:base64).filled(:string, format?: BASE64IMG_FORMAT)
            }}
            inspect.save_part_image(params[:junme].to_i, params[:bridge_id].to_i, params[:inspect_cd].downcase, params[:part_cd].downcase, params[:part_seq].to_i, params[:base64])
        end
        post '/:junme/inspects/:bridge_id/:inspect_cd/image/check/:part_cd/:part_seq/:check_seq' do
            validates{ params{
                required(:junme).filled(:integer)
                required(:bridge_id).filled(:integer)
                required(:inspect_cd).filled(:string, format?: HEX8_FORMAT)
                required(:part_cd).filled(:string)
                required(:part_seq).filled(:integer)
                required(:check_seq).filled(:integer)
                required(:base64).filled(:string, format?: BASE64IMG_FORMAT)
            }}
            inspect.save_check_image(params[:junme].to_i, params[:bridge_id].to_i, params[:inspect_cd].downcase, params[:part_cd].downcase, params[:part_seq].to_i, params[:check_seq].to_i, params[:base64])
        end
        post '/:junme/inspects/:bridge_id/:inspect_cd/image/damage/:part_cd/:part_seq/:check_seq/:damage_seq' do
            validates{ params{
                required(:junme).filled(:integer)
                required(:bridge_id).filled(:integer)
                required(:inspect_cd).filled(:string, format?: HEX8_FORMAT)
                required(:part_cd).filled(:string)
                required(:part_seq).filled(:integer)
                required(:check_seq).filled(:integer)
                required(:damage_seq).filled(:integer)
                required(:base64).filled(:string, format?: BASE64IMG_FORMAT)
            }}
            inspect.save_damage_image(params[:junme].to_i, params[:bridge_id].to_i, params[:inspect_cd].downcase, params[:part_cd].downcase, params[:part_seq].to_i, params[:check_seq].to_i, params[:damage_seq].to_i, params[:base64])
        end


    end#Inspect



    #######################################################################################

    # Members
    put '/api/members' do # Create => Member
        validates{ params{
            required(:name).filled(:string)
        }}
        biz.create_member(params[:name]).to_json
    end
    post '/api/members' do # Update => Member
        validates{ params{
            required(:id).filled(:integer)
            required(:name).filled(:string)
        }}
        biz.update_member(params[:id], params[:name]).to_json
    end
    delete '/api/members' do # Delete => nil
        validates{ params{
            required(:id).filled(:integer)
        }}
        biz.delete_member(params[:id])
        200
    end

    get '/api/members/all' do # Read => [Member]
        biz.select_all_members().to_json
    end


    # Projects
    put '/api/projects' do # Create => Project
        validates{ params{
            required(:name).filled(:string)
            optional(:note).maybe(:string)
            required(:volume).filled(:integer)
            required(:start).filled(:string, format?: DATE_FORMAT)
            required(:last).filled(:string, format?: DATE_FORMAT)
        }}
        name, note, volume, start, last = params[:name], params[:note], params[:volume], params[:start], params[:last]
        biz.create_project(name, note, volume, Date.parse(start), Date.parse(last)).to_json
    end
    post '/api/projects' do # Update => Project
        validates{ params{
            required(:id).filled(:integer)
            required(:name).filled(:string)
            optional(:note).maybe(:string)
            required(:volume).filled(:integer)
            required(:start).filled(:string, format?: DATE_FORMAT)
            required(:last).filled(:string, format?: DATE_FORMAT)
        }}
        id, name, note, volume, start, last = params[:id], params[:name], params[:note], params[:volume], params[:start], params[:last]
        biz.update_project(id, name, note, volume, Date.parse(start), Date.parse(last)).to_json
    end
    delete '/api/projects' do # Delete => nil
        validates{ params{
            required(:id).filled(:integer)
        }}
        biz.delete_project(params[:id])
        200
    end

    get '/api/projects/all' do # Read => [Project]
        biz.select_all_projects().to_json
    end
    get '/api/projects/relation' do # Read => {[Project], [Assign], [Member]}
        validates{ params{
            required(:start).filled(:string, format?: DATE_FORMAT)
            required(:last).filled(:string, format?: DATE_FORMAT)
        }}
        start, last = Date.parse(params[:start]), Date.parse(params[:last])
        {
            projects: biz.select_between_projects(start, last),
            assigns: biz.select_between_assigns(start, last),
            members: biz.select_between_members(start, last),
        }.to_json
    end

    # assign
    put '/api/assigns' do
        validates{ params{
            required(:projects_id).filled(:integer)
            required(:members_id).filled(:integer)
        }}
        biz.create_assign(params[:projects_id], params[:members_id]).to_json
    end
    delete '/api/assigns' do
        validates{ params{
            required(:id).filled(:integer)
        }}
        biz.delete_assign(params[:id])
        200
    end
    post '/api/assigns/edit' do#=>[Assign] *created
        assign_type = Dry::Schema.Params do
            optional(:id).maybe(:integer)
            required(:projects_id).filled(:integer)
            required(:members_id).filled(:integer)
        end
        validates{ params{
            required(:delete_list).value(:array).each(assign_type)
            required(:create_list).value(:array).each(assign_type)
        }}
        biz.edit_assign(params[:delete_list], params[:create_list]).to_json
    end

end
