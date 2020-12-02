"use: strinct;";

(function(g){

/** work */
const work_name = g.work_name = "work_page"
const work_path = g.work_path = "/work"
const work_page = g.work_page = {
    template: '#WORK_PAGE_TEMPLATE',
    data: function(){
        return {
            clone: { visible: false },
            repositories: [],
        };
    },
    computed: {
        inspects: function(){
            //TODO: get from biz
            // const work = g.Biz.get_state_work();
            // const locals = work.locals.concat().sort().reverse();
            // const globals = work.globals.concat();
            // return locals.map(function(junme){
            //     return globals.find(function(global){
            //         return global.junme == junme;
            //     });
            // });
            return [];
        },
        sorted_repositories: function(){
            return this.repositories.slice().sort(function(a, b){
                return (b.junme * 1) - (a.junme * 1);
            });
        },
    },
    beforeMount: function(){
        const self = this;
        g.API.get_repositories().then(function(response){
            console.log(response);
            self.repositories.push(...response.data);
        });
    },
    mounted: function(){
        this.$emit("page_junme", {junme: 0});
    },
    methods: {
        get_bridges_url: function(junme){
            return this.$router.resolve({
                name: g.list_name,
                params: { junme: junme },
            }).href;
        },
        on_junme_select: function(junme){
            this.$emit('junme_select', { junme: junme });
        },
        on_git_clone_click: function(){
            if(!this.clone.visible){
                this.clone.visible = true;
            }
        },
        on_git_clone_close: function($event){
            const self = this;
            this.clone.visible = false;
            if(!$event){ return; }

            const junme = $event.junme * 1;
            const url = $event.url;
            const mailaddress = $event.mailaddress;
            const password = $event.password;
            if(!junme || !url || !mailaddress || !password){ return; }
            if(this.repositories.length > 0){
                const junmes = this.repositories.map(function(repository){
                    return repository.junme * 1;
                });
                const high_junme = Math.max(...junmes) + 1;
                const low_junme = Math.min(...junmes) - 1;
                if(high_junme != junme && low_junme != junme){
                    g.Modal.alert({
                        message: `指定できる巡目は配置済み巡目の前(${low_junme})か後ろ(${high_junme})のみです。`
                    });
                    return;
                }
            }
            g.API.git_clone(junme, url, mailaddress, password).then(function(response){
                g.location.reload();
            });
        },
        on_sync_repository_click: function(){
            const message = [
                "点検データを同期します",
                "※時間がかかります。Wifi下で実行して下さい",
                "※同期に必要な認証情報は登録済みの前提です",
                "※競合は解消できません", "",
                "１．最新データをダウンロードします（マージ）",
                "２．点検データをアップロードします",
            ].join("\n");
            const callback = function(){
                g.API.sync_repositories().then(function(response){
                    g.location.reload();
                });
            };
            g.Modal.confirm({
                message: message,
                on_ok: callback,
            });
        },
    },
};
})(this);