<template>
  <div style="text-align: center">
    <h3>认证跳转中 ...</h3>
  </div>
</template>

<script>
  export default {
    created () {
      let token = this.$route.params.token;
      localStorage.setItem('token', token)
      location.href = '/#/'
      location.reload();
    }
  }
</script>

<style scoped>

</style>
