<template>
  <div id="login-view" v-bind:style="loginViewStyleObj">
    <img src="../assets/qq-connect.png"
         style="border-radius: 50px;"
         @click="redirectQQLogin"
         alt="qq">

    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
            data-bs-whatever="@mdo">
      账号密码登录
    </button>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <img src="../assets/poker.png" style="width: 200px;">
          </div>
          <div class="modal-body">
            <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="showAlert">
              <strong>Hello {{ username }}!</strong> 你的用户名或者密码可能有误!
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="username-input" placeholder="用户名" v-model="username">
              <label>用户名</label>
            </div>
            <div class="form-floating">
              <input type="password" class="form-control" id="password-input" placeholder="密码" v-model="password">
              <label>密码</label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-lg" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary btn-lg" id="submit-btn"
                    @click="submit"
                    v-bind:class="{ 'btn-primary': submitBtn.isPrimary,'btn-success': submitBtn.isSuccess,
                    disabled: submitBtn.isDisabled }">
              {{ submitBtn.text }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginViewStyleObj: {
        height: document.documentElement.clientHeight + "px"
      },
      username: '',
      password: '',
      showAlert: false,
      submitBtn: {
        text: '登录',
        isDisabled: false,
        isSuccess: false,
        isPrimary: true
      }
    }
  },
  methods: {
    submit() {
      this.submitBtn.isDisabled = true;
      this.submitBtn.text = 'Loading';
      let body = {
        username: this.username,
        password: this.password
      };
      this.$http.post(this.$urls.auth.login, body)
        .then(response => {
            // this.getUser();
            this.submitBtn.isSuccess = true;
            this.submitBtn.text = '跳转中...'
            localStorage.setItem('token', response.data.data);
            location.href = '/#/'
            location.reload();
          }
        )
        .catch(error => {
            console.warn('登录失败: ', error)
            this.showAlert = true
            this.submitBtn.isDisabled = false
            this.submitBtn.text = '登录'
          }
        )
    },
    getUser() {
      this.$http.get(this.$urls.users.myself).then(
        response => {
          localStorage.setItem('user', JSON.stringify(response.data.data));
        }
      );
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

.modal-header {
  justify-content: center !important;
}

</style>
