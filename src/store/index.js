import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    curUser: {username: 'loading', avatar: 'https://i.loli.net/2019/02/16/5c67b1a5c60fd.png', moeny: 0}
  },
  mutations: {
    updateCurUser(state, value) {
      if (value.avatar == null || value.avatar.length === 0) {
        value.avatar = 'static/images/default-avatar.png'
      }
      state.curUser = value;
    }
  },
  actions: {}
})
