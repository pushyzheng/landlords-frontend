<template>
  <div id="table-board-component">
    <!--叫分按钮-->
    <div id="bid-operation" v-show="showBidBtn">
      <button @click="bid(0)" class="bid-button">不叫</button>
      <button @click="bid(1)" class="bid-button">1分</button>
      <button @click="bid(2)" class="bid-button">2分</button>
      <button @click="bid(3)" class="bid-button">3分</button>
    </div>

    <!--出牌和不出按钮-->
    <div id="play-operation" v-show="showPlayBtn">
      <mu-button @click="playCard" color="primary" round style="margin-right: 20px;">出牌</mu-button>
      <mu-button @click="pass" v-show="showPassbtn" color="error" round>不出</mu-button>
    </div>

    <!--当前玩家的牌-->
    <div id="my-card">
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

  </div>
</template>

<script>
  import PlayerCardList from "./PlayerCardList";
  export default {
    name: "TableBoard",
    components: {PlayerCardList},
    data() {
      return {
        myCardList: [],
        selectCardList: [],

        showPlayBtn: false,
        showBidBtn: false,
        showPassbtn: false
      }
    },
    props: ['room'],
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
        this.$http.get(this.$urls.player.myCards).then(
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
        this.$emit('selectCard');  // 发射selectCard信号让父组件接收
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
        this.selectCardList.sort(this.sortNumber);  // 对选择列表先进行排序
        for (let i = 0; i < this.myCardList.length; i++) {
          if (this.selectCardList[index] == i) {
            body.push(this.myCardList[i]);
            index++;
          }
        }
        this.$http.post(this.$urls.game.play, body).then(
          response => {
            this.showPlayBtn = false;
            this.selectCardList = [];
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
            this.selectCardList = [];
          }
        ).catch(
          error => alert(error.response.data.message)
        )
      },
      /**
       * 查询是否为当前玩家出牌回合
       */
      getPlayerRound() {
        this.$http.get(this.$urls.player.isPlayerRound).then(
          response => {
            this.showPlayBtn = response.data.data;
          }
        ).catch(
          error => alert(error.response.data.message)
        )
      },
      getCanPass() {
        this.$http.get(this.$urls.player.canPass).then(
          response => {
            this.showPassbtn = response.data.data;
          }
        ).catch(
          error => alert(error.response.data.message)
        )
      },
      sortNumber(a, b) {
        return a - b;
      },
      /**
       * 一局游戏结束之后显示的
       */
      gameEndListener() {
        this.myCardList = [];
        this.otherPlayCardList = [];
        this.selectCardList = [];
        this.showPlayBtn = false,
        this.showBidBtn = false,
        this.showPassbtn = false
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
    watch: {
      room(roomObj) {
        if (this.room.status === this.$enums.roomStatus.playing) {
          // 如果当前游戏的状态为游戏中，则调用TableBoard组件的方法，获取卡牌
          this.getMyCards();
          this.getPlayerRound();
          this.getCanPass();
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped>
  @import "../../static/css/card.css";

  #my-card {
    display: flex;
    justify-content: center;
  }

  .operation-button {
    padding: 10px 20px;
  }

  .bid-button {
    width: 50px;
    height: 25px;
    margin-right: 5px;
  }

  #bid-operation {
    display: flex;
    justify-content: center;
    margin-top: 100px;
  }

  #play-operation {
    display: flex;
    justify-content: center;
  }

  #my-card {
    margin-top: 20px;
  }

</style>
