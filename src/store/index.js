import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    curUser: null
  },
  mutations: {
    updateCurUser(state, value) {
      state.curUser = value;
    }
  },
  actions: {}
})
