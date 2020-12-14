"use: strinct;";

(function(g){

    const component = {
        template: `
            <span :style="judge_kbn_2_style">
                {{ value | n2_judge_kbn }}
            </span>
        `,
        props: ["value"],
        data: function(){
            return {};
        },
        computed: {
            judge_kbn_2_style: function(){
                const kbn = this.value * 1;
                color = [null, "blue", "green", "orange", "red"][kbn];
                return {
                    color: color || "inherit"
                };
            },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {},
    };

    g.Vue.component('judge_kbn', component);

})(this);