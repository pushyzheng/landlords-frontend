<script src="../../pcomy/pcomy-vue/src/store/index.js"></script>
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      if (localStorage.getItem('token') != null) {
        this.$http.get(this.$urls.users.myself).then(
          response => {
            this.$store.commit('updateCurUser', response.data.data);
          }
        ).catch(
          // error => alert(error.response.data.message)
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
    color: #2c3e50;
  }
</style>
