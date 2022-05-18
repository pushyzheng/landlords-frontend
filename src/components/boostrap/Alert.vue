<template>
  <div v-if="show">
    <div class="alert alert-dismissible fade show" role="alert"
         v-bind:class="{ 'alert-warning': isWarning,
         'alert-danger': isDanger,
         'alert-success': isSuccess}">
      {{ text }}

      <button type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              @click="clickClose"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Alert",
  data() {
    return {
      show: false,
      isWarning: false,
      isDanger: false,
      isSuccess: false,
      text: null
    }
  },
  methods: {
    success(msg) {
      this.setDefault()
      this.isSuccess = true
      this.text = msg
    },
    warning(msg) {
      this.setDefault()
      this.isWarning = true
      this.text = msg
    },
    error(msg) {
      this.setDefault()
      this.isDanger = true
      this.text = msg
    },
    setDefault() {
      this.show = true
      this.isWarning = false
      this.isDanger = false
      this.isSuccess = false
    },
    clickClose() {
      this.show = false
      this.$emit('close');
    }
  }
}
</script>

<style scoped>

</style>
