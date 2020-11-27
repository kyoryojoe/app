"use: strinct;";

(function(g){

/** work */
const work_name = g.work_name = "work_page"
const work_path = g.work_path = "/work"
const work_page = g.work_page = {
    template: '#WORK_PAGE_TEMPLATE',
    data: function(){
        return {
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
    },
};
})(this);