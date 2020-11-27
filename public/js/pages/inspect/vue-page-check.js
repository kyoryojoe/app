"use: strinct;";

(function(g){

/** bridge */
const check_name = g.check_name = "check_page";
const check_path = g.check_path = "/check/:junme/:bridge_id/:inspect_cd/:part_cd/:part_seq"
const check_page = g.check_page = {
    template: '#CHECK_PAGE_TEMPLATE',
    data: function(){
        return {
            junme: null,
            bridge_id: null,
            inspect_cd: null,
            part_cd: null,
            part_seq: null,
            bridge: {},
            data: {},
            inspect: {},
            ui: {
                render_inspect: true,
                sort_check_desc: true,
            },
        };
    },
    computed: {
        check_list: function(){
            const list = (this.inspect.checks || []).concat();
            return this.ui.sort_check_desc ? list.reverse() : list;
        },
    },
    beforeMount: function(){
        const self = this;
        const junme = this.junme = this.$route.params.junme * 1;
        const bridge_id = this.bridge_id = this.$route.params.bridge_id * 1;
        const inspect_cd = this.inspect_cd = this.$route.params.inspect_cd;
        const part_cd = this.part_cd = this.$route.params.part_cd;
        const part_seq = this.part_seq = this.$route.params.part_seq * 1;
        g.API.get_inspect(junme, bridge_id, inspect_cd).then(function(response){
            const data = self.data = response.data;
            self.bridge = data.bridge;
            const inspect = self.inspect = data.inspects.find(function(inspect){
                return inspect.part == part_cd && inspect.seq == part_seq;
            });
            if(inspect){
                inspect.checks.forEach(function(check){
                    check.ui = Vue.observable({ open: true, render: true });
                    check.damages.forEach(function(damage){
                        damage.ui = Vue.observable({ open: true, render: true });
                    });    
                });
            }
        });
    },
    mounted: function(){
        this.$emit("page_junme", {junme: this.junme});
    },
    methods: {
        rerender_inspect: function(){
            const self = this;
            this.ui.render_inspect = false;
            this.$nextTick(function(){
                self.ui.render_inspect = true;
            });
        },
        rerender_check: function(check){
            const self = this;
            this.ui.render_inspect = false;
            check.ui.render = false;
            this.$nextTick(function(){
                self.ui.render_inspect = true;
                check.ui.render = true;
            });
        },
        rerender_damage: function(check, damage){
            const self = this;
            // check.ui.render = false;
            damage.ui.render = false;
            this.$nextTick(function(){
                // check.ui.render = true;
                damage.ui.render = true;
            });
        },
        toggle_check_open: function(check){
            check.ui.open = !check.ui.open;
            check.ui.render = false;
            this.$nextTick(function(){
                check.ui.render = true;
            });
        },
        toggle_damage_open: function(damage){
            damage.ui.open = !damage.ui.open;
            damage.ui.render = false;
            this.$nextTick(function(){
                damage.ui.render = true;
            });
        },

        get_reversed_damages: function(check){
            const list = (check.damages || []).concat();
            return this.ui.sort_check_desc ? list.reverse() : list;
        },

        save_inspect: function(callback){
            const params = {
                junme: this.junme,
                bridge_id: this.bridge_id,
                inspect_cd: this.inspect_cd,
                header: this.data.header,
                bridge: this.data.bridge,
                outline: this.data.outline,
                inspects: this.data.inspects,
            };
            g.Biz.save_inspect(params, callback);
        },
        save_and_rerender_inspect: function(){
            const self = this;
            const callback = function(){
                self.rerender_inspect();
            };
            this.save_inspect(callback);
        },
        save_and_rerender_check: function(check){
            const self = this;
            const callback = function(){
                self.rerender_check(check);
            };
            this.save_inspect(callback);
        },
        save_and_rerender_damage: function(check, damage){
            const self = this;
            const callback = function(){
                self.rerender_damage(check, damage);
            };
            this.save_inspect(callback);
        },
        
        get_part_judge_kbn: function(part){ return g.Biz.get_part_judge_kbn(part); },
        get_check_judge_kbn: function(check){ return g.Biz.get_check_judge_kbn(check); },
        get_damage_judge_kbn: function(damage){ return damage.judge_kbn || 0; },

        on_append_check: function(){
            const self = this;
            const checks = this.inspect.checks;
            const check = g.Biz.get_empty_check_entry(checks);
            check.ui = { open: true, render: true };
            const callback = function(map, image){
                check.map.x = map.x;
                check.map.y = map.y;
                check.map.z = map.z;
                g.API.save_check_image(self.junme, self.bridge_id, self.inspect_cd, self.part_cd, self.part_seq, check.seq, image).then(function(response){
                    const url = response.data;
                    if(url){
                        check.image = url;
                        checks.push(check);
                        self.save_and_rerender_check(check);
                    }
                });
            };
            g.Mapping.show_mapping_with_capture(check.map, this.inspect.image, callback);
        },
        on_remap_check: function(check){
            const self = this;
            const callback = function(map){
                check.map.x = map.x;
                check.map.y = map.y;
                check.map.z = map.z;
                self.save_and_rerender_check(check);
            };
            g.Mapping.show_mapping(check.map, this.inspect.image, callback);
        },
        on_judge:function(check, damage){
            const self = this;
            const title = "損傷情報を記入してください";
            const callback = function(param){
                damage.judge_kbn = param.kbn || 0;
                damage.memo = param.memo || "";
                self.save_and_rerender_damage(check, damage);
            };
            g.Judge.show_judge(title, damage.judge_kbn, damage.memo, callback);
        },

        on_append_damage: function(check){
            const self = this;
            const damages = check.damages;
            const damage = g.Biz.get_empty_damage_entry(damages);
            damage.ui = { open: true, render: true };
            const callback = function(map, image){
                damage.map.x = map.x;
                damage.map.y = map.y;
                damage.map.z = map.z;
                g.API.save_damage_image(self.junme, self.bridge_id, self.inspect_cd, self.part_cd, self.part_seq, check.seq, damage.seq, image).then(function(response){
                    const url = response.data;
                    if(url){
                        damage.image = url;
                        damages.push(damage);
                        self.save_and_rerender_damage(check, damage);
                    }
                });
            };
            g.Mapping.show_mapping_with_capture(damage.map, check.image, callback);
        },
        on_remap_damage: function(check, damage){
            const self = this;
            const callback = function(map){
                damage.map.x = map.x;
                damage.map.y = map.y;
                damage.map.z = map.z;
                self.save_and_rerender_damage(check, damage);
            };
            g.Mapping.show_mapping(damage.map, check.image, callback);
        },

    },
};

})(this);