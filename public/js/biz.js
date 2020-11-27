"use: strinct;";

(function(g){

    const state = {
        template: {
            members: [],
            check: {},
            damage: {},
        },
    };
    const groups = [
        { group: 'GROUP_UPPER',   name: '上部構造' },
        { group: 'GROUP_ROAD',    name: '路上'     },
        { group: 'GROUP_SUPPORT', name: '支承部'   },
        { group: 'GROUP_UNDER',   name: '下部構造' },
        { group: 'GROUP_OTHER',   name: 'その他'   },
    ];

    const biz = function(){};

    biz.prototype.get_groups = function(){
        return groups.concat();
    };
    biz.prototype.get_groups_with_members = function(){
        const _groups = this.get_groups().map(function(group){
            const members = state.template.members.filter(function(member){
                return member.group == group.group;
            });
            return Object.assign({ members: members}, group);
        });
        return _groups;
    };


    biz.prototype.set_members_template = function(members){
        state.template.members = members;
    };
    biz.prototype.set_check_template = function(check){
        state.template.check = check;
    };
    biz.prototype.set_damage_template = function(damage){
        state.template.damage = damage;
    };

    biz.prototype.save_inspect = function(params, callback){
        /* params = {
            junme, bridge_id, inspect_cd
            header, bridge, outline, inspects
        } */
        const header = JSON.parse(JSON.stringify(params.header));
        const outline = JSON.parse(JSON.stringify(params.outline));
        const inspects = JSON.parse(JSON.stringify(params.inspects));

        delete outline.ui;
        inspects.forEach(function(inspect){
            delete inspect.ui;
            inspect.checks.forEach(function(check){
                delete check.ui;
                check.damages.forEach(function(damage){
                    delete damage.ui;
                });
            });
        });
        const data = {
            header: header,
            bridge: params.bridge,
            outline: outline,
            inspects: inspects,
        };
        g.API.save_inspect(params.junme, params.bridge_id, params.inspect_cd, data).then(function(){
            callback && callback();
        });
    };
    biz.prototype.inspects_to_groups = function(inspects){
        const ui_groups = groups.map(function(group){
            const base = { judge_kbn: 0, parts: [], ui: { open: false, render: true } };
            return Object.assign(base, group);
        });
        inspects.forEach(function(inspect){
            const group = ui_groups.find(function(group){
                return group.group == inspect.group;
            });
            if(group){ group.parts.push(inspect); }
        });
        return ui_groups;
    };
    biz.prototype.get_judge_kbn_by_inspects = function(inspects){
        const self = this;
        const kbn_list = inspects
        .map(function(inspect){ return self.get_part_judge_kbn(inspect); })
        .filter(function(kbn){ return !!kbn; });
        return kbn = kbn_list.length ? Math.max(...kbn_list) : 0;
    };
    biz.prototype.get_judge_kbn_by_groups = function(groups){
        const self = this;
        const kbn_list = groups
        .map(function(group){ return self.get_group_judge_kbn(group); })
        .filter(function(kbn){ return !!kbn; });
        return kbn = kbn_list.length ? Math.max(...kbn_list) : 0;
    };
    biz.prototype.get_group_judge_kbn = function(group){
        const self = this;
        const kbn_list = group.parts
        .map(function(part){ return self.get_part_judge_kbn(part); })
        .filter(function(kbn){ return !!kbn; });
        return kbn = kbn_list.length ? Math.max(...kbn_list) : 0;
    };
    biz.prototype.get_part_judge_kbn = function(part){
        const self = this;
        const kbn_list = part.checks
        .map(function(check){ return self.get_check_judge_kbn(check); })
        .filter(function(kbn){ return !!kbn; });
        return kbn = kbn_list.length ? Math.max(...kbn_list) : 0;
    };
    biz.prototype.get_check_judge_kbn = function(check){
        const kbn_list = check.damages
        .map(function(damage){ return damage.judge_kbn || 0; })
        .filter(function(kbn){ return !!kbn; });
        return kbn = kbn_list.length ? Math.max(...kbn_list) : 0;
    };
    biz.prototype.get_inspect_members = function(){
        return state.template.members;
    };
    biz.prototype.get_empty_inspect_entry = function(member, inspects){
        const inspect = Object.assign({ seq: null, checks: [] }, member);
        const seq = Math.max(-1, ...inspects.map(function(i){ return i.seq })) + 1;
        inspect.seq = seq;
        return inspect;
    };
    biz.prototype.get_empty_check_entry = function(checks){
        const check = JSON.parse(JSON.stringify(state.template.check));
        const seq = Math.max(-1, ...checks.map(function(c){ return c.seq })) + 1;
        check.seq = seq;
        return check;
    };
    biz.prototype.get_empty_damage_entry = function(damages){
        const damage = JSON.parse(JSON.stringify(state.template.damage));
        const seq = Math.max(-1, ...damages.map(function(d){ return d.seq })) + 1;
        damage.seq = seq;
        return damage;
    };
    biz.prototype.get_inspect_status = function(junme, bridge){
        const junme_inspects = bridge.inspects.filter(function(inspect){
            return inspect.junme == junme;
        }).sort(function(a, b){
            const date_a = new Date(a.date || new Date());
            const date_b = new Date(b.date || new Date());
            return +date_b - +date_a;
        });
        const junme_inspect = junme_inspects[0];
        const has_inspect = !!junme_inspect;
        const inspect_date = has_inspect ? junme_inspect.date : null;
        const status = has_inspect ? (inspect_date ? "完了" : "点検中") : "なし";
        const judge_kbn = has_inspect ? (junme_inspect.judge_kbn || 0) : null;

        return {
            has_inspect: has_inspect,
            inspect_date: (has_inspect && inspect_date) ? new Date(inspect_date) : null,
            judge_kbn: judge_kbn,
            status: status,
        };
    };

    biz.prototype.get_inspect_warnings = function(outline, inspects){
        const warnings = [];
        const image_check = function(list, node, name){
            if(!node.image){
                list.push({name: name, message: "写真が撮影されていません"});
            }
        };
        //outline
        image_check(warnings, outline, "橋梁 全景");
        //inspects
        inspects.forEach(function(inspect){
            const inspect_name = `${inspect.name}#${inspect.seq}`;
            image_check(warnings, inspect, inspect_name);
            if(inspect.checks.length <= 0){
                warnings.push({name: inspect_name, message: "点検情報が1件もありません"});
            }else{
                inspect.checks.forEach(function(check){
                    const check_name = `${inspect_name}-点検#${check.seq}`;
                    image_check(warnings, check, check_name);
                    if(check.damages.length <= 0){
                        warnings.push({name: inspect_name, message: "損傷情報が1件もありません"});
                    }else{
                        check.damages.forEach(function(damage){
                            const damage_name = `${check_name}-損傷#${damage.seq}`;
                            image_check(warnings, damage, damage_name);
                            if(!damage.judge_kbn){
                                warnings.push({name: damage_name, message: "判定区分が入力されていません"});
                            }
                        });
                    }
                });
            }
        })
        return warnings;
    };

    g.Biz = new biz();

})(this);