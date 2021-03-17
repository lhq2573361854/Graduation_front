import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import CKEditor from '@ckeditor/ckeditor5-vue2'
import Meta from 'vue-meta'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false
Vue.config.devtools = true;

Vue.use(CKEditor).use(Vuelidate).use(Meta)

store.dispatch('getCategory')
store.dispatch('getUserList')
store.dispatch('getStarList')

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
