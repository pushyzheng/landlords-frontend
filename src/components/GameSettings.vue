<template>
  <div id="game-settings">
    <div class="offcanvas offcanvas-end" tabindex="-1"
         id="offcanvasGameSettings" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 id="offcanvasRightLabel">游戏设置</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div id="music-settings">
          <h5>音乐设置</h5>
          <slot/>
        </div>
        <div id="table-background-settings">
          <h5>棋桌背景</h5>
          <div class="table-background-item"
               v-for="(img,idx) in tableBackgroundImages">
            <img :src="img" alt="" class="table-background-image"
                 @click="onImageSelected(idx)">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameSettings",
  data() {
    return {
      tableBackgroundImages: this.$images.getTableBackgroundImages()
    }
  },
  methods: {
    onImageSelected(idx) {
      localStorage.setItem('selectedTableBackgroundImage', idx)
      this.$emit('tableBackgroundChanged', this.tableBackgroundImages[idx])
    }
  }
}
</script>

<style scoped>
#music-settings {
  margin-bottom: 2rem;
}

.table-background-item {
  margin-bottom: 2rem;
}

.table-background-image {
  width: 100%;
}
</style>
