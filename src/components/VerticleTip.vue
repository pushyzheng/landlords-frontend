<template>
  <div class="verticle-tip" v-bind:style="verticleTipStyleObj">
    <div>
      <div style="display: flex;justify-content: center;align-items: center">
        <img src="../assets/vertical-tip-image.png" style="width: 100px;">
      </div>
      <h2>为了更好的体验，请使用横屏浏览</h2>
    </div>
  </div>
</template>

<script>
  export default {
    name: "VerticleTip",
    data() {
      return {
        verticleTipStyleObj: {
          height: document.documentElement.clientHeight + 'px'
        }
      }
    }
  }
</script>

<style scoped>
  .verticle-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    color: white;
  }
</style>
