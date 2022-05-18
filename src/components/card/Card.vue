<template>
  <div>
    <div class="card"
         v-bind:class="cardClassObj">
      <p>{{ data.numberValue | cardNumberFilter }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    data: {}
  },
  data() {
    return {
      cardClassObj: {
        suitspades: this.data.type == 'SPADE',
        suitclubs: this.data.type == 'CLUB',
        suithearts: this.data.type == 'HEART',
        suitdiamonds: this.data.type == 'DIAMOND',
        bigjoker: this.data.type == 'BIG_JOKER',
        smalljoker: this.data.type == 'SMALL_JOKER'
      }
    }
  },
  methods: {
    onSelected() {
      this.$emit('select', this.data)
    }
  },
  filters: {
    cardNumberFilter(value) {
      if (value == 1) return 'A';
      else if (value == 11) return 'J';
      else if (value == 12) return 'Q';
      else if (value == 13) return 'K';
      else if (value == 14 || value == 15) return '王'
      else return value;
    }
  }
}
</script>

<style scoped>

</style>
