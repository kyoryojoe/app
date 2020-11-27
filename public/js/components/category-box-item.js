"use: strinct;";

(function(g){

    const component_box = {
        template: '#CATEGORY_BOX_TEMPLATE',
        props: ["name"],
        data: function(){
            return {};
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {},
    };
    Vue.component('category-box', component_box);

    const component_item = {
        template: '#CATEGORY_ITEM_TEMPLATE',
        props: ["title"],
        data: function(){
            return {};
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {},
    };
    Vue.component('category-box-item', component_item);
    

})(this);