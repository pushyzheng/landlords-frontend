import Vue from 'vue'
import axios from 'axios'
import enums from './enums'
import urls from './urls'
import notif from './noitf'
import images from './images'
import utils from './utils'
import storage from '../service/storage'

// axios全局配置Token头
axios.defaults.headers.common['token'] = storage.token.get();

const eventBus = new Vue()

export default {
  install() {
    Vue.prototype.$http = axios;
    Vue.prototype.$enums = enums;
    Vue.prototype.$urls = urls;
    Vue.prototype.$notif = notif
    Vue.prototype.$images = images
    Vue.prototype.$utils = utils
    Vue.prototype.$storage = storage
    /* Event bus */
    Vue.prototype.$eventBus = eventBus
  }
}
