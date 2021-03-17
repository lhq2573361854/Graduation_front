import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios)
Vue.axios.defaults.baseURL='/api'

//let auth_token = document.cookie.split(";").find(item => item.match("auth_token")).split("=")[1];
let utils = require('./utils');
let normalizeHeaderName = require('./normalizeHeaderName');
function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
    }
}
const request = Vue.axios.create({
    headers: {
        get: {
            'Content-Type': 'application/json',
            "auth_token":'BearereyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4sdmlwIiwiYXV0aG9yaXR5IjoiL2FydGljbGUvKiosL2F1dGhvcml0eS8qKiwvY2F0ZWdvcnkvKiosL2NvbW1lbnQvKiosL2xlYXZlLW1lc3NhZ2UvKiosL3JvbGUvKiosL3Rlc3QvKiosL3VzZXIvKioiLCJzdWIiOiJ0aWFubGluZyIsImlhdCI6MTYxNTYyMzA1OCwiZXhwIjoxNjE2MjI3ODU4fQ.1fe7H_r6jHHiWFc9TIr-EC8_Rfq5FVMsbpUciYj_oes'
        },
        post: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        }
    },
    timeout: 10000,
    transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Content-Type');
        if (utils.isFormData(data) ||
            utils.isArrayBuffer(data) ||
            utils.isBuffer(data) ||
            utils.isStream(data) ||
            utils.isFile(data) ||
            utils.isBlob(data)
        ) {
            return data;
        }
        if (utils.isArrayBufferView(data)) {
            return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
            setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
            return data.toString();
        }

        if (utils.isObject(data)) {
            setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
            let _data = Object.keys(data)
            return encodeURI(_data.map(name => `${name}=${data[name]}`).join('&'));
        }
        return data;
    }],
})

request.interceptors.request.use((config) => {
    return config
}, (error) => {
    error.data = {}
    error.data.msg = '服务器异常，请联系管理员！'
    return Promise.resolve(error)
})

request.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    error.data = {}
    error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！'
    return Promise.resolve(error)
})

export default request
