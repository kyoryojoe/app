"use: strinct;";

(function(g){

    const component = {
        template: `
            <div class="modal" :class="{ 'is-active': show_loader }">
                <div class="modal-background"></div>
                <div class="modal-content" style="overflow: visible !important;">
                    <p style="text-align: center; color: white;">
                        <i class="fa fa-refresh fa-spin fa-4x" aria-hidden="true"></i>
                    </p>
                </div>
            </div>
        `,
        props: ["visible"],
        data: function(){
            return {};
        },
        computed: {
            show_loader: function(){ return !!this.visible; },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {},
    };

    g.Vue.component('loader', component);
    
    g.get_loader_func = function(){
        let counter = 0;
        const func = function(){};
        func.prototype.show_loader = function(){
            counter += 1;
            return true;
        };
        func.prototype.hide_loader = function(){
            counter -= !!counter ? 1 : 0;
            return !!counter;
        };
        func.prototype.abort_loader = function(){
            counter = 0;
            return false;
        };
        return new func();
    };

})(this);