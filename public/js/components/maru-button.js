"use: strinct;";

(function(g){

    const component = {
        template: `
            <button @click="on_click" class="button is-small is-outlined" style="border-radius: 1.5em">
                <span class="icon">
                    <i class="fa" :class="icon"></i>
                </span>
            </button>
        `,
        props: ["icon"],
        data: function(){
            return {};
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            on_click: function($event){
                this.$emit("click", $event);
            }
        },
    };

    g.Vue.component('maru-button', component);

})(this);