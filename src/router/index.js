import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Watch from '../views/Watch.vue'
import VideoEdit from '../views/VideoEdit.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/watch/:id',
    name: 'Watch',
    component: Watch
  },
  {
    path: '/watch/:id/edit',
    name: 'EditVideo',
    component: VideoEdit,
    beforeEnter: (to, _from, next) => {
      if (!store.getters.admin) {
        store.commit('notify', [{msg: 'Not Logged In', type: 'error'}]);
        next({name: 'Watch', params: to.params});
      } else {
        next();
      }
    },
  },
  {
    path: '/programs/:program',
    name: 'Programs',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
