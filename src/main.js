// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import global from './config/global'
import store from './store'
// third-party components
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import Popover from 'vue-js-popover'
import VueFullscreen from 'vue-fullscreen'

Vue.use(MuseUI);
Vue.use(VueToast);
Vue.use(Popover)
Vue.use(VueFullscreen)

Vue.config.productionTip = false
Vue.use(global)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
