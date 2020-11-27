"use: strinct;";

(function(g){

    const component = {
        template: `
            <span v-if="href">
                <a :href="href" target="_blank" class="icon is-medium">
                    <i class="fa fa-external-link"></i>
                </a>
            </span>
        `,
        props: ["href"],
        data: function(){
            return {};
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {},
    };

    g.Vue.component('new-tab-link', component);

})(this);