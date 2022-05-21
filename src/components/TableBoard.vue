<template>
  <div id="table-board-component">
    <!--叫分按钮-->
    <div id="bid-operation" v-show="showBidBtn">
      <div class="btn-group btn-group-lg" role="group" aria-label="Basic radio toggle button group">
        <button type="button" class="btn btn-secondary" @click="bid(0)">不叫</button>
        <button type="button" class="btn btn-danger" @click="bid(1)">1 分</button>
        <button type="button" class="btn btn-danger" @click="bid(2)">2 分</button>
        <button type="button" class="btn btn-danger" @click="bid(3)">3 分</button>
      </div>
    </div>

    <!--出牌和不出按钮-->
    <div id="play-operation" v-show="showPlayBtn" class="position-absolute top-50 start-50 translate-middle">
      <div>
        <div style="display: flex;justify-content: center;margin-bottom: 10px;">
          <Countdown ref="countdown"/>
        </div>
        <div style="display: flex;justify-content: center">
          <button type="button" class="btn btn-secondary" style="margin-right: 2rem;" @click="pass"
                  v-show="showPassbtn">
            不出
          </button>
          <button type="button" class="btn btn-danger" @click="playCard">
            出牌
          </button>
        </div>
      </div>
    </div>

    <!--当前玩家的牌-->
    <div id="my-card" class="position-absolute bottom-0 start-50 translate-middle-x">
      <card-list ref="cardList"
                 :audio="true"
                 :data="myCardList" selectable="true"/>
    </div>

    <!--发牌音效-->
    <audio id="deal-audio" src="https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/Special/Special_Dispatch.mp3"/>
  </div>
</template>

<script>
import CardList from "./card/CardList";
import Countdown from "../components/Countdown";

export default {
  name: "TableBoard",
  components: {CardList, Countdown},
  data() {
    return {
      dealInterval: null,
      dealAudioElement: null,

      cards: [],             // 用来填充手中牌的数据
      myCardList: [],        // 当前手中牌对应的数据列表
      simulationIndex: 0,

      showPlayBtn: false,
      showBidBtn: false,
      showPassbtn: false
    }
  },
  props: ['room'],
  methods: {
    showBid() {
      this.showBidBtn = true
    },
    showPlay() {
      this.showPlayBtn = true
      this.$refs.countdown.start(this.room.countdown)
    },
    /**
     * 分牌，模拟发牌的过程
     */
    distributeCard() {
      this.$http.get(this.$urls.player.myCards)
        .then(response => {
          this.cards = response.data.data;
          this.dealAudioElement.play()
          // 模拟发牌的动画，通过一个Interval函数来执行
          this.dealInterval = setInterval(this.dealIntervalMethod, 220);
        })
        .catch(error => this.$notif.warning(error.response.data.message))
    },
    /**
     * 获取手中的牌
     * @isDealing 是否是发牌的过程，如果是发牌的过程，
     */
    getMyCards() {
      this.$http.get(this.$urls.player.myCards)
        .then(response => {
          this.myCardList = response.data.data;
        })
        .catch(error => this.$notif.warning(error.response.data.message))
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
      this.$http.post(this.$urls.game.bid, body)
        .then(response => {
          this.showBidBtn = false;
        })
        .catch(error => {
          console.log(error)
          this.$notif.warning(error.response.data.message)
        });
    },
    /**
     * 出牌
     */
    playCard() {
      let index = 0;
      let body = [];
      let selected = this.$refs.cardList.getSelected();
      selected.sort(this.sortNumber);  // 对选择列表先进行排序
      for (let i = 0; i < this.myCardList.length; i++) {
        if (selected[index] == i) {
          body.push(this.myCardList[i]);
          index++;
        }
      }
      this.$http.post(this.$urls.game.play, body)
        .then(response => {
          this.showPlayBtn = false;
          this.$refs.cardList.resetSelected();
          this.getMyCards();
        })
        .catch(error => this.$notif.warning(error.response.data.message));
    },
    pass() {
      this.$http.post(this.$urls.game.pass)
        .then(response => {
          console.log(response.data.data);
          this.showPlayBtn = false;
        })
        .catch(error => this.$notif.warning(error.response.data.message))
    },
    /**
     * 查询是否为当前玩家出牌回合
     */
    getPlayerRound() {
      this.$http.get(this.$urls.player.isPlayerRound)
        .then(response => {
          if (response.data.data) {
            this.showPlay();
          }
        })
        .catch(error => this.$notif.warning(error.response.data.message))
    },
    getCanPass() {
      this.$http.get(this.$urls.player.canPass)
        .then(response => {
          this.showPassbtn = response.data.data
        })
        .catch(error => this.$notif.warning(error.response.data.message))
    },
    getCanBid() {
      this.$http.get(this.$urls.player.canBid)
        .then(response => {
          this.showBidBtn = response.data.data
        })
        .catch(error => this.$notif.warning(error.response.data.message))
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
      this.showPlayBtn = false
      this.showBidBtn = false
      this.showPassbtn = false
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
  mounted() {
    this.dealAudioElement = document.getElementById("deal-audio");
  }
}
</script>

<style scoped>
#my-card {
  display: flex;
  justify-content: center;
}

#bid-operation {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}

#play-operation {

}

@media screen and (max-width: 900px) {
}

</style>
