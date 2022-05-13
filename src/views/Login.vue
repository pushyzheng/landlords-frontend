<template>
  <div id="login-view" v-bind:style="loginViewStyleObj">
    <img src="../assets/qq-connect.png"
         style="border-radius: 50px;"
         @click="redirectQQLogin"
         alt="qq">

    <button type="button" class="btn btn-primary" @click="showLoginModal">
      账号密码登录
    </button>

    <Modal header-img="/static/images/poker.png" ref="loginModal" @submit="submit">
      <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="showAlert">
        <strong>Hello {{ body.username }}!</strong> 你的用户名或者密码可能有误!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="username-input" placeholder="用户名" v-model="body.username">
        <label>用户名</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="password-input" placeholder="密码" v-model="body.password">
        <label>密码</label>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "../components/boostrap/Modal";
import axios from "axios";

export default {
  name: "Login",
  components: {Modal},
  data() {
    return {
      loginViewStyleObj: {
        height: document.documentElement.clientHeight + "px"
      },
      body: {
        username: '',
        password: ''
      },
      showAlert: false
    }
  },
  methods: {
    submit() {
      if (this.body.username.length == 0 || this.body.password.length == 0) {
        this.showAlert = true
        this.$refs.loginModal.reset();
        return
      }
      this.$http.post(this.$urls.auth.login, this.body)
        .then(response => {
            let token = response.data.data
            this.getUser(token);
            this.$refs.loginModal.showDirect()
            localStorage.setItem('token', token);
            location.href = '/#/'
            location.reload();
          }
        )
        .catch(error => {
            console.warn('登录失败: ', error)
            this.showAlert = true
            this.$refs.loginModal.reset()
          }
        )
    },
    getUser(token) {
      this.$http.defaults.headers.common['token'] = token;
      this.$http.get(this.$urls.users.myself)
        .then(response => {
            let profile = response.data.data;
            localStorage.setItem('user', JSON.stringify(profile));
            this.$store.commit('updateCurUser', profile);
          }
        );
    },
    showLoginModal() {
      this.$refs.loginModal.toggle()
    },
    redirectQQLogin() {
      window.location.href = this.$urls.auth.qqLogin;
    }
  }
}
</script>

<style scoped>

#login-view {
  background-image: url("../assets/game-center-bg-night.jpg");
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
