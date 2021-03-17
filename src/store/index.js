import Vue from 'vue'
import Vuex from 'vuex'

import request from "@/axios";
import {getUuid, onopen,onmessage,onclose} from "@/utils";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    categoryList:[],
    starList:[],
    userList:[],
    colors:["primary","secondary","green","success","indigo","orange","green darken-1","teal"],
    currentUser:'',
    page:1,
    ws:{}
},
  mutations: {
    setCategory:(state, payload)=>{
      state.categoryList = payload
    },
    setStarList:(state, payload)=>{
      state.starList = payload
    },
    setUserList:(state, payload)=>{
      state.userList = payload
    },
    setPage:(state, payload)=>{
      state.page = payload
    },
    setWebSocket(state){
      state.ws = new WebSocket("ws://localhost:8080/websocket?id=" + getUuid())
      state.ws.onopen = onopen
      state.ws.onmessage = onmessage
      state.ws.onclose = onclose
    },
    updateStarList:(state,payload)=>{
      let index = state.starList.findIndex(value => value.id === payload.id)
      let obj = state.starList[index]
      if(payload.code === 1){
        obj["starNumber"] +=1;
        obj["isClickStar"] = true
      }else if(payload.code === 2){
        obj["starNumber"] -=1;
        obj["isClickStar"] = false
      }
      Vue.set(state.starList,index,obj)
    },
    updateCurrentUser:(state, payload) =>{
      state.currentUser = payload
    },
    getRole(roles){
      if( roles.search("vip") !== -1){
        return "会员";
      }else if( roles.search("admin") !== -1){
        return  "管理员"
      }
      return "普通用户"
    },
    setStarClick:(state,payload)=>{
      let index = state.starList.findIndex(value => value.id === payload.id)
      let obj = state.starList[index]
      obj["isClickStar"] = payload["isClickStar"]
      Vue.set(state.starList,index,obj)
    }

  },
  actions: {
    async getCategory({commit}) {
      const result =  await request.get('/category/getAllCategory');
      commit('setCategory', result.data);
    },
    async getStarList({commit}) {
      const result =  await request.get('/article/getAllArticle');
       commit('setStarList', result.data.map(article => ({"id" : article.id,"starNumber": article.articleStars,isClickStar:false})));
    },
    async getUserList({commit}) {
      const result =  await request.get('/user/getAllUser');
      commit('setUserList', result.data.map(user => ({"id" : user.id,"username": user.userName})));
    },



  },
  getters:{
    getCategoryName:(state) => (id)=>{
      return state.categoryList && state.categoryList.find(item => item.id === id) && state.categoryList.find(item => item.id === id)["categoryName"]
    },
    getCategoryList:(state) => {
      return state.categoryList
    },
    getStarList:(state) => {
      return state.starList
    },
    getStar:(state) => (id)=> {
      return state.starList && state.starList.find(item=> item.id===id) && state.starList.find(item=> item.id===id)['starNumber']
    },
    getStarClick:(state) => (id)=> {
      return state.starList && state.starList.find(item=> item.id===id) && state.starList.find(item=> item.id===id)['isClickStar']
    },
    getUserName:(state)=>(id)=>{
      return state.userList && state.userList.find(item=> item.id===id) &&state.userList.find(item=> item.id===id)['username']
    },
    getColor:(state)=>(id)=>{
      return state.colors[id % state.colors.length]
    },
    getCurrentUser:(state) => {
      return state.currentUser && state.currentUser.userinfo
    },
    getUserInfo:(state)=>{
      return state.currentUser
    },
    getPage:(state)=>{
      return state.page
    },
    getWebSocket:(state)=>{
      return state.ws
    }

  }

})
