import Vue from 'vue'
import Router from 'vue-router'
import GameCenter from '@/views/GameCenter'
import Login from '@/views/Login'
import Room from '@/views/Room'
import NotFound from '@/views/error/NotFound'
import OAuth from '@/views/OAuth'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GameCenter',
      component: GameCenter
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/oauth/:token',
      name: 'OAuth',
      component: OAuth
    },
    {
      path: '/rooms/:id',
      name: 'Room',
      component: Room
    },
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
