import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router';
import axios from 'axios'
import _ from 'lodash';

// import idb from './idb';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: [],
    admin: false,
    key: null,
    notify: null,
  },
  getters: {
    getVideo: (state) => (id) => {
      let data = state.events.filter(vid => vid.id == id);
      if(data.length > 0)
        return data[0];
      return {};
    },
    admin: (state) => state.key !== null,
    notify: (state) => state.notify,
  },
  mutations: {
    SET_EVENTS(state, events) {
      Vue.set(state, 'events', events);
      localStorage.setItem('events', JSON.stringify(events));
      // idb.saveEvents(events);
    },
    key(state, val) {
      Vue.set(state, 'key', val);
    },
    notify(state, val) {
      Vue.set(state, 'notify', val);
    },
  },
  actions: {
    init({ commit }) {
      const data = {
        'query': `
          query MyQuery {
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
              chapters(order_by: {order_num: asc}) {
                id
                name
                info
                who
                ss
                t
                order_num
              }
              sprites {
                id
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
    },
    saveVideo({ commit }, {orig, video}) {
      video.chapters.forEach((chapt, i) => {
        video.chapters.splice(i, 1, {...chapt, ...{order_num: i}});
      });
      const diff = [];
      const rm = [];
      video.chapters.forEach(chapt => {
        const cj = JSON.stringify(chapt);
        if (!orig.chapters.map((c) => JSON.stringify(c)).includes(cj)) {
          diff.push({...JSON.parse(cj), ...{event_id: video.id}});
        }
      });
      orig.chapters.forEach(chapt => {
        const cj = JSON.stringify(chapt);
        if (!video.chapters.map((c) => JSON.stringify(c)).includes(cj) && !diff.map((d) => d.id).includes(chapt.id)) {
          rm.push(JSON.parse(cj).id);
        }
      });
      const id = video.id;
      const vid = {...video};
      delete vid.chapters;
      delete vid.id;
      delete vid.sprites;

      /* eslint-disable no-useless-escape */
      const data = {
        'query': `
          mutation MyMutation {
            update_events(where: {id: {_eq: "${id}"}}, _set: ${JSON.stringify(vid).replace(/\\"/g,"\uFFFF").replace(/"([^"]+)":/g, '$1:').replace(/\uFFFF/g, '\\\"')}) {
              affected_rows
              returning {
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
                chapters(order_by: {order_num: asc}) {
                  id
                  name
                  info
                  who
                  ss
                  t
                  order_num
                }
                sprites {
                  id
                  url
                  interval
                  width
                  height
                }
              }
            }
            delete_chapters(where: {id: {_in: ${JSON.stringify(rm)}}}) {
              affected_rows
            }
            insert_chapters(objects: ${JSON.stringify(diff).replace(/\\"/g,"\uFFFF").replace(/"([^"]+)":/g, '$1:').replace(/\uFFFF/g, '\\\"')}, on_conflict: {
              constraint:chapters_pkey,
              update_columns:[name, info, who, order_num, t, ss]
            }) {
              affected_rows
            }
          }
        `,
        'variables': {},
        'operationName': 'MyMutation',
      };
      axios.post('https://devgraph.thecovrigs.net/v1/graphql', data, {headers: {'x-hasura-admin-secret': this.state.key}}).then(res => {
        if (res.data.errors) {
          console.error(res.data.errors);
          // commit('notify', [...this.getters.notify, ...[{msg: 'Something went wrong saving the video, is the key correct', type: 'error' }]]);
          if (res.data.errors[0]?.extensions?.code === 'access-denied') {
            this._vm.$toast.error('Bad key, try refreshing.', {
              position: "top-right",
              timeout: 10000,
              icon: true
            });
          } else {
            this._vm.$toast.error('Something went wrong saving the video', {
              position: "top-right",
              timeout: 10000,
              icon: true
            });
          }
          return false;
        }
        let event = res?.data?.data?.update_events?.returning || [];
        event = event[0] || {};
        event.scripture = event.scripture[0]?.info;
        commit('SET_EVENTS', _.unionBy([event], this.state.events, 'id'));

        router.push({ name: 'Watch', params: { id } });

        const ur = res.data.data.update_events.affected_rows;
        const dr = res.data.data.delete_chapters.affected_rows;
        const ir = res.data.data.insert_chapters.affected_rows;
        if (ur > 0) {
          commit('notify', [...this.getters.notify, ...[{msg: ur + ' row' + (ur > 1 ? 's' : '') + ' saved', type: 'success' }]]);
          // this.$toast.success(ur + ' row' + (ur > 1 ? 's' : '') + ' saved', {
          //   position: "top-right",
          //   timeout: 5000,
          //   icon: true
          // });
        }
        if (dr > 0) {
          commit('notify', [...this.getters.notify, ...[{msg: dr + ' row' + (dr > 1 ? 's' : '') + ' deleted', type: 'warning' }]]);
          // this.$toast.warning(dr + ' row' + (dr > 1 ? 's' : '') + ' deleted', {
          //   position: "top-right",
          //   timeout: 5000,
          //   icon: true
          // });
        }
        if (ir > 0) {
          commit('notify', [...this.getters.notify, ...[{msg: ir + ' row' + (ir > 1 ? 's' : '') + ' saved', type: 'success' }]]);
          // this.$toast.success(ir + ' row' + (ir > 1 ? 's' : '') + ' saved', {
          //   position: "top-right",
          //   timeout: 5000,
          //   icon: true
          // });
        }
      }).catch(err => {
        console.error(err);
      });
    },
  },
  modules: {
  }
})
