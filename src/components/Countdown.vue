<template>
  <div>
    <h2 style="color: white" v-if="this.countdown > 0">⏰ {{ countdown }}</h2>
    <h4 style="color: white" v-else>⏰ 超时啦~</h4>
  </div>
</template>

<script>
export default {
  name: "Countdown",
  data() {
    return {
      countdown: 30,
      countInterval: null
    }
  },
  methods: {
    start(initial) {
      this.countdown = initial;
      if (this.countInterval == null) {
        this.countInterval = setInterval(this.countdownInterval, 1000)
      }
    },
    pause() {
      clearInterval(this.countInterval)
      this.countInterval = null;
    },
    countdownInterval() {
      this.countdown--;
      if (this.countdown <= 0) {
        this.pause();
      }
    }
  }
}
</script>

<style scoped>

</style>
