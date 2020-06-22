import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

router.beforeEach((to,from,next)=>{
  let user=store.getters.getUser;
  if ((to.name=="RegistrationForm") || (to.name=="Home") || (user!=null && user!=undefined))
    next();
  else
    next("/");
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
