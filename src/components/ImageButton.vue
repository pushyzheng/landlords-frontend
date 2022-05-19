<template>
  <div class="image-button" @click="onClick">
    <img :src="url" alt="" style="cursor: pointer"
         :width="width + 'rem'">
    <div id="image-button-text">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageButton",
  props: {
    width: {
      default: 100
    },
    url: {}
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.image-button {
  cursor: pointer;
  position: relative;
  text-align: center;
  color: white;
}

.image-button:active {
  transform: translateY(4px);
}

#image-button-text {
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bolder;
  font-size: 1.2rem;
}
</style>
