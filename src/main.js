import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { BootstrapVue, IconsPlugin, DropdownPlugin, TablePlugin, LayoutPlugin } from 'bootstrap-vue'
import Clipboard from 'v-clipboard'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue, IconsPlugin, DropdownPlugin, TablePlugin, LayoutPlugin)
Vue.use(VueAxios, axios)
Vue.use(Clipboard)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch('initStore');
  },
  mounted() {
    this.$store.dispatch('init');
  }
}).$mount('#app');
