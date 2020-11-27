"use: strinct;";

(function(g){

    const component = {
        template: `
            <div class="modal" :class="{ 'is-active': visible }">
                <div class="modal-background"></div>
                <div class="modal-content">
                    <div class="box">
                        <div class="content">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>
        `,
        props: ["visible"],
        data: function(){
            return {};
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {},
    };

    g.Vue.component('popup', component);
    

})(this);