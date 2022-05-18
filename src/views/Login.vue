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
      <alert ref="alert"/>

      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="username-input" placeholder="用户名" v-model="body.username">
        <label>用户名</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="password-input" placeholder="密码" v-model="body.password">
        <label>密码</label>
      </div>
    </Modal>

    <div id="system-setting-btn" @click="openSystemSettings">
      系统设置
    </div>

    <system-settings ref="systemSettings"/>
  </div>
</template>

<script>
import Modal from "../components/boostrap/Modal";
import Alert from "../components/boostrap/Alert";
import SystemSettings from "../components/SystemSettings";

export default {
  name: "Login",
  components: {Alert, SystemSettings, Modal},
  data() {
    return {
      loginViewStyleObj: {
        height: document.documentElement.clientHeight + "px"
      },
      body: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    submit() {
      if (this.$utils.isEmpty(this.body.username)
        || this.$utils.isEmpty(this.body.password)) {
        this.$refs.alert.warning('用户名密码不能为空!')
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
            this.$refs.alert.error('你的用户名或者密码可能有误!')
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
    },
    openSystemSettings() {
      this.$refs.systemSettings.show();
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

#system-setting-btn {
  color: white;
  position: fixed;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
