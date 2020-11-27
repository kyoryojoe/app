"use: strinct;";

(function(g){

    const component = {
        template: `
            <label>
                <a class="button">
                    <span class="icon is-medium">
                        <i class="fa fa-camera"></i>
                    </span>
                </a>
                <input type="file" accept="image/*" @change="captured" style="display: none;" capture />
            </label>
        `,
        props: [],
        data: function(){
            return {};
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            captured: function($event){
                const self = this;
                const $input = $event.target;
                const file = $input.files[0] || null;
                if(file){
                    const reader = new FileReader();
                    reader.onload = function(){
                        const base64 = reader.result;
                        if(base64){
                            self.$emit("captured", { image: base64} );
                        }
                    };
                    reader.readAsDataURL(file);                    
                }
            }
        },
    };

    g.Vue.component('camera', component);

})(this);