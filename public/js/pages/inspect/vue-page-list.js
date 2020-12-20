"use: strinct;";

(function(g){

const BRIDGES_MAX_LENGTH = 100;

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
                {name: "id", label: "id", special: false },
                {name: "bridge_name", label: "橋梁名", special: false },
                {name: "address", label: "所在地", special: false },
                {name: "route_name", label: "路線名", special: false },
                {name: "bridge_length", label: "橋長", special: false },
                {name: "date", label: "点検日", special: true },
                {name: "judge_kbn", label: "判定区分", special: true },
            ],
            search_condition: {
                keyword: null,
                orderby: "id",
                special: false,//false: bridge[orderby], true: bridge.inspects[0][orderby]
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
            self.on_search(self.search_condition);
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
            const special  = !!$event.special;
            const orderasc = !!$event.orderasc;

            if(cond.keyword != keyword || cond.orderby != orderby || cond.orderasc != orderasc){
                cond.keyword = keyword;
                cond.orderby = orderby;
                cond.special = special;
                cond.orderasc = orderasc;

                let bridges = undefined;
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
                
                const getter = special
                ? function(_bridge, _by){//点検データでソート
                    const value = (_bridge?.inspects[0] || {})[_by];
                    return !value && value !== 0 ? -1 : value;
                }
                : function(_bridge, _by){ return _bridge[_by]; }
                bridges.sort(function(a, b){
                    const order = orderasc ? 1 : -1;
                    const av = getter(a, orderby);
                    const bv = getter(b, orderby);
                    if(av < bv){ return -1 * order; }
                    if(av > bv){ return  1 * order; }
                    return 0;
                });
                this.bridges.splice(0);
                this.bridges.push(...(bridges.slice(0, BRIDGES_MAX_LENGTH)));
            }
        }
    },
};

})(this);