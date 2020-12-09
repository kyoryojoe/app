#require "bundler/setup"
#Bundler.require
# not bundle
require 'securerandom'
require 'base64'
# my class
require File.expand_path("../yaml_util.rb", __FILE__)
require File.expand_path("../git_util.rb", __FILE__)
#require File.expand_path("../nichiji_util.rb", __FILE__)
require File.expand_path("../const.rb", __FILE__)

module KyoRyoJoe
    ARGUMENTS="ARGUMENTS".freeze
    NOT_FOUND="NOT_FOUND".freeze
    LOG2ALERT="LOG2ALERT"

    DATETIEM_FORMAT = "%Y%m%dT%H%M%S%z"

    INSPECTDIR_DIGIT = 8
    REPO_ROOTDIR = "repositories"
    INSPECT_DIRNAME_PREFIX = "junme"
    INSPECT_DIRNAME_REGEX = /^junme(\d+)$/
    BRIDGE_DIRNAME_PREFIX = "bridge"
    BRIDGE_DIRNAME_REGEX = /^bridge(\d+)$/
    BRIDGES_FILENAME = "bridges.yaml"
    BRIDGE_FILENAME = "bridge.yaml"
    INSPECT_FILENAME = "inspect.yaml"
    
    OUTLINEIMG_FILENAME_TEMPLATE = "outline"
    PARTIMG_FILENAME_TEMPLATE = "part"
    CHECKIMG_FILENAME_TEMPLATE = "check"
    DAMAGEIMG_FILENAME_TEMPLATE = "damage"

    class Inspect

        def junme_to_dirname junme
            raise "junme(#{junme}) must be number." if !junme.is_a?(Numeric)
            "#{INSPECT_DIRNAME_PREFIX}#{junme}"
        end
        def junme_to_dirpath junme
            File.join(@repo_root_dir, junme_to_dirname(junme))
        end
        def dirpath_to_junme path
            raise "path(#{path}) is not exists." if !FileTest.exists?(path)
            raise "path(#{path}) is not directory." if !File.directory?(path)
            basename = File.basename(path)
            if INSPECT_DIRNAME_REGEX =~ basename then
                $1.to_i
            else
                raise "dirname(#{basename}) is not expected."
            end
        end

        def bridge_id_to_dirname bridge_id
            raise "bridge_id(#{bridge_id}) must be number." if !bridge_id.is_a?(Numeric)
            "#{BRIDGE_DIRNAME_PREFIX}#{bridge_id}"
        end
        def dirpath_to_bridge_id path
            raise "path(#{path}) is not exists." if !FileTest.exists?(path)
            raise "path(#{path}) is not directory." if !File.directory?(path)
            basename = File.basename(path)
            if BRIDGE_DIRNAME_REGEX =~ basename then
                $1.to_i
            else
                raise "dirname(#{basename}) is not expected."
            end
        end

        def initialize public_dir, base_dir
            raise "public_dir(#{public_dir}) not exists." if !FileTest.exists?(public_dir)
            raise "base_dir(#{base_dir}) not exists." if !FileTest.exists?(base_dir)
            @public_dir = public_dir
            @repo_root_dir = File.join(base_dir, REPO_ROOTDIR)
            FileUtils.mkdir_p(@repo_root_dir) if !FileTest.exists?(@repo_root_dir)
        end

        def get_repositories
            pattern = File.join(@repo_root_dir, "*")
            Dir.glob(pattern).map{|dir|
                basename = File.basename(dir)
                {
                    path: File.expand_path(dir),
                    basename: File.basename(dir), 
                    junme: dirpath_to_junme(dir),
                    need_sync: GitUtil.need_sync?(dir),
                }
            }.select{|entry|
                dirpath = File.join(@repo_root_dir, entry[:basename])
                is_dir = (INSPECT_DIRNAME_REGEX =~ entry[:basename])
                is_repo = FileTest.exists?(File.join(dirpath, ".git"))
                has_bridge = FileTest.exists?(File.join(dirpath, BRIDGES_FILENAME))
                is_dir && is_repo && has_bridge
            }
        end

        def get_bridges junme, with_status=true
            #
            # TODO: cache?
            #
            junme_dir = junme_to_dirname(junme)
            bridges_file = File.join(@repo_root_dir, junme_dir, BRIDGES_FILENAME)
            plain_bridges = YamlUtil.get_file_or_new_data(bridges_file, [])
            return plain_bridges if !with_status

            inspect_files = Dir.glob(File.join(@repo_root_dir, junme_dir, "*", "*", INSPECT_FILENAME))
            statuses = inspect_files.map{|file|
                inspect = YamlUtil.get_file_or_new_data(file, {})
                header, bridge, outline = inspect[:header], inspect[:bridge], inspect[:outline]
                {
                    junme: junme,
                    bridge_id: bridge[:id],
                    inspect_cd: header[:inspect_cd],
                    date: header[:finished],
                    image: outline[:image] || nil,
                    judge_kbn: header[:judge_kbn] || 0,
                }
            }.select{|status|
                status[:junme] && status[:bridge_id] && status[:inspect_cd]
            }

            bridges = plain_bridges.map{|bridge|
                bridge[:inspects] = statuses.select{|status|
                    bridge[:id] == status[:bridge_id]
                }
                bridge
            }
            return bridges
        end

        def path_to_url filepath
            fullpath = File.expand_path(filepath)
            public_dir = File.expand_path(@public_dir)
            raise "path not exists: #{fullpath}" if !FileTest.exists?(fullpath)
            raise "path isnt in public: #{fullpath}" if !fullpath.start_with?(public_dir)

            tailpath = filepath[(public_dir.length)..-1]
            url = tailpath.gsub(File::ALT_SEPARATOR || File::SEPARATOR, "/")
            return url
        end

        def get_bridge_dir junme, bridge_id
            junmedir = junme_to_dirname(junme)
            bridgedir = bridge_id_to_dirname(bridge_id)
            File.join(@repo_root_dir, junmedir, bridgedir)
        end

        def get_inspect_dir junme, bridge_id, inspect_cd
            bridge_dir = get_bridge_dir(junme, bridge_id)
            junmedir = junme_to_dirname(junme)
            bridgedir = bridge_id_to_dirname(bridge_id)
            File.join(bridge_dir, inspect_cd)
        end

        def create_new_inspect junme, bridge_id#=>inspect_cd
            inspect_cd = SecureRandom.hex(INSPECTDIR_DIGIT)
            inspect_dir = get_inspect_dir(junme, bridge_id, inspect_cd)
            if !FileTest.exists?(inspect_dir) then
                FileUtils.mkdir_p(inspect_dir)
                bridges = get_bridges(junme, false)
                bridge = bridges.find{|bridge|
                    bridge[:id] == bridge_id
                }
                p bridge
                raise "bridge[junme:#{junme}, bridge_id: #{bridge_id}] not found." if !bridge

                inspect_file = File.join(inspect_dir, INSPECT_FILENAME)
                inspect = get_new_inspect_data(junme, bridge, inspect_cd)
                YamlUtil.save(inspect_file, inspect)

                return inspect_cd
            else
                return create_new_inspect junme, bridge_id
            end
        end

        def get_new_inspect_data junme, bridge, inspect_cd
            inspect = {
                header: {
                    junme: junme,
                    bridge_id: bridge[:id],
                    inspect_cd: inspect_cd,
                    judge_kbn: 0,
                    memo: "",
                    created: Time.now,
                    finished: nil,
                    latest: seek_inspect_key(junme - 1, bridge[:id]),
                },
                bridge: bridge,
                outline: { image: nil, memo: "" },
                inspects: [],
            }
            inspects = inspect[:inspects]
            base = {
                # group: "", part: "", name: "",
                image: nil, seq: 0, memo: "", #checks: [],
                # checks: [{
                #     image: nil, seq: 0, memo: "",
                #     map: { x: 0, y: 0, z: 0 } # xy: -1.0~1.0, z: 0<0.5
                #     damages: [{
                #         image: nil, seq: 0, memo: "", 
                #         judge_kbn: 0, # 0, 1 ~ 4
                #         map: { x: 0, y: 0, z: 0 } # xy: -1.0~1.0, z: 0<0.5
                #     }]
                # }],
            }

            counter, func = 0, Proc.new { counter += 1 }
            inspects.push(base.merge({ seq: func.call, group: GROUP_UPPER, part: PART_PAVEMENT, name: NAME_PAVEMENT, checks: [] }))#舗装面１つ
            number_of_griders = bridge[:number_of_griders] || 0
            number_of_griders.times{#主桁
                inspects.push(base.merge({
                    seq: func.call, group: GROUP_UPPER, part: PART_GRIDER, name: NAME_GRIDER, checks: []
                }))
            }
            number_of_beams = bridge[:number_of_beams] || 0
            number_of_beams.times{#横桁
                inspects.push(base.merge({
                    seq: func.call, group: GROUP_UPPER, part: PART_BEAM, name: NAME_BEAM, checks: [] 
                }))
            }
            inspects.push(base.merge({ seq: func.call, group: GROUP_UPPER, part: PART_DECK, name: NAME_DECK, checks: [] }))#床板１つ
            # 2.times{#支承部 #TODO: 橋データ中にフラグを設置する？
            #     inspects.push(base.merge({
            #         seq: func.call, group: GROUP_SUPPORT, part: PART_SUPPORT, name: NAME_SUPPORT, checks: []
            #     }))
            # }
            2.times{#橋台
                inspects.push(base.merge({
                    seq: func.call, group: GROUP_UNDER, part: PART_ABUTMENT, name: NAME_ABUTMENT, checks: []
                }))
            }
            number_of_piers = bridge[:number_of_piers] || 0
            number_of_piers.times{#橋脚
                inspects.push(base.merge({
                    seq: func.call, group: GROUP_UNDER, part: PART_PIER, name: NAME_PIER, checks: []
                }))
            }
            #その他は手入力！
            #other = base.merge({ seq: 0, group: GROUP_OTHER, part: PART_OTHER, name: NAME_OTHER })
            return inspect
        end

        def get_inspect junme, bridge_id, inspect_cd#=>inspect: {}
            inspect_dir = get_inspect_dir(junme, bridge_id, inspect_cd)
            inspect_file = File.join(inspect_dir, INSPECT_FILENAME)
            if FileTest.exists?(inspect_file) then
                return YamlUtil.load(inspect_file)
            else
                raise "inspect[junme:#{junme}, bridge_id: #{bridge_id}, inspect_cd: #{inspect_cd}] not found."
            end
        end

        def seek_inspect junme, bridge_id
            bridge_dir = get_bridge_dir(junme, bridge_id)
            inspect_files = Dir.glob(File.join(bridge_dir, "*", INSPECT_FILENAME))
            inspects = inspect_files.map{|file|
                YamlUtil.load(file)
            }.sort{|a, b|
                d = DateTime.parse("2000-01-01")
                ahead, bhead = a[:header] || {}, b[:header] || {}
                acre = NichijiUtil.parse_or_default(ahead[:created], d)
                bcre = NichijiUtil.parse_or_default(bhead[:created], d)
                afin = NichijiUtil.parse_or_default(ahead[:finished], d)
                bfin = NichijiUtil.parse_or_default(bhead[:finished], d)
                return (bfin <=> afin) || (bcre <=> acre)
            }
            return inspects.first
        end

        def seek_inspect_key junme, bridge_id
            inspect = seek_inspect(junme, bridge_id)
            return nil if !inspect
            {
                junme: junme,
                bridge_id: bridge_id,
                inspect_cd: inspect[:header][:inspect_cd]
            }
        end

        def save_inspect junme, bridge_id, inspect_cd, data
            inspect_dir = get_inspect_dir(junme, bridge_id, inspect_cd)
            inspect_file = File.join(inspect_dir, INSPECT_FILENAME)
            puts "path to save: #{inspect_file}"
            p data
            YamlUtil.save(inspect_file, data)
        end

        def base64img_handle base64img
            head, base64 = *base64img.split(";base64,")
            raise "may be not base64 image: #{base64img}" if !head || !base64
            raise "may be not base64 image: #{head}" if head !~ /^data:image\/\w+$/
            ext = head.split("/").pop.downcase
            bin = Base64.decode64(base64)
            { bin: bin, ext: ext }
        end
        def save_img_to_file(junme, bridge_id, inspect_cd, base64, &block)
            inspect_dir = get_inspect_dir(junme, bridge_id, inspect_cd)
            handle = base64img_handle(base64)
            filename = block.call(handle)
            inspect_file = File.join(inspect_dir, filename)
            File.open(inspect_file, 'wb'){|f| f.write(handle[:bin]) }
            return path_to_url(inspect_file)
        end
        def save_outline_image junme, bridge_id, inspect_cd, base64
            save_img_to_file(junme, bridge_id, inspect_cd, base64){|handle|
                "#{OUTLINEIMG_FILENAME_TEMPLATE}.#{handle[:ext]}"
            }
        end
        def save_part_image junme, bridge_id, inspect_cd, part_cd, part_seq, base64
            save_img_to_file(junme, bridge_id, inspect_cd, base64){|handle|
                "#{PARTIMG_FILENAME_TEMPLATE}_#{part_cd}_#{part_seq}.#{handle[:ext]}"
            }
        end
        def save_check_image junme, bridge_id, inspect_cd, part_cd, part_seq, check_seq, base64
            save_img_to_file(junme, bridge_id, inspect_cd, base64){|handle|
                "#{CHECKIMG_FILENAME_TEMPLATE}_#{part_cd}_#{part_seq}_#{check_seq}.#{handle[:ext]}"
            }
        end
        def save_damage_image junme, bridge_id, inspect_cd, part_cd, part_seq, check_seq, damage_seq, base64
            save_img_to_file(junme, bridge_id, inspect_cd, base64){|handle|
                "#{DAMAGEIMG_FILENAME_TEMPLATE}_#{part_cd}_#{part_seq}_#{check_seq}_#{damage_seq}.#{handle[:ext]}"
            }
        end
    end

end