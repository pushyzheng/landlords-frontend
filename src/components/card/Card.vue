<template>
  <div class="card unselectable" @click="onSelected"
       v-bind:class="cardClassObj">
      <span v-if="isBigJoker(data)">
        <img src="static/images/card/big-joker.png" alt="" class="joker">
      </span>
    <span v-if="isSmallJoker(data)">
            <img src="static/images/card/small-joker.png" alt="" class="joker">
      </span>
    <p v-if="!isBigJoker(data) && !isSmallJoker(data)">
      {{ data.numberValue | cardNumberFilter }}
    </p>

    <!--选择牌音效-->
    <audio id="select-audio">
      <source src="https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/Special/SpecSelectCard.mp3" type="audio/mp3"/>
    </audio>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    data: {},
    audio: {
      default: false
    }
  },
  data() {
    return {
      audioElement: null
    }
  },
  computed: {
    cardClassObj() {
      return {
        suitspades: this.data.type == 'SPADE',
        suitclubs: this.data.type == 'CLUB',
        suithearts: this.data.type == 'HEART',
        suitdiamonds: this.data.type == 'DIAMOND',
      }
    }
  },
  methods: {
    isBigJoker(card) {
      return this.data.type === 'BIG_JOKER';
    },
    isSmallJoker(card) {
      return this.data.type === 'SMALL_JOKER';
    },
    onSelected() {
      this.$emit('select', this.data)
      if (this.audio) {
        this.audioElement.play();
      }
    }
  },
  filters: {
    cardNumberFilter(value) {
      if (value == 1) return 'A';
      else if (value == 11) return 'J';
      else if (value == 12) return 'Q';
      else if (value == 13) return 'K';
      else return value;
    }
  },
  mounted() {
    this.audioElement = document.getElementById('select-audio')
  }
}
</script>

<style scoped>
@import "../../../static/css/card-component.css";

</style>
