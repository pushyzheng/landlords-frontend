<template>
  <div>
    <div class="alert alert-dismissible fade show" role="alert"
         v-bind:class="{ 'alert-warning': isWarning,'alert-danger': isDanger }">
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
      isWarning: true,
      isDanger: false
    }
  },
  props: {
    text: {
      default: 'You should check in on some of those fields below'
    },
    type: {
      default: 'warning'
    }
  },
  created() {
    if (this.type == 'warning') {
      this.isDanger = false;
      this.isWarning = true;
    } else if (this.type == 'danger') {
      this.isDanger = true;
      this.isWarning = false;
    } else {
      console.error("The type is illegal: " + this.type)
    }
  },
  methods: {
    clickClose() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>

</style>
