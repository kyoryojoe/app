"use: strinct;";

(function(g){

/** inspect */
const inspect_name = g.inspect_name = "inspect_page";
const inspect_path = g.inspect_path = "/inspect/:junme/:bridge_id/:inspect_cd"
const inspect_page = g.inspect_page = {
    template: '#INSPECT_PAGE_TEMPLATE',
    data: function(){
        return {
            junme: null,
            bridge_id: null,
            inspect_cd: null,
            header: {/* inspect_cd, bridge_id, inspect_cd, judge_kbn, created, finished */},
            bridge: {},
            outline: {/* image, memo */},
            inspects: [/* {
                group: "", part: "", name: "",
                image: nil, seq: nil, memo: "",
                checks: [{//Biz.get_empty_check_entry
                    image: nil, seq: 0, memo: "",
                    map: { x: 0, y: 0, z: 0 } # xy: -1.0~1.0, z: 0<0.5
                    damages: [{//Biz.get_empty_damage_entry
                        image: nil, seq: 0, memo: "", 
                        judge_kbn: 0, # 0, 1 ~ 4
                        map: { x: 0, y: 0, z: 0 } # xy: -1.0~1.0, z: 0<0.5
                    }]
                }],
            } */],
            groups: [
                //{ group: 'GROUP_UPPER',   name: '上部構造', judge_kbn: 0, parts: [], ui: { open: false, render: true } },
            ],
            ui: {
                render_outline: true,//outlineが描画されないので強制再描画
                members: {
                    visible: false,
                    member: null, groups: [], name: "",
                },
            },
        };
    },
    computed: {
        latest_url: function(){
            const latest = this.header.latest;
            if(!latest){ return null; }
            return this.$router.resolve({
                name: g.inspect_name,
                params: {
                    junme: latest.junme,
                    bridge_id: latest.bridge_id,
                    inspect_cd: latest.inspect_cd
                }
            }).href;
        },
    },
    beforeMount: function(){
        const self = this;
        const junme = this.junme = this.$route.params.junme * 1;
        const bridge_id = this.bridge_id = this.$route.params.bridge_id * 1;
        const inspect_cd = this.inspect_cd = this.$route.params.inspect_cd || null;
        g.API.get_inspect(junme, bridge_id, inspect_cd).then(function(response){
            const data = response.data;
            const open = self.header.finished;
            if(data){
                Object.assign(self.header, data.header || {});
                Object.assign(self.bridge, data.bridge || {});
                Object.assign(self.outline, data.outline || {});
                self.inspects.push(...Object(data.inspects || []));
                self.inspects.forEach(function(inspect){
                    inspect.ui = { open: open, render: true };
                });
                self.reset_groups();
                g.API.get_templates(junme, bridge_id, inspect_cd).then(function(response){
                    const data = response.data;
                    g.Biz.set_members_template(data.members);
                    g.Biz.set_check_template(data.check);
                    g.Biz.set_damage_template(data.damage);
                    self.ui.members.groups = g.Biz.get_groups_with_members();
                });
            }
        });
    },
    mounted: function(){
        this.$emit("page_junme", {junme: this.junme});
    },
    methods: {
        reset_groups: function(){
            this.groups.splice(0);
            this.groups.push(...g.Biz.inspects_to_groups(this.inspects));
            this.groups.forEach(function(group){
                group.ui = { open: open, render: true };
            });
        },
        rerender_outline: function(){
            const self = this;
            this.ui.render_outline = false;
            this.$nextTick(function(){
                self.ui.render_outline = true;
            });
        },
        rerender_group: function(group){
            const self = this;
            this.ui.render_outline = false;
            group.ui.render = false;
            this.$nextTick(function(){
                self.ui.render_outline = true;
                group.ui.render = true;
            });
        },
        rerender_part: function(group, part){
            const self = this;
            this.ui.render_outline = false;
            group.ui.render = false;
            part.ui.render = false;
            this.$nextTick(function(){
                self.ui.render_outline = true;
                group.ui.render = true;
                part.ui.render = true;
            });
        },
        toggle_group_open: function(group){
            group.ui.open = !group.ui.open;
            this.rerender_group(group);
        },
        toggle_part_open: function(group, part){
            part.ui.open = !part.ui.open;
            this.rerender_part(group, part);
        },
        get_judge_kbn: function(){ return g.Biz.get_judge_kbn_by_groups(this.groups); },
        get_group_judge_kbn: function(group){ return g.Biz.get_group_judge_kbn(group); },
        get_part_judge_kbn: function(part){ return g.Biz.get_part_judge_kbn(part); },
        get_check_judge_kbn: function(check){ return g.Biz.get_check_judge_kbn(check); },
        on_outline_captured: function($event){
            const self = this;
            const base64 = $event.image;//base64
            g.API.save_outline_image(this.junme, this.bridge_id, this.inspect_cd, base64).then(function(response){
                const url = response.data;
                if(url){
                    self.outline.image = url;
                    self.save_and_rerender_outline(null);
                }
            });
        },
        on_part_captured: function($event, group, part){
            const self = this;
            const part_cd = part.part;
            const part_seq = part.seq;
            const base64 = $event.image;//base64
            g.API.save_part_image(this.junme, this.bridge_id, this.inspect_cd, part_cd, part_seq, base64).then(function(response){
                const url = response.data;
                if(url){
                    part.image = url;
                    self.save_and_rerender_part(group, part, null);
                }
            });
        },
        on_click_addmember: function(){
            const members = this.ui.members;
            members.member = null;
            members.name = null;
            members.visible = true;
        },
        click_members_cancel: function(){
            this.ui.members.visible = false;
        },
        click_members_ok: function(){
            const members = this.ui.members;
            members.visible = false;
            if(!members.member){ return; }//未選択

            const member = Object.assign({}, members.member);
            if(!members.member.name){
                if(!members.name){ return; }//名前未入力
                member.name = members.name;
            }
            console.log(member);
            const inspect = Biz.get_empty_inspect_entry(member, this.inspects);
            inspect.ui = { open: open, render: true };//TODO:
            this.inspects.push(inspect);
            this.reset_groups();
            this.save_inspect(null);
        },

        on_goto_check_click: function(part){
            const param = {
                junme: this.junme,
                bridge_id: this.bridge_id,
                inspect_cd: this.inspect_cd,
                part_cd: part.part,
                part_seq: part.seq,
                inspect: part,
            };
            this.$emit("check_select", param);
        },
        save_and_rerender_outline: function(callback){
            this.rerender_outline();
            this.save_inspect(callback);
        },
        save_and_rerender_part: function(group, part, callback){
            this.rerender_part(group, part);
            this.save_inspect(callback);
        },
        save_inspect: function(callback){
            const params = {
                junme: this.junme,
                bridge_id: this.bridge_id,
                inspect_cd: this.inspect_cd,
                header: this.header,
                bridge: this.bridge,
                outline: this.outline,
                inspects: this.inspects,
            };
            g.Biz.save_inspect(params, callback);
        },
        finish_inspect: function(){
            const outline = this.outline;
            const inspects = this.inspects;
            const warnings = g.Biz.get_inspect_warnings(outline, inspects);
            if(!warnings || warnings.length <= 0){
                this.save_and_exit_inspect();
            }else{
                this.confirm_inspect_warnings(warnings, this.save_and_exit_inspect);
            }
        },
        confirm_inspect_warnings: function(warnings, callack){
            const messages = [
                "点検完了前に、以下を確認してください。",
                "",
            ];
            messages.push(...warnings.map(function(warning){
                return `${warning.name}：${warning.message}`;
            }));
            g.Modal.confirm({
                message: messages.join("\n"),
                on_ok: callack,
            });
        },
        save_and_exit_inspect: function(){
            const self = this;
            const kbn = this.get_judge_kbn() || this.header.judge_kbn || 0;
            const memo = this.header.memo || "";
            const title = "点検を完了する";
            const callback = function(param){//{ kbn, memo }
                self.header.judge_kbn = param.kbn;
                self.header.memo = param.memo;
                self.header.finished = new Date();
                const _callback = function(){
                    self.$emit("back_select");
                };
                self.save_inspect(_callback);
            };
            g.Judge.show_judge(title, kbn, memo, callback);
        },
    },
};

})(this);