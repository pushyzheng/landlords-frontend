<template>
  <img alt="user-avatar" class="round-avatar"
       :src="url"
       v-bind:style="{width: width}">
</template>

<script>
export default {
  name: "Avatar",
  props: {
    url: {},
    width: {default: '60px'}
  }
}
</script>

<style scoped>
.round-avatar {
  border-radius: 50px;
  width: 60px;
}

@media screen and (max-width: 840px) {
  .round-avatar {
    width: 45px;
  }
}
</style>
