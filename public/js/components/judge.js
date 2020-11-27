"use: strinct;";

(function(g){

    const state = {
        visible: false,
        title: null,
        kbn: 0,
        text: "",
        callback: null,
    };
    const component = {
        template: `
            <popup :visible="visible">
                <p class="subtitle" v-if="!!title">{{ title }}</p>
                <p>
                    <textarea class="textarea" rows="5" v-model="text"></textarea>
                </p>
                <p>
                    <div class="buttons has-addons is-centered">
                        <button :class="{'is-primary': !kbn}" class="button" @click="set_kbn(0)">{{ '　' }}</button>
                        <button :class="{'is-primary': kbn==1}" class="button" @click="set_kbn(1)">Ⅰ</button>
                        <button :class="{'is-primary': kbn==2}" class="button" @click="set_kbn(2)">Ⅱ</button>
                        <button :class="{'is-primary': kbn==3}" class="button" @click="set_kbn(3)">Ⅲ</button>
                        <button :class="{'is-primary': kbn==4}" class="button" @click="set_kbn(4)">Ⅳ</button>
                    </div>            
                </p>
                <p style="text-align: right;">
                    <button class="button" @click="click_cancel">Cancel</button>
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
            set_kbn: function(kbn){
                state.kbn = kbn || 0;
            },
            click_cancel: function(){
                state.visible = false;
            },
            click_ok: function(){
                const param = {
                    kbn: state.kbn,
                    memo: state.text,
                };
                state.callback && state.callback(param);
                state.visible = false;
            },
        },
    };

    g.Vue.component('judge', component);
    
    const func = function(){};
    func.prototype.show_judge = function(title, default_kbn, default_memo, callback){
        if(state.visible){ throw new Error("Judge is shown."); }
        state.callback = callback || null;
        state.title = title || null;
        state.kbn = default_kbn || 0;
        state.text = default_memo || "";
        state.visible = true;
    };

    g.Judge = new func();

})(this);