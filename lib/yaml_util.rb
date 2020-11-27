require 'fileutils'
require 'hashie'

module YamlUtil

    def self.load file_path
        json = YAML.load_file(file_path).to_json
        JSON.parse(json, symbolize_names: true)
    end

    def self.save file_path, data
        File.open(file_path, 'w'){|f|
            YAML.dump(JSON.parse(data.to_json, symbolize_names: true), f)
        }
    end

    def self.get_file_or_new_data file_path, init_data, write_file=false
        if FileTest.exists?(file_path) then
            load(file_path)
        else
            save(file_path, init_data) if write_file
            #YAML.dump(init_data, File.open(file_path, 'w')) if write_file
            init_data
        end
    end

end