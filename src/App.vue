<template>
  <div id="app">
    <router-view v-if="isLandscape"/>
    <verticle-tip v-else/>
  </div>
</template>

<script>
import VerticleTip from "./components/VerticleTip";

export default {
  name: 'App',
  components: {VerticleTip},
  data() {
    return {
      isLandscape: true
    }
  },
  created() {
    let mql = this.$utils.matchMediaLandscape()
    mql.onchange = this.onOrientationChanged
    this.isLandscape = mql.matches

    if (localStorage.getItem('token') != null) {
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
    },
    onOrientationChanged(evt) {
      console.log(`onOrientationChanged: ${evt.matches}`)
      this.isLandscape = evt.matches
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
