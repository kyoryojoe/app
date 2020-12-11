"use: strinct;";

(function(g){

    const component = {
        template: `
            <div ui="search_condition">
                <div class="field">
                    <div class="control is-expanded has-icons-left">
                        <input v-model="keyword" class="input is-rounded" type="text" placeholder="フィルタ条件" />
                        <span class="icon is-small is-left">
                            <i class="fa fa-search"></i>
                        </span>
                    </div>
                </div>
                
                <div class="field is-grouped" style="margin-left: 2rem; margin-right: 2rem; margin-bottom: 1rem;">
                    <div class="control is-expanded">
                        <label class="radio" v-for="order in orders">
                            <input type="radio" name="orderby" :value="order.name" v-model="orderby" />
                            <span>{{ order.label }}</span>
                        </label>
                    </div>
                    <div class="control">
                        <button class="button" @click="toggle_direction">
                            <span class="icon is-small is-left">
                                <i v-if="orderasc" class="fa fa-sort-amount-asc"></i>
                                <i v-if="!orderasc" class="fa fa-sort-amount-desc"></i>
                            </span>
                        </button>
                    </div>
                </div>    
            </div>
        `,
        props: ["orders"],
        data: function(){
            return {
                keyword: null,
                orderby: this.orders[0].name,
                orderasc: true,//asc: true, desc: false
            };
        },
        watch: {
            keyword: function(crr, old){ this.trigger() },
            orderby: function(crr, old){ this.trigger() },
            orderasc: function(crr, old){ this.trigger() },
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            toggle_direction: function(){
                this.orderasc = !this.orderasc;
            },
            trigger: function(){
                const params = {
                    keyword: this.keyword,
                    orderby: this.orderby,
                    orderasc: this.orderasc,
                };
                this.$emit("search", params);
            },
        },
    };

    g.Vue.component('search_condition', component);

})(this);