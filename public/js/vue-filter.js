"use: strinct;";

(function(g){

    const URL_NOIMAGE = "/img/noimage.png";
    /**
     * Filter - Biz
     */
    /** Bridge.inspects内の最新OutlineImageを返却する */
    g.Vue.filter('inspects_from_outline_image', function (inspects) {//[inspect, ..]-> url
        if(!inspects || inspects.length <= 0){ return URL_NOIMAGE; }
        const image = inspects.concat()
        .sort(function(a, b){
            const ad = +new Date(a.date);
            const bd = +new Date(b.date);
            return bd - ad;
        })
        .filter(function(inspect){ return !!inspect.image; })
        .map(function(inspect){ return inspect.image; })[0];
        return image || URL_NOIMAGE;
    });
    /** URL末尾に?###入れてキャッシュが表示されないようにする */
    g.Vue.filter('url_to_no_cache', function (url) {//url -> url?###
        if(!url || url == URL_NOIMAGE){ return URL_NOIMAGE; }
        return `${url}?${+new Date()}`;
    });
    /** 巡目の表記 */
    g.Vue.filter('n2_junme_short', function (num) {//number
        if (!num && num !== 0) {return '';}
        return `${num}巡目`;
    });
    g.Vue.filter('n2_junme_long', function (num) {//number
        if (!num && num !== 0) {return '';}
        if (num <= 0) {return '';}
        const year_from = 2014 + Math.floor(num / 5);
        const year_to = year_from + 4
        return `${num}巡目（${year_from}年～${year_to}年）`;
    });
    // g.Vue.filter('to_junme_short', function (work) {//g.STATE.work.globals[n]
    //     if (!work) {return '';}
    //     return `${work.junme}巡目`;
    // });
    // g.Vue.filter('to_junme_long', function (work) {//g.STATE.work.globals[n]
    //     if (!work) {return '';}
    //     return `${work.junme}巡目（${work.from_year}年～${work.to_year}年）`;
    // });

    /** 判定区分の表記 */
    g.Vue.filter('n2_judge_kbn', function (num) {//number
        switch(num){
            case 1: return "Ⅰ";
            case 2: return "Ⅱ";
            case 3: return "Ⅲ";
            case 4: return "Ⅳ";
            default: return "-";
        }
    });

    /** 橋梁情報 */
    g.Vue.filter('f2_umu', function (value) {
        if (!value && value !== false) {return '-';}
        return value ? 'あり' : 'なし';
    });
    g.Vue.filter('f2_ox', function (value) {
        if (!value && value !== false) {return '-';}
        return value ? '〇' : '×';
    });
    g.Vue.filter('n2_m', function (num) {
        if (!num && num !== 0) {return '-';}
        return `${num} m`;
    });
    g.Vue.filter('n2_kg', function (num) {
        if (!num && num !== 0) {return '-';}
        return `${num} kg`;
    });
    g.Vue.filter('n2_y', function (num) {
        if (!num && num !== 0) {return '-';}
        return `${num} 年`;
    });
    g.Vue.filter('n2_dfb', function (num) {//度°分′秒″	
        if (!num && num !== 0) {return '-';}
        const d = Math.floor(num);
        const f = Math.floor((num - d) * 60);
        const b = Math.floor((num - d - (f / 60)) * 3600);
        return `${d}° ${f}′ ${b}″`;
    });
    g.Vue.filter('n2_road_type', function (num) {
        switch(num){
            case 1: return "一般道";
            case 2: return "高速道路";
            default: return "-";
        }
    });
    /**
     * Filter - General
     */
    g.Vue.filter('date_ymd', function (d) {
        const date = new Date(d);
        if(!d || isNaN(date)){ return "-"; }
        var f = new DateFormat("yyyy/MM/dd");
        return f.format(new Date(date));
    });


})(this);