import Vue from 'vue'
import Vuex from 'vuex'

import db from '@/db.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    db: db
  },
  getters: {
    getVideo: (state) => (fn) => {
      let data = state.db.filter(vid => vid.fn == fn);
      if(data.length > 0)
        return data[0];
      return {};
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
