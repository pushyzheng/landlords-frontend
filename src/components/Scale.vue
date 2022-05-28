<template>
  <div class="scale-component" v-bind:style="{height: height+'px'}">
    <div class="scale-component-cont" ref="scaleBox"
         v-bind:style="{transform: transform, transformOrigin: origin+' top'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "scale",
  props: {
    value: {
      default: 1
    },
    origin: {
      default: 'left'
    }
  },
  data() {
    return {
      width: 0,
      height: 0,
      transform: "scale(1)"
    }
  },
  mounted() {
    let boundClient = this.$refs.scaleBox.getBoundingClientRect();
    this.transform = `scale(${this.value})`;
    this.width = boundClient.width * this.value;
    this.height = boundClient.height * this.value;
  }
}
</script>

<style scoped>

</style>
