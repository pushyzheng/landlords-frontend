import utils from "../config/utils";

export default {
  token: {
    get: () => localStorage.getItem('token'),
    hasToken() {
      return utils.isNotEmpty(this.get())
    },
    set: (token) => localStorage.setItem('token', token),
    remove: () => localStorage.removeItem('token')
  }
}
