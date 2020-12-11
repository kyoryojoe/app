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
            orders: [
                {name: "id", label: "id"},
                {name: "bridge_name", label: "橋梁名"},
                {name: "address", label: "所在地"},
                {name: "route_name", label: "路線名"},
                {name: "bridge_length", label: "橋長"},                
            ],
            search_condition: {
                keyword: null,
                orderby: null,
                orderasc: true,//asc: true, desc: false
            }
        };
    },
    computed: {},
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
        on_search: function($event){
            const cond = this.search_condition;
            const keyword  = $event.keyword  || "";
            const orderby  = $event.orderby  || "id";
            const orderasc = !!$event.orderasc;

            if(cond.keyword != keyword || cond.orderby != orderby || cond.orderasc != orderasc){
                let bridges = undefined;
                this.bridges.splice(0);
                if(keyword){
                    bridges = this.original_bridges.filter(function(bridge){
                        if(bridge.bridge_name && bridge.bridge_name.indexOf(keyword) >= 0){ return true; }
                        if(bridge.bridge_name_kana && bridge.bridge_name_kana.indexOf(keyword) >= 0){ return true; }
                        if(bridge.address && bridge.address.indexOf(keyword) >= 0){ return true; }
                        if(bridge.address_kana && bridge.address_kana.indexOf(keyword) >= 0){ return true; }
                        if(bridge.route_name && bridge.route_name.indexOf(keyword) >= 0){ return true; }
                        return false;
                    });
                }else{
                    bridges = this.original_bridges.concat();
                }
                //TODO: 点検日に対応できない
                bridges.sort(function(a, b){
                    const o = orderasc ? 1 : -1;
                    if(a[orderby] < b[orderby]){ return -1 * o; }
                    if(a[orderby] > b[orderby]){ return  1 * o; }
                    return (a.id - b.id) * o;
                });
                //TODO: 最大件数
                this.bridges.push(...bridges);
            }
        }
    },
};

})(this);