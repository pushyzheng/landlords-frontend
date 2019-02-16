<template>
  <div class="hand">
    <div class="card"
         v-for="(card, index) in cards"
         v-bind:class="{overlapping: isOverlapping(index),
           suitspades: typeClass(card, 'SPADE'), suitclubs: typeClass(card, 'CLUB'),
           suithearts: typeClass(card, 'HEART'), suitdiamonds: typeClass(card, 'DIAMOND')}">
      <p>{{ card.numberValue | cardNumberFilter }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CardList",
    props: ['cards'],
    methods: {
      isOverlapping(index) {
        return index != 0;
      },
      typeClass(card, type) {
        return card.type === type;
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
  @import "../../static/css/player-card.css";
</style>
