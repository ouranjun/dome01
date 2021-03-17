import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './config/rem'
import './style/iconfont/iconfont.css'
import axios from 'axios'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
Vue.prototype.$store = store
Vue.prototype.$cookies = VueCookies
new Vue({
  router,
  store,
  axios,
  VueCookies,
  render: h => h(App)
}).$mount('#app')
