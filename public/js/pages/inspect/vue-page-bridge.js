"use: strinct;";

(function(g){

/** bridge */
const bridge_name = g.bridge_name = "bridge_page";
const bridge_path = g.bridge_path = "/bridge/:junme/:bridge_id"
const bridge_page = g.bridge_page = {
    template: '#BRIDGE_PAGE_TEMPLATE',
    data: function(){
        return {
            junme: null,
            bridge_id: null,
            bridge: {},
            inspects: [],
        };
    },
    computed: {},
    beforeMount: function(){
        const self = this;
        const junme = this.junme = this.$route.params.junme;
        const bridge_id = this.bridge_id = this.$route.params.bridge_id;
        g.API.get_bridge(junme, bridge_id).then(function(response){
            self.bridge = response.data;
            if(self.bridge){
                const inspects = Util.sort(
                    self.bridge.inspects || [],
                    ["junme", "inspect_date", "judge_kbn"]
                );
                self.inspects.push(...inspects);
                const inspecting = inspects.find(function(inspect){
                    return inspect.junme == junme;
                });
                if(!inspecting){
                    //今巡目の点検中がなければ新規（空）を追加
                    self.inspects.push({
                        junme: junme,
                        bridge_id: bridge_id,
                        inspect_cd: null,
                        date: null,
                        image: null,
                        judge_kbn: 0,
                    });    
                }
            }
        });
    },
    mounted: function(){
        this.$emit("page_junme", {junme: this.junme});
    },
    methods: {
        on_inspect_selected: function(inspect){
            const param = {
                junme: inspect.junme * 1,
                bridge_id: inspect.bridge_id * 1,
                inspect_cd: inspect.inspect_cd || null,
                inspect: inspect,
            };
            if(!!param.inspect_cd){
                this.$emit("inspect_select", param);
            }else{
                const self = this;
                const message = [
                    "点検データがありません。",
                    "新規点検を開始しますか？",
                ].join("\n");
                g.Modal.confirm({
                    message: message,
                    on_ok: function(){
                        g.API.start_new_inspect(param.junme, param.bridge_id).then(function(response){
                            const inspect_cd = response.data.inspect_cd;
                            param.inspect_cd = inspect_cd;
                            self.$emit("inspect_select", param);
                        });
                    },
                });
            }
        },
        get_googlemaps_link: function(latitude, longitude){
            return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        },
    },
};

})(this);