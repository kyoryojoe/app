"use: strinct;";

(function(g){

    const component = {
        template: `
            <a class="button" @click="edit_memo">
                <span class="icon is-medium">
                    <i class="fa fa-pencil-square-o"></i>
                </span>
            </a>
        `,
        props: ["obj", "attr"],
        data: function(){
            return {};
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            edit_memo: function($event){
                const self = this;
                const callback = function(text){
                    if(text){
                        self.obj[self.attr] = text;
                        self.$emit("change", { memo: text });
                    }
                };
                g.Modal.prompt({
                    message: "メモ編集",
                    original: self.obj[self.attr],
                    multiline: true,
                    on_ok: callback,
                });
            }
        },
    };

    g.Vue.component('memo', component);

})(this);