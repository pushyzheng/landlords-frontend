<template>
  <div class="card-list" v-bind:style="{'transform': `scale(${scale})`}">
    <Card v-for="(card, idx) in data"
          :audio="audio"
          v-bind:style="{'margin-left': getOverlappingValue(idx)}"
          v-bind:class="{'selected': isSelected(idx)}"
          @select="onSelected($event, idx)"
          :data="card"/>
  </div>
</template>

<script>
import Card from "./Card";

export default {
  name: "CardList",
  components: {Card},
  props: {
    data: {},
    // 选中牌时是否有声音
    audio: {default: false},
    // 是否需要折叠
    overlapping: {default: true},
    // 缩放大小值
    scale: {default: 1},
    // 是否可选择
    selectable: {default: false}
  },
  data() {
    return {selected: []}
  },
  methods: {
    /**
     * 控制牌折叠时的间距大小
     */
    getOverlappingValue(idx) {
      if (!this.overlapping || idx == 0) {  // 首张牌不要折叠
        return 0
      }
      let base;
      if (this.$utils.isPhone()) {
        base = 2.8  // Phone
      } else {
        base = 5  // PC
      }
      return (-base) + 'rem';
    },
    isSelected(idx) {
      return this.selectable && this.selected.indexOf(idx) != -1;
    },
    onSelected(evt, idx) {
      if (!this.selectable) {
        return
      }
      let i = this.selected.indexOf(idx);
      if (i != -1) { // 该牌已选中
        this.selected.splice(i, 1);
      } else {
        this.selected.push(idx);
      }
      this.$emit('select', idx, this.selected)
    },
    getSelected() {
      return this.selected;
    },
    resetSelected() {
      this.selected = []
    }
  }
}
</script>

<style scoped>
.card-list {
  display: flex;
}
</style>
