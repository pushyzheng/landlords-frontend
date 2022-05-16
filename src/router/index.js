import Vue from 'vue'
import Router from 'vue-router'
import GameCenter from '@/views/GameCenter'
import Login from '@/views/Login'
import Room from '@/views/Room'
import NotFound from '@/views/error/NotFound'
import ServerError from '@/views/error/ServerError'
import OAuth from '@/views/OAuth'
import Components from '@/views/Components'

Vue.use(Router)

export default new Router({
  routes: [
    /**
     * 游戏大厅(首页)
     */
    {
      path: '/',
      name: 'GameCenter',
      component: GameCenter
    },
    /**
     * 登录界面
     */
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    /**
     * 后端 QQ OAuth 回调地址
     */
    {
      path: '/oauth/:token',
      name: 'OAuth',
      component: OAuth
    },
    /**
     * 房间
     */
    {
      path: '/rooms/:id',
      name: 'Room',
      component: Room
    },
    /**
     * 组件测试
     */
    {
      path: '/components',
      name: 'Components',
      component: Components
    },
    {
      path: '/500',
      name: 'ServerError',
      component: ServerError
    },
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
