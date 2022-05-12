import Vue from 'vue'
import Router from 'vue-router'
import GameCenter from '@/views/GameCenter'
import Login from '@/views/Login'
import TestLogin from '@/views/TestLogin'
import Room from '@/views/Room'
import NotFound from '@/views/error/NotFound'
import OAuth from '@/views/OAuth'
import Test from '@/views/Test'

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
      component: TestLogin
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
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
