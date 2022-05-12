<template>
  <div id="login-view" v-bind:style="loginViewStyleObj">
    <img src="../assets/qq-connect.png" style="border-radius: 50px;" @click="redirectQQLogin">
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginViewStyleObj: {
          height: document.documentElement.clientHeight + "px"
        }
      }
    },
    methods: {
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
