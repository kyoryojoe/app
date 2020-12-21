"use: strinct;";

(function(g){

    const state = {
        hook: {
            start: null,
            end: null,
            error: null,
        },
    };

    //axios.defaults.baseURL = "http://localhost:4567";
    axios.interceptors.request.use(function (request) {
        state.hook.start && state.hook.start();
        return request;
    }, function (error) {
        state.hook.error && state.hook.error(error);
        state.hook.end && state.hook.end();
        return Promise.reject(error);
    });
    axios.interceptors.response.use(function (response) {
        if(response.request.status == 200){
            state.hook.end && state.hook.end();
            return response;
        }else{
            state.hook.error && state.hook.error(response);
            state.hook.end && state.hook.end();
            return Promise.reject(response);//あってんのかな？
        }
    }, function (error) {
        state.hook.error && state.hook.error(error);
        state.hook.end && state.hook.end();
        return Promise.reject(error);
    });

    // const ADMIN_BASE_URI = "/api/admin";
    // const SYNC_BASE_URI = "/api/sync";
    const TOOLS_BASE_URI = "/api/tools";
    const INSPECT_BASE_URI = "/api/inspect";
    const api = function(){};

    //General
    // api.prototype.set_base_url = function(url){
    //     //ATTENTION: 末尾に"/"いらない
    //     axios.defaults.baseURL = url;
    // };
    api.prototype.set_hooks = function(start, end, error){
        state.hook.start = start;
        state.hook.end = end;
        state.hook.error = error;
    };

    //Tool
    api.prototype.git_clone = function(junme, _url, mailaddress, password){
        const url = `${TOOLS_BASE_URI}/clone/${junme}`;
        const params = {
            url: _url,
            mailaddress: mailaddress,
            password: password,
        };
        return axios.put(url, params);
    };
    api.prototype.sync_repositories = function(){
        const url = `${TOOLS_BASE_URI}/sync`;
        const params = {};
        return axios.put(url, params);
    };
    api.prototype.get_ssh_pubkey = function(){
        const url = `${TOOLS_BASE_URI}/pubkey`;
        const params = {};
        return axios.get(url, params);
    };


    //Inspect
    api.prototype.get_repositories = function(){
        const url = `${INSPECT_BASE_URI}/`;
        const params = {};
        return axios.get(url, params);
    };
    api.prototype.get_bridges = function(junme){
        const url = `${INSPECT_BASE_URI}/${junme}/bridges`;
        const params = {};
        return axios.get(url, params);
    };
    api.prototype.get_bridge = function(junme, bridge_id){
        const url = `${INSPECT_BASE_URI}/${junme}/bridges/${bridge_id}`;
        const params = {};
        return axios.get(url, params);
    };
    api.prototype.start_new_inspect = function(junme, bridge_id){
        const url = `${INSPECT_BASE_URI}/${junme}/inspects/${bridge_id}`;
        const params = {};
        return axios.put(url, params);
    };
    api.prototype.get_inspect = function(junme, bridge_id, inspect_cd){
        const url = `${INSPECT_BASE_URI}/${junme}/inspects/${bridge_id}/${inspect_cd}`;
        const params = {};
        return axios.get(url, params);
    };
    api.prototype.get_templates = function(junme, bridge_id, inspect_cd){
        const url = `${INSPECT_BASE_URI}/${junme}/inspects/${bridge_id}/${inspect_cd}/templates`;
        const params = {};
        return axios.get(url, params);
    };
    api.prototype.save_inspect = function(junme, bridge_id, inspect_cd, data){
        const url = `${INSPECT_BASE_URI}/${junme}/inspects/${bridge_id}/${inspect_cd}`;
        const params = data;
        return axios.post(url, params);
    };
    api.prototype.save_outline_image = function(junme, bridge_id, inspect_cd, base64){
        const url = `${INSPECT_BASE_URI}/${junme}/inspects/${bridge_id}/${inspect_cd}/image/outline`;
        const params = { base64: base64 };
        return axios.post(url, params);
    };
    api.prototype.save_part_image = function(junme, bridge_id, inspect_cd, part_cd, part_seq, base64){
        const url = `${INSPECT_BASE_URI}/${junme}/inspects/${bridge_id}/${inspect_cd}/image/part/${part_cd}/${part_seq}`;
        const params = { base64: base64 };
        return axios.post(url, params);
    };
    api.prototype.save_check_image = function(junme, bridge_id, inspect_cd, part_cd, part_seq, check_seq, base64){
        const url = `${INSPECT_BASE_URI}/${junme}/inspects/${bridge_id}/${inspect_cd}/image/check/${part_cd}/${part_seq}/${check_seq}`;
        const params = { base64: base64 };
        return axios.post(url, params);
    };
    api.prototype.save_damage_image = function(junme, bridge_id, inspect_cd, part_cd, part_seq, check_seq, damage_seq, base64){
        const url = `${INSPECT_BASE_URI}/${junme}/inspects/${bridge_id}/${inspect_cd}/image/damage/${part_cd}/${part_seq}/${check_seq}/${damage_seq}`;
        const params = { base64: base64 };
        return axios.post(url, params);
    };






    ////////////////////////////////////////////////

    //Common Config
    // api.prototype.get_config = function(){
    //     const url = `/api/config`;
    //     const params = {};
    //     return axios.get(url, params);
    // };


    //
    //Admin
    //
    // api.prototype.get_admin_info = function(){
    //     const url = `${ADMIN_BASE_URI}/info`;
    //     const params = {};
    //     return axios.get(url, params);
    // };
    // api.prototype.set_admin_master = function(repository_url){
    //     const url = `${ADMIN_BASE_URI}/master`;
    //     const params = { url: repository_url };
    //     return axios.put(url, params);
    // };
    // api.prototype.remove_admin_master = function(){
    //     const url = `${ADMIN_BASE_URI}/master`;
    //     const params = new URLSearchParams();//deleteのときはbodyで渡せない
    //     return axios.delete(url, {data: params});
    // };
    // api.prototype.set_admin_inspect = function(junme, repository_url){
    //     const url = `${ADMIN_BASE_URI}/inspects/${junme}`;
    //     const params = { url: repository_url };
    //     return axios.put(url, params);
    // };
    // api.prototype.remove_admin_inspect = function(junme){
    //     const url = `${ADMIN_BASE_URI}/inspects/${junme}`;
    //     const params = new URLSearchParams();//deleteのときはbodyで渡せない
    //     params.append("junme", junme);
    //     return axios.delete(url, {data: params});
    // };

    //
    //Sync
    //
    // api.prototype.get_sync_info = function(){
    //     const url = `${SYNC_BASE_URI}/info`;
    //     const params = {};
    //     return axios.get(url, params);
    // };
    // api.prototype.set_sync_master = function(repository_url){
    //     const url = `${SYNC_BASE_URI}/master`;
    //     const params = { url: repository_url };
    //     return axios.put(url, params);
    // };
    // api.prototype.set_sync_inspect = function(junme, repository_url){
    //     const url = `${SYNC_BASE_URI}/inspects/${junme}`;
    //     const params = { url: repository_url };
    //     return axios.put(url, params);
    // };
    // api.prototype.remove_sync_inspect = function(junme){
    //     const url = `${SYNC_BASE_URI}/inspects/${junme}`;
    //     const params = new URLSearchParams();//deleteのときはbodyで渡せない
    //     params.append("junme", junme);
    //     return axios.delete(url, {data: params});
    // };




    /////////////////////////////////////////////////////////
    //Member
    api.prototype.append_member = function(name){
        const url = MEMBER_BASE_URI;
        const params = { name: name };
        return axios.put(url, params);
    };
    api.prototype.update_member = function(id, name){
        const url = MEMBER_BASE_URI;
        const params = { id: id, name: name };
        return axios.post(url, params);
    };
    api.prototype.delete_member = function(id){
        const url = MEMBER_BASE_URI;
        const params = new URLSearchParams();//deleteのときはbodyで渡せない
        params.append("id", id);
        return axios.delete(url, {data: params});
    };

    api.prototype.load_all_members = function(){
        const url = `${MEMBER_BASE_URI}/all`;
        const params = {};
        return axios.get(url, params);
    };



    g.API = new api();

})(this);