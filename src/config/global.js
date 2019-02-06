import Vue from 'vue'
import axios from 'axios'
import enums from './enums'
import urls from './urls'

// axios全局配置Token头
axios.defaults.headers.common['token'] = localStorage.getItem('token');

export default {
  install () {
    Vue.prototype.$http = axios;
    Vue.prototype.$enums = enums;
    Vue.prototype.$urls = urls;
  }
}
