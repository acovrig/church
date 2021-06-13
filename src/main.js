import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Clipboard from 'v-clipboard';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import moment from 'moment';
import vuetify from './plugins/vuetify';

import _ from 'lodash';
import bible from '@/nkjv.bible.json';

Vue.use(VueAxios, axios);
Vue.use(Clipboard);

axios.interceptors.request.use((config) => {
  config.headers.Accepts = 'application/json';
  config.headers['Content-Type'] = 'application/json';
  return config;
});

Vue.config.productionTip = false;
Vue.prototype.moment = moment;

Vue.filter('upper', function(value) {
  value.toLowerCase().split(' ');
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('humanDate', (val) => {
  return moment(val).format('LL');
});

Vue.mixin({
  methods: {
    getScripture: (ref) => {
      const m = ref.match(/^(.+?) ([0-9]+):(.+?)$/)
      const book = m[1];
      const chapt = parseInt(m[2]);
      let verse = m[3];
      var scripture = [];
      if(verse.indexOf(',') > 0) {
        verse = verse.split(',').map((v) => v.trim());
      } else {
        verse = [verse];
      }
      if (verse.join(',').indexOf('-') > 0) {
        verse = verse.map((v) => {
          if (v.indexOf('-') === -1) return v;
          const a = parseInt(v.split('-')[0]);
          const b = parseInt(v.split('-')[1]);
          return _.range(a, b + 1);
        });
      }
      verse = verse.flat().map((v) => parseInt(v));
      scripture = bible.books.find((b) => b.name === book);
      scripture = scripture.chapters.find((c) => c.num === chapt);
      scripture = scripture.verses.filter((c) => verse.indexOf(c.num) > -1);
      return scripture;
    },
  },
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch('initStore');
  },
  mounted() {
    this.$store.dispatch('init');
  },
}).$mount('#app');
