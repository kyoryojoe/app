"use: strinct;";

(function(g){

    const MAP_ONLY = 'MAP_ONLY';
    const MAP_WITH_CAPTURE = 'MAP_WITH_CAPTURE';

    const state = {
        visible: false,
        mode: null,//MAP_WITH_CAPTURE, MAP_ONLY
        base_image: null,
        map: { x: 0, y: 0, z: 0 },
        callback: null,
        render_pointer: true,
        cache_key: null,
    };

    const mapping = function(){};
    mapping.prototype.show_mapping = function(map, image, callback){
        this._show_mapping(MAP_ONLY, map, image, callback)
    };
    mapping.prototype.show_mapping_with_capture = function(map, image, callback){
        this._show_mapping(MAP_WITH_CAPTURE, map, image, callback)
    };
    mapping.prototype._show_mapping = function(mode, map, image, callback){
        if(state.visible){ throw new Error(`already mapping now: ${state.base_image}`); }
        state.mode = mode;
        if(map){
            state.map.x = map?.x || 0;
            state.map.y = map?.y || 0;
            state.map.z = map?.z || 0;
        }else{
            state.map.x = 0; state.map.y = 0; state.map.z = 0;
        }
        state.callback = callback;
        state.base_image = image;
        state.visible = true;
    };
    mapping.prototype.on_mapping = function(x, y, z){
        state.map.x = x;
        state.map.y = y;
        state.map.z = z;
    };
    mapping.prototype.close = function(){
        state.visible = false;
    };

    g.Mapping = new mapping();
    
    const component = {
        template: `
            <figure ui="mapping_panel" style="background-color: silver; background-size: cover;" v-if="visible">
                <img :src="no_cache_image" alt="" @load="rerender_pointer" @click="on_mapping" ref="bgimage" />
                <p class="box_in_figure_tl">
                    <span class="text_shadow">マッピング位置をクリックしてください</span>
                </p>
                
                <span v-if="render_pointer" class="icon" :style="get_pointer_style()">
                    <i class="fa fa-4x fa-crosshairs"></i>
                </span>                
                <p class="box_in_figure_bl">
                    <a class="button" @click="on_cancel">
                        <span>キャンセル</span>
                    </a>
                </p>
                <p class="box_in_figure_br">
                    <camera v-if="mode_is_capture" @captured="on_captured"></camera>
                    <a v-if="mode_is_only" class="button is-primary" @click="on_ok">
                        <span>OK</span>
                    </a>
                </p>
            </figure>
        `,
        props: [],
        data: function(){
            state.cache_key = +new Date();
            return state;
        },
        computed: {
            mode_is_only: function(){
                return this.mode == MAP_ONLY;
            },
            mode_is_capture: function(){
                return this.mode == MAP_WITH_CAPTURE;
            },
            no_cache_image: function(){
                //何故か再描画され続けるのでcache_keyを固定する
                return `${this.base_image}?${this.cache_key}`;
            },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            rerender_pointer: function(){
                this.render_pointer = false;
                const self = this;
                this.$nextTick(function(){
                    self.render_pointer = true;
                });
            },
            get_pointer_style: function(){
                const $img = this.$refs.bgimage;
                const scale_width = $img?.width || 0;
                const scale_height = $img?.height || 0;
                if(!$img){ this.rerender_pointer(); }

                return {
                    "position": "absolute",
                    "display": "block",
                    "margin": "0",
                    "padding": "0",
                    "text-align": "center",
                    "animation": "point-color 1s infinite",
                    "-webkit-animation": "point-color 1s infinite",
                    // "transform": "translate(-50%, -50%)",//fa-1x
                    "transform": "translate(-27.5px, -32px)",//fa-4x
                    "left": `calc(50% + ${this.map.x * scale_width}px)`,
                    "top": `calc(50% + ${this.map.y * scale_height}px)`,
                };
            },

            on_mapping: function($event){
                const $img = $event.target;
                const scale_width = $img.width;
                const scale_height = $img.height;
                const click_x = $event.offsetX;
                const click_y = $event.offsetY;
                const x = (click_x - (scale_width / 2)) / scale_width;
                const y = (click_y - (scale_height / 2)) / scale_height;
                g.Mapping.on_mapping(x, y, 0);
                this.rerender_pointer();
            },
            on_captured: function($event){
                const image = $event.image;//base64
                const map = {
                    x: this.map.x,
                    y: this.map.y,
                    z: null,
                };
                this.callback(map, image);
                g.Mapping.close();
                this.rerender_pointer();
            },
            on_ok: function($event){
                const map = {
                    x: this.map.x,
                    y: this.map.y,
                    z: null,
                };
                this.callback(map);
                g.Mapping.close();
                this.rerender_pointer();
            },
            on_cancel: function($event){
                g.Mapping.close();
                this.rerender_pointer();
            },
        },
    };

    g.Vue.component('mapping', component);

})(this);