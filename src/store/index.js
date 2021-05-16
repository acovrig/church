import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import idb from './idb';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: []
  },
  getters: {
    getVideo: (state) => (fn) => {
      let data = state.events.filter(vid => vid.fn == fn);
      if(data.length > 0)
        return data[0];
      return {};
    }
  },
  mutations: {
    SET_EVENTS(state, events) {
      Vue.set(state, 'events', events);
      localStorage.setItem('events', JSON.stringify(events));
      // idb.saveEvents(events);
    }
  },
  actions: {
    init({ commit }) {
      axios.get('https://church.thecovrigs.net/api/events').then(res => {
        commit('SET_EVENTS', res.data);
      }).catch(err => {
        console.error(err);
      });
    },
    initStore({ commit }) {
      let lsEvents = localStorage.getItem('events');
      if(lsEvents !== null) {
        commit('SET_EVENTS', JSON.parse(lsEvents));
      }
      // idb.getEvents().then(data => {
      //   commit('GET_EVENTS', data);
      // });
    }
  },
  modules: {
  }
})
