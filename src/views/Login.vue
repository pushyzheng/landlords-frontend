<template>
  <div id="login-view">
    <div id="login-btn-group">
      <image-button width="200" url="static/images/login-btn-blue.png" id="qq-login-btn"
                    @click="redirectQQLogin">
        QQ 登录
      </image-button>

      <image-button width="200" url="static/images/login-btn-yellow.png"
                    @click="showLoginModal">
        <span style="color: dimgray">账号登录</span>
      </image-button>
    </div>

    <!-- 账号密码登录 Modal -->
    <Modal header-img="/static/images/login-modal-header.png" ref="loginModal" @submit="submit">
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

    <!-- 系统设置按钮及组件 -->
    <image-button url="/static/images/settings.png" width="30" id="system-setting-btn"
                  @click="openSystemSettings"/>
    <system-settings ref="systemSettings"/>
  </div>
</template>

<script>
import Modal from "../components/boostrap/Modal";
import Alert from "../components/boostrap/Alert";
import SystemSettings from "../components/SystemSettings";
import ImageButton from "../components/ImageButton";

export default {
  name: "Login",
  components: {Alert, SystemSettings, Modal, ImageButton},
  data() {
    return {
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
  /*background-image: url("../assets/welcome-screen.jpg");*/
  background-image: url("https://static.pushyzheng.com/0ee16ae326542d7998579db7f6b70cdd.jpg");
  background-size: cover;
  height: 100vh;
}

#login-btn-group {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 20vh;
}

#qq-login-btn {
  margin-right: 1rem;
}

#system-setting-btn {
  color: dimgray;
  font-weight: bolder;
  position: fixed;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
