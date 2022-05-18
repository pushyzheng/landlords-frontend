<template>
  <div class="verticle-tip" v-bind:style="verticleTipStyleObj">
    <div>
      <div style="display: flex;justify-content: center;align-items: center">
        <img src="../assets/vertical-tip-image.png" style="width: 100px;" alt="vertical-tips">
      </div>
      <div id="verticle-tip-text">
        <h2>为了更好游戏体验</h2>
        <h2>请将手机横屏访问</h2>
      </div>
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
  z-index: 9999;
}

#verticle-tip-text {
  margin-top: 1rem;
}
</style>
