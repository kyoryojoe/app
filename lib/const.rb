#
# 部材
#   橋梁の英和・和英辞典
#   https://www.e-bridge.jp/eb/tcontents/bridgedic/bridgedic.php
#
GROUP_UPPER   = 'GROUP_UPPER'   #上部構造
    PART_PAVEMENT = 'PART_PAVEMENT'; NAME_PAVEMENT = '舗装面' #舗装面
    PART_GRIDER   = 'PART_GRIDER'  ; NAME_GRIDER   = '主桁'   #主桁
    PART_BEAM     = 'PART_BEAM'    ; NAME_BEAM     = '横桁'   #横桁
    PART_DECK     = 'PART_DECK'    ; NAME_DECK     = '床板'   #床板
GROUP_SUPPORT = 'GROUP_SUPPORT' #支承部
    PART_SUPPORT  = 'PART_SUPPORT' ; NAME_SUPPORT  = '支承部' #支承部
GROUP_UNDER   = 'GROUP_UNDER'   #下部構造
    PART_ABUTMENT = 'PART_ABUTMENT'; NAME_ABUTMENT = '橋台'   #橋台
    PART_PIER     = 'PART_PIER'    ; NAME_PIER     = '橋脚'   #橋脚
GROUP_ROAD   = 'GROUP_ROAD'   #路上
GROUP_OTHER   = 'GROUP_OTHER'   #その他
    PART_OTHER    = 'PART_OTHER'   ; NAME_OTHER    = ''       #その他※手入力！

BRIDGE_MEMBER_TREE = [
    { group: GROUP_UPPER,  part: PART_PAVEMENT, name: NAME_PAVEMENT },#舗装面
    { group: GROUP_UPPER,  part: PART_GRIDER  , name: NAME_GRIDER   },#主桁
    { group: GROUP_UPPER,  part: PART_BEAM    , name: NAME_BEAM     },#横桁
    { group: GROUP_UPPER,  part: PART_DECK    , name: NAME_DECK     },#床板
    { group: GROUP_SUPPORT,part: PART_SUPPORT , name: NAME_SUPPORT  },#支承部
    { group: GROUP_UNDER,  part: PART_ABUTMENT, name: NAME_ABUTMENT },#橋台
    { group: GROUP_UNDER,  part: PART_PIER    , name: NAME_PIER     },#橋脚
    { group: GROUP_UPPER,  part: PART_OTHER, name: "" },#上部構造その他（nameは手入力）
    { group: GROUP_ROAD,   part: PART_OTHER, name: "" },#路上その他（nameは手入力）
    { group: GROUP_SUPPORT,part: PART_OTHER, name: "" },#支承部その他（nameは手入力）
    { group: GROUP_UNDER,  part: PART_OTHER, name: "" },#下部構造その他（nameは手入力）
    { group: GROUP_OTHER,  part: PART_OTHER, name: "" },#その他（nameは手入力）
]


#
# TODO: ファイル分けるかも
#
require 'date'
require 'time'
module NichijiUtil

    def self.parse_or_nil val
        return nil if val == nil
        return nil if val == ""
        begin
            return DateTime.parse(val)
        rescue => exception
            return nil
        end
    end

    def self.parse_or_default val, default
        return parse_or_nil || default
    end

end