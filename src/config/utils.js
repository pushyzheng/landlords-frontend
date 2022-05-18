export default {
  isEmpty(s) {
    return s == null || s == undefined || s.length === 0;
  },
  getWdith() {
    return document.documentElement.clientWidth
  },
  isPhone() {
    return this.getWdith() < 900
  },
  matchMediaLandscape() {
    return window.matchMedia('(orientation: landscape)')
  }
}
