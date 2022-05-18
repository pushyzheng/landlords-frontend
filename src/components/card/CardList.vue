<template>
  <div class="card-list">
    <Card v-for="card in data"
          :data="card"/>
  </div>
</template>

<script>
import Card from "./Card";

export default {
  name: "CardList",
  components: {Card},
  props: ['data'],
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.card-list {
  display: flex;
}
</style>
