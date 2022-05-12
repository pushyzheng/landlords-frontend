<template>
  <div id="table-board-component">
    <!--叫分按钮-->
    <div id="bid-operation" v-show="showBidBtn">
      <mu-button @click="bid(0)" class="bid-button" color="primary">不叫</mu-button>
      <mu-button @click="bid(1)" class="bid-button">1分</mu-button>
      <mu-button @click="bid(2)" class="bid-button">2分</mu-button>
      <mu-button @click="bid(3)" class="bid-button">3分</mu-button>
    </div>

    <!--出牌和不出按钮-->
    <div id="play-operation" v-show="showPlayBtn">
      <mu-button @click="pass" v-show="showPassbtn" color="error" round>不出</mu-button>
      <mu-button @click="playCard" color="primary" round style="margin-left: 20px;">出牌</mu-button>
    </div>

    <!--当前玩家的牌-->
    <div id="my-card">
      <div class="hand">
        <div class="card"
             v-for="(card, index) in myCardList"
             v-bind:class="{overlapping: isOverlapping(index),
           suitspades: typeClass(card, 'SPADE'), suitclubs: typeClass(card, 'CLUB'),
           suithearts: typeClass(card, 'HEART'), suitdiamonds: typeClass(card, 'DIAMOND'),
           selected: isSelected(index), bigjoker:  isBigJoker(card), smalljoker: isSmallJoker(card)}"
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
        dealInterval: null,

        cards: [],             // 用来填充手中牌的数据
        myCardList: [],        // 当前手中牌对应的数据列表
        simulationIndex: 0,
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
      isSelected(index) {
        for (let i = 0; i < this.selectCardList.length; i++) {
          if (this.selectCardList[i] == index) {
            return true
          }
        }
        return false;
      },
      typeClass(card, type) {
        return card.type === type;
      },
      isBigJoker(card) {
        return card.type === 'BIG_JOKER';
      },
      isSmallJoker(card) {
        return card.type === 'SMALL_JOKER';
      },
      showBid() { this.showBidBtn = true },
      showPlay() { this.showPlayBtn = true },
      /**
       * 分牌，模拟发牌的过程
       */
      distributeCard() {
        this.$http.get(this.$urls.player.myCards).then(
          response => {
            this.cards = response.data.data;
            this.$emit('distributeCard');
            // 模拟发牌的动画，通过一个Interval函数来执行
            this.dealInterval = setInterval(this.dealIntervalMethod, 220);
          }).catch(
          error => alert(error.response.data.message)
        )
      },
      /**
       * 获取手中的牌
       * @isDealing 是否是发牌的过程，如果是发牌的过程，
       */
      getMyCards() {
        this.$http.get(this.$urls.player.myCards).then(
          response => {
            this.myCardList = response.data.data;
        }).catch(
          error => alert(error.response.data.message)
        )
      },
      dealIntervalMethod() {
        if (this.simulationIndex == this.cards.length) {  // 发牌结束
          clearInterval(this.dealInterval);
          this.simulationIndex = 0;
        } else {
          this.myCardList.push(this.cards[this.simulationIndex]);
          this.simulationIndex++;
        }
      },
      /**
       * 玩家叫牌
       * @param score 叫牌的分数
       */
      bid(score) {
        let body = {want: score === 0 ? false : true, score: score}
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
          response => { this.showPassbtn = response.data.data }
        ).catch(
          error => alert(error.response.data.message)
        )
      },
      getCanBid() {
        this.$http.get(this.$urls.player.canBid).then(
          response => { this.showBidBtn = response.data.data }
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
          // this.getMyCards();
          this.getPlayerRound();
          this.getCanPass();
          this.getCanBid();
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
    margin-right: 20px;
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

  @media screen and (max-width:840px) {

    .bid-button {
      margin-right: 10px;
    }

  }

</style>
