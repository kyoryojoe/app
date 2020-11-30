"use: strinct;";

(function(g){

    const component = {
        template: `
            <popup :visible="visible">
                <p>
                    巡目ごとの点検データ（リポジトリ）URLを指定して配置します。
                </p>
                <p class="has-text-danger">
                    【注意】ブランチ切り替えの運用には対応していません。
                    必要に応じてコマンドラインから操作してください。
                </p>
                <div class="field is-grouped">
                    <div class="control has-icons-left">
                        <input class="input" type="number" v-model="junme" />
                        <span class="icon is-small is-left">
                            巡目
                        </span>
                    </div>
                    <p class="control is-expanded">
                        <input class="input is-fullwidth" type="text" v-model="url" placeholder="URL" />
                    </p>
                </div>

                <p>以下は認証情報が必要な場合のみ入力してください。（GitHubプライベートリポジトリの場合）</p>
                <div class="field is-grouped">
                    <p class="control is-expanded">
                        <input class="input" type="text" v-model="mailaddress" placeholder="ユーザID（任意）"/>
                    </p>
                    <p class="control is-expanded">
                        <input class="input" type="text" v-model="password" placeholder="パスワード（任意）"/>
                    </p>
                </div>
                <p style="text-align: right;">
                    <button class="button" @click="click_cancel">Cancel</button>
                    <button class="button is-primary" @click="click_ok">OK</button>
                </p>
            </popup>
        `,
        props: ["visible"],
        data: function(){
            return {
                junme: 0,
                url: null,
                mailaddress: null,
                password: null,
            };
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            click_cancel: function(){
                this.$emit("close", null);
            },
            click_ok: function(){
                const params = {
                    junme: this.junme * 1,
                    url: this.url,
                    mailaddress: this.mailaddress,
                    password: this.password,
                };
                if(params.junme * 1 <= 0){ return; }
                if(!params.url){ return; }
                if(!params.url.match(/^https?:.+\.git$/)){ return; }
                if(!!params.mailaddress ^ !!params.password){ return; }//片方だけ入力はNG
                if(params.mailaddress && !params.mailaddress.match(/.+@.+/)){ return; }
                this.$emit("close", params);
            },
        },
    };

    g.Vue.component('git-clone', component);

})(this);