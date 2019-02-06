<template>
  <div>
    <!--<div class="hand">-->
      <!--<div class="card suitdiamonds">-->
        <!--<p>3</p>-->
      <!--</div>-->

      <!--<div class="card suithearts" style="margin-left: -110px">-->
        <!--<p>A</p>-->
      <!--</div>-->

      <!--<div class="card suitclubs" style="margin-left: -110px;">-->
        <!--<p>2</p>-->
      <!--</div>-->

      <!--<div class="card suitspades" style="margin-left: -110px;">-->
        <!--<p>5</p>-->
      <!--</div>-->
    <!--</div>-->

    <!--叫分按钮-->
    <div style="margin-top: 100px;display: flex;justify-content: center" v-show="showBidBtn">
      <button @click="bid(0)">不叫</button>
      <button @click="bid(1)">1分</button>
      <button @click="bid(2)">2分</button>
      <button @clikc="bid(3)">3分</button>
    </div>

    <div style="margin-top: 20px;">
      <!--<button @click="playCard" v-show="showPlayBtn">出牌</button>-->
      <button @click="playCard">出牌</button>
      <button @click="pass">要不起</button>
    </div>

    <div class="hand">
      <div class="card"
           v-for="(card, index) in myCardList"
           v-bind:style="{backgroundColor: cardBackground(index) }"
           v-bind:class="{overlapping: isOverlapping(index),
           suitspades: typeClass(card, 'SPADE'), suitclubs: typeClass(card, 'CLUB'),
           suithearts: typeClass(card, 'HEART'), suitdiamonds: typeClass(card, 'DIAMOND')}"
           @click="selectCard(index)">
        <p>{{ card.numberValue | cardNumberFilter }}</p>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "TableBoard",
    data() {
      return {
        myCardList: [],
        selectCardList: [],

        showPlayBtn: false,
        showBidBtn: false,
      }
    },
    methods: {
      isOverlapping(index) {
        return index != 0;
      },
      typeClass(card, type) {
        return card.type === type;
      },
      cardBackground(index) {
        for (let i = 0; i < this.selectCardList.length; i++) {
          if (this.selectCardList[i] == index) {
            return '#D3D3D3'
          }
        }
        return '';
      },
      showBid() { this.showBidBtn = true },
      showPlay() { this.showPlayBtn = true },
      getMyCards() {
        this.$http.get(this.$urls.game.myCards).then(
          response => {
            this.myCardList = response.data.data;
        }).catch(
          error => alert(error.response.data.message)
        )
      },
      /**
       * 玩家叫牌
       * @param score 叫牌的分数
       */
      bid(score) {
        let body = {want: score === 0 ? false : true, score: score}
        console.log(body);
        this.$http.post(this.$urls.game.bid, body).then(
          response => {
            this.showBidBtn = false;
          }
        ).catch(
          error => this.showBidBtn = false
        );
      },
      /**
       * 玩家点击牌处理逻辑
       */
      selectCard(index) {
        let i = this.selectCardList.indexOf(index);
        if (i != -1) { // 该牌已选中
          this.selectCardList.splice(i, 1);
        } else {
          this.selectCardList.push(index);
        }
      },
      /**
       * 出牌
       */
      playCard() {
        let index = 0;
        let body = [];
        for (let i = 0; i <this.myCardList.length; i++) {
          if (this.selectCardList[index] === i) {
            body.push(this.myCardList[i]);
            index++;
          }
        }
        this.$http.post(this.$urls.game.play, body).then(
          response => {
            this.showPlayBtn = false;
            this.selectCardList.clear();
            this.getMyCards();
          }
        ).catch(
          error => alert(error.response.data.message)
        );
      },
      pass() {
        this.$http.post(this.$urls.game.pass).then(
          response => {
            console.log(response.data.data);
            this.showPlayBtn = false;
            this.selectCardList.clear();
          }
        ).catch(
          error => alert(error.response.data.message)
        )
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
    },
    created() {

    }
  }
</script>

<style scoped>
  @import "../../static/css/card.css";
</style>
