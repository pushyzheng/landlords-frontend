<template>
  <div id="test-view">
   <mu-flex class="flex-demo" justify-content="center" align-items="center" v-bind:style="styleObj">
     <mu-button color="primary" large round>准备</mu-button>
     <mu-button color="error" large round>退出房间</mu-button>
   </mu-flex>
  </div>
</template>

<script>
  export default {
    name: "Test",
    data() {
      return {
        styleObj: {
          height: document.documentElement.clientHeight + 'px'
        }
      }
    }
  }
</script>

<style scoped>

</style>
