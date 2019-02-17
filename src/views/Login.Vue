<template>
  <div id="login-view">
    <input type="text" v-model="username"> <br><br>
    <input type="text" v-model="password"> <br><br>
    <button @click="submit">登录</button>
    <button @click="redirectQQLogin">QQ登录</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: '123'
    }
  },
  methods: {
    submit () {
      this.$http.post(this.$urls.auth.login, {
        username: this.username,
        password: this.password
      }).then(
        response => {
          this.getUser();
          localStorage.setItem('token', response.data.data);
          alert('登录成功');
          location.href = '/#/'
          location.reload();
        }
      ).catch(
        error => alert(error.response.data.message)
      )
    },
    getUser() {
      this.$http.get(this.$urls.users.me).then(
        response => {
          localStorage.setItem('user', JSON.stringify(response.data.data));
        }
      );
    },
    redirectQQLogin() {
      window.location.href = this.$urls.auth.qqLogin;
    }
  },
  created() {
    if (localStorage.getItem('token') != null) {
      this.$router.push({name: 'GameCenter'})
    }
  }
}
</script>

<style scoped>

</style>
