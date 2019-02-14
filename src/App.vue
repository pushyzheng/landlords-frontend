<template>
  <div id="app">
    <!--<div>-->
      <!--当前登录用户：<span>{{ name }}</span>-->
      <!--<img :src="avatar" style="width: 50px;">-->
    <!--</div>-->
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        name: null,
        avatar: null
      }
    },
    created() {
      if (localStorage.getItem('token') != null) {
        this.$http.get(this.$urls.users.myself).then(
          response => {
            let data = response.data.data;
            this.name = data.username;
            this.avatar = data.avatar;
          }
        ).catch(
          error => alert(error.response.data.message)
        )
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    /*margin-top: 60px;*/
  }
</style>
