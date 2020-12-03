"use: strinct;";

(function(g){

/**
 * Hooks
 */
const loader_func = g.get_loader_func();
const api_start = function(){
    console.log("start loader");
    state.loader_visible = loader_func.show_loader();
};
const api_end = function(){
    console.log("start loader");
    state.loader_visible = loader_func.hide_loader();
};
const api_error = function(error){
    console.log("abort loader");
    console.log(error);
    const message = (error?.response?.data?.message || error?.message || error);
    g.Modal.alert({message: message});
    state.loader_visible = loader_func.abort_loader();
};

/**
 * Routes
 */
const router = new VueRouter({
    routes: [
        { path: '/', redirect: { name: g.work_name }},
        { name: g.work_name, path: g.work_path, component: g.work_page },
        { name: g.list_name, path: g.list_path, component: g.list_page },
        { name: g.bridge_name, path: g.bridge_path, component: g.bridge_page },
        { name: g.inspect_name, path: g.inspect_path, component: g.inspect_page },
        { name: g.check_name, path: g.check_path, component: g.check_page },
    ],
});
/**
 * Main
 */
const state = {
    loader_visible: false,
    page_junme: null,
};
g.STATE = state;
const main_page = {
    router: router,
    el: '#app',
    data: state,
    computed: {},
    beforeMount: function(){},
    mounted: function(){},
    methods: {
        /**
         * From Page
         */
        /** Work page */
        on_page_junme: function($event){
            this.page_junme = $event.junme * 1;
        },
        on_junme_select: function($event){//state.work.globals[n]
            if($event){
                this.show_list_page($event.junme);
            }
        },
        on_bridge_select: function($event){//{ junme, bridge_id, bridge }
            if($event){
                this.show_bridge_page($event.junme, $event.bridge_id);
            }
        },
        on_inspect_select: function($event){//{ junme, bridge_id, inspect_cd, inspect }
            if($event){
                this.show_inspect_page($event.junme, $event.bridge_id, $event.inspect_cd);
            }
        },
        on_check_select: function($event){//{ junme, bridge_id, inspect_cd, part_cd, part_seq, inspect }
            if($event){
                this.show_check_page($event.junme, $event.bridge_id, $event.inspect_cd, $event.part_cd, $event.part_seq);
            }
        },
        /**
         * Paging
         */
        show_work_page: function(){
            this.show_a_page(g.work_name, {});
        },
        show_list_page: function(junme){
            this.show_a_page(g.list_name, { junme: junme });
        },
        show_bridge_page: function(junme, bridge_id){
            this.show_a_page(g.bridge_name, { junme: junme, bridge_id: bridge_id });
        },
        show_inspect_page: function(junme, bridge_id, inspect_cd){
            this.show_a_page(g.inspect_name, { junme: junme, bridge_id: bridge_id, inspect_cd: inspect_cd }, inspect_page);
        },
        show_check_page: function(junme, bridge_id, inspect_cd, part_cd, part_seq){
            this.show_a_page(g.check_name, { junme: junme, bridge_id: bridge_id, inspect_cd: inspect_cd, part_cd: part_cd, part_seq: part_seq }, check_page);
        },
        show_a_page: function(name, params){
            this.$router.push({ name: name, params: params })
            .catch(err => { console.log(err); });
        },
        on_back() {
            if(g.window.history.length > 1){
                this.$router.go(-1);
            }else{
                this.$router.push('/');
            }
        }
    },
};
g.window.addEventListener('load', function(){
    g.API.set_hooks(api_start, api_end, api_error);
    const app = new Vue(main_page);
});

})(this);