<template>
  <img :src="url" alt="user-avatar" class="round-avatar">
</template>

<script>
  export default {
    name: "Avatar",
    props: ['url']
  }
</script>

<style scoped>
  .round-avatar {
    border-radius: 50px;
    width: 60px;
  }
</style>
