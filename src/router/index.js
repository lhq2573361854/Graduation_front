import Vue from 'vue'
import VueRouter from 'vue-router'

import {assertUserLogin} from "@/utils";

Vue.use(VueRouter)



const routes = [
  {
    path:'/',
    name:'/',
    redirect:'/home'
  },

  {
    path: '/home',
    name: 'home',
    component: () => import("@/components/Home"),
    meta: { keepAlive: true }
  },

  {
    path: '/article',
    name: 'article',
    component: () => import("@/components/Article"),
    meta: { keepAlive: false },
  },
  {
    path: '/article/:categoryName',
    name: 'articleCategory',
    component: () => import("@/components/Article"),
    meta: { keepAlive: false },
  },
  {
    path: '/detail/:id',
    name:'article detail',
    component: () => import('@/views/ArticleDetail'),
  },
  {
    path: '/message',
    name: 'message',
    component: () => import("@/components/Message"),
    meta: { keepAlive: true }
  },
  {
    path: '/category',
    name: 'category',
    component: () => import("@/components/Category"),
    meta: { keepAlive: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("@/views/Login"),
    meta: { keepAlive: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import("@/views/UserProfile"),
    meta: { keepAlive: false }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import("@/views/Logout"),
    meta: { keepAlive: false }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import("@/views/Register"),
    meta: { keepAlive: true }
  },
  {
    path: '/404',
    name: '404',
    component: () => import("@/views/default/NotFound"),
  },
  {
    path: '/*',
    name: '404 not found',
    component: () => import("@/views/default/NotFound"),
    meta: { keepAlive: true }
  },

]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/logout') {
    if (router.app.$options.store.state.currentUser || JSON.parse(localStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentUser"))) {
      next();
      return
    }
    next('/404')
  }else if (to.path === '/profile'){
    let islogin = assertUserLogin();

    if(!islogin)  next({
      path:'/404',
    })

  }
  next()
})
export default router
