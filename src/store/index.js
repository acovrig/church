import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import idb from './idb';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: [],
  },
  getters: {
    getVideo: (state) => (id) => {
      let data = state.events.filter(vid => vid.id == id);
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
    /* eslint-disable-next-line */
    init({ commit }) {
      const data = {
        'query': `
          query MyQuery($_eq: uuid = "asdf") {
            events(order_by: {date: desc}) {
              id
              date
              fn
              kind
              name
              pdf
              sub
              scripture: chapters(where: {name: {_eq: "Scripture"}}, limit: 1) {
                info
              }
              chapters {
                name
                info
                who
                ss
                t
              }
              sprites {
                url
                interval
                width
                height
              }
            }
          }        
        `,
        'variables': {},
        'operationName': 'MyQuery',
      };
      axios.post('https://devgraph.thecovrigs.net/v1/graphql', data).then(res => {
        const events = res?.data?.data?.events || [];
        events.map((e) => e.scripture = e.scripture[0]?.info);
        commit('SET_EVENTS', events);
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
