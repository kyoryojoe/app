"use: strinct;";

(function(g){

/** list */
const list_name = g.list_name = "list_page";
const list_path = g.list_path = "/list/:junme";
const list_page = g.list_page = {
    template: '#LIST_PAGE_TEMPLATE',
    data: function(){
        return {
            junme: null,
            original_bridges: [],
            bridges: [/*{
                BRIDGE_RECORD...,
                inspects: [{
                    junme: Number,
                    bridge_id: Number,
                    date: Date ,
                    image: String of URL or Empty
                    judge_kbn: Number,                    
                }]                
            }*/],
        };
    },
    computed: {
        columns: function(){
            const MAX_LENGTH_INLIST = 100;//TODO: 表示する最大件数（フィルタで頑張る
            const MAX_LENGTH_INROW = 4;//TODO: PCで横何橋表示するか
            const rows = [];
            for(let row=0; row<Math.ceil(this.bridges.length / MAX_LENGTH_INROW); row++){
                const col = row * MAX_LENGTH_INROW;
                var bridge_rows = this.bridges.slice(col, col + MAX_LENGTH_INROW); // i*cnt番目からi*cnt+cnt番目まで取得
                rows.push(bridge_rows);
            }
            return rows;
            // return [[bridge, bridge, bridge, bridge], [bridge, bridge]];
        },
    },
    beforeMount: function(){
        const self = this;
        const junme = this.junme = this.$route.params.junme;
        const pre_junme = junme - 1;
        g.API.get_bridges(junme).then(function(response){
            const bridges = response.data.map(function(bridge){
                const ui = { status: {
                    now: g.Biz.get_inspect_status(junme, bridge),
                    pre: g.Biz.get_inspect_status(pre_junme, bridge),
                }};
                bridge.ui = ui;
                return bridge;
            });
            self.original_bridges.push(...bridges);
            console.log(bridges);
            //TODO: filter and sort
            self.bridges.push(...self.original_bridges);
        });
    },
    mounted: function(){
        this.$emit("page_junme", {junme: this.junme});
    },
    methods: {
        on_bridge_selected: function(bridge){
            const junme = this.$route.params.junme;
            const bridge_id = bridge.id;
            const param = {
                junme: junme,
                bridge_id: bridge_id,
                bridge: bridge,
            };
            this.$emit("bridge_select", param);
        },
    },
};

})(this);