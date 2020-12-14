"use: strinct;";

(function(g){

    const component = {
        template: `
            <div>
                <div v-for="child in children" :style="get_childstyle(child)">
                    <span>#{{ child.seq }}</span>
                </div>
            </div>
        `,
        props: ["children", "kbn_func"],
        data: function(){
            return {};
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            get_childstyle: function(child){
                if(!("map" in child)){ throw new Error(`child doesnt have map: ${child}`); }
                if(!("seq" in child)){ throw new Error(`child doesnt have seq: ${child}`); }
                const map = child.map;
                const judge_kbn = this.kbn_func(child) || 0;
                const color = [
                    {r:   0, g:   0, b: 0},
                    {r:   0, g: 255, b: 0},
                    {r: 255, g: 255, b: 0},
                    {r: 255, g: 127, b: 0},
                    {r: 255, g:   0, b: 0},
                ][judge_kbn];

                return {
                    "margin": "0", "padding": "0.5rem",
                    "width": "15%", "height": "15%",
                    "transform": "translate(-50%, -50%)",
                    "left": `calc(50% + ${map.x * 100}%)`,
                    "top": `calc(50% + ${map.y * 100}%)`,
                    "position": "absolute",
                    "border": "solid 2px",
                    "border-color": `rgba(${color.r}, ${color.g}, 0, 0.5)`,
                    "background-color": `rgba(${color.r}, ${color.g}, 0, 0.25)`,
                    "color": `rgba(${color.r}, ${color.g}, 0, 1)`,
                    "font-size": "24px",
                    // "display": "table-cell",
                    // "vertical-align": "middle",
                    // "text-align": "center",
                };
            },
        },
    };

    g.Vue.component('children-map', component);

})(this);