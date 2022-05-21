export default {
  isNull(s) {
    return s == null || s == undefined;
  },
  isEmpty(s) {
    return s == null || s == undefined || s.length === 0;
  },
  isNotEmpty(s) {
    return !this.isEmpty(s);
  },
  getWdith() {
    return document.documentElement.clientWidth
  },
  isPhone() {
    return this.getWdith() < 900
  },
  matchMediaLandscape() {
    return window.matchMedia('(orientation: landscape)')
  },
  /**
   * 安全地移除 bootstrap Modal 在 Vue 路由跳转后(因为还在一个页面), 仍然保留的遮罩
   */
  removeModalBackdrop() {
    let body = document.getElementsByTagName("body")[0]
    let deleted = []

    for (let i = 0; i < body.children.length; i++) {
      let child = body.children[i]
      if (child.className.startsWith('modal-backdrop')) {
        deleted.push(child)
      }
    }
    deleted.forEach(e => body.removeChild(e));
  }
}
