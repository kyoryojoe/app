"use: strinct;";

(function(g){

    const state = {
        visible: false,
        show_cancel: false,
        show_prompt: false,
        text: "",
        multiline: false,
        messages: [],
        on_ok: null,
        on_cancel: null,
    };
    const component = {
        template: `
            <popup :visible="visible">
                <p style="word-break: break-all;">
                    <template v-for="message in messages">
                        {{ message }}<br/>
                    </template>
                </p>
                <p v-if="show_prompt">
                    <input class="input is-fullwidth" type="text" v-if="!multiline" v-model="text"/>
                    <textarea class="textarea" rows="5" v-if="multiline" v-model="text"></textarea>
                </p>
                <p style="text-align: right;">
                    <button class="button" v-if="show_cancel" @click="click_cancel">Cancel</button>
                    <button class="button is-primary" @click="click_ok">OK</button>
                </p>
            </popup>
        `,
        data: function(){
            return state;
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            click_cancel: function(){
                this.on_cancel && this.on_cancel();
                state.visible = false;
            },
            click_ok: function(){
                if(this.on_ok){
                    if(this.show_prompt && this.text){
                        this.on_ok(this.text);
                    }
                    else{ this.on_ok(); }
                }
                state.visible = false;
            },
        },
    };

    g.Vue.component('modal', component);

    const func = function(){};
    func.prototype.alert = function(params){
        this.show_modal(Object.assign(params, {
            //on_ok: null,
            on_cancel: null,
            show_cancel: false,
            show_prompt: false,
        }));
    };
    func.prototype.confirm = function(params){
        this.show_modal(Object.assign(params, {
            //on_ok: null,
            //on_cancel: null,
            show_cancel: true,
            show_prompt: false,
        }));
    };
    func.prototype.prompt = function(params){
        this.show_modal(Object.assign(params, {
            //on_ok: null,
            //on_cancel: null,
            //multiline: bool,
            //original: TEXT
            show_cancel: true,
            show_prompt: true,
        }));
    };
    func.prototype.show_modal = function(params){
        if(state.visible){ throw new Error("Modal is shown."); }
        if(!params.message){ throw new Error("Message is required."); }
        state.show_cancel = params.show_cancel;
        state.on_ok = params.on_ok || null;
        state.on_cancel = params.on_cancel || null;
        state.show_prompt = params.show_prompt;
        state.multiline = !!params.multiline || false;
        state.text = params.original || "";
        state.messages.splice(0);
        state.messages.push(...params.message.split("\n"));
        state.visible = true;
    };

    g.Modal = new func();

})(this);