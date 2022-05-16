<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    if (localStorage.getItem('token') == null) {
      this.$router.push({name: 'Login'})
    } else {
      this.getUserInfo();
    }
  },
  methods: {
    getUserInfo() {
      this.$http.get(this.$urls.users.myself)
        .then(response => {
          this.$store.commit('updateCurUser', response.data.data);
        })
        .catch(error => {
          if (error.message === 'Network Error') {
            this.$router.push({name: 'ServerError'})
          }
          console.log(error.response)
        })
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
