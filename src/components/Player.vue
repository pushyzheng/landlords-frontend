<template>
  <div class="player-component">
    <popover :name="isLeft ? 'popover-left': 'popover-right'" event="hover" widht="15rem">
      <PlayerInfo :player="player"/>
    </popover>

    <div style="display: flex" v-bind:style="{'flex-direction': direction}" v-if="canShow">
      <!-- 玩家的个人信息 -->
      <div class="player-info">
        <div v-bind:class="{'rorate-180': needsRotate180}">
          <div v-if="isLeft">
            <Avatar :url="getAvatar" :width="playerAvatarWidth" v-popover:popover-left.right/>
          </div>
          <div v-else>
            <Avatar :url="getAvatar" :width="playerAvatarWidth" v-popover:popover-right.left/>
          </div>
        </div>
        <div class="player-username">{{ player.user.username }}</div>
      </div>
      <div v-if="gamePreparing && player.ready">
        <img src="static/images/ready.png" alt="ready"
             style="width: 70px" v-bind:class="{'rorate-180': needsRotate180}">
      </div>
      <!-- 玩家出的牌 -->
      <div v-bind:class="playStateClass">
        <div class="player-recent-cards">
          <CardList :cards="player.recentCards"/>
        </div>
      </div>
      <div class="player-countdown">
        <Countdown style="margin-right: 30px;" v-if="showCountDown" ref="coutndown"/>
      </div>
    </div>

    <!-- 显示剩余牌 -->
    <div class="remaining-cards"
         v-if="canShowRemainingCards"
         v-bind:style="{'flex-direction': direction}">
      <img src="static/images/pokerback.jpeg" alt="" style="width: 30px;" class="remaining-cards-item">
      <img src="static/images/pokerback.jpeg" alt=""
           class="remaining-cards-item remaining-cards-overlapping"
           v-for="unused in player.cardSize">
      <span class="remaining-cards-size">{{ player.cardSize }}</span>
    </div>
  </div>
</template>

<script>
import Avatar from "./Avatar";
import CardList from "./PlayerCardList";
import Countdown from "./Countdown";
import PlayerInfo from "./PlayerInfo";

const DIRECTION_ROW = "row"
const DIRECTION_ROW_REVERSE = "row-reverse"

export default {
  name: "Player",
  components: {Avatar, CardList, Countdown, PlayerInfo},
  props: {
    /**
     * 控制水平布局的方向, 即左右两边的玩家正好相反
     */
    direction: {
      default: DIRECTION_ROW
    },
    player: {},
    showCountDown: {
      default: false
    },
    /**
     * 是否游戏中
     */
    gamePreparing: {}
  },
  data() {
    return {playerAvatarWidth: '100px'}
  },
  computed: {
    isLeft() {
      return this.direction == DIRECTION_ROW
    },
    getAvatar() {
      return this.$images.getPlayerAvatar(this.player)
    },
    canShow() {
      return this.player != null && this.player.user != undefined
    },
    canShowRemainingCards() {
      return this.player != null && this.player.cardSize != null && this.player.cardSize != 0
    },
    needsRotate180() {
      if (this.player == null || this.player.identity == undefined) {
        return false
      }
      if (this.player.identity == this.$enums.identity.landlord) { // 地主选的头像正好是相反的
        return this.direction == DIRECTION_ROW
      } else {
        return this.direction == DIRECTION_ROW_REVERSE
      }
    },
    playStateClass() {
      return {
        'player-state-left': this.direction == DIRECTION_ROW,
        'player-state-right': this.direction == DIRECTION_ROW_REVERSE
      }
    }
  },
  methods: {
    startCountdown(num) {
      setTimeout(() => this.$refs.coutndown.start(num), 100)
    }
  }
}
</script>

<style scoped>
.player-component {

}

.player-username {
  color: white;
  font-weight: bolder;
  font-size: 1.5rem;
  text-align: center;
}

.player-state-left {
  margin-left: 20px;
  margin-right: 15px;
}

.player-state-right {
  margin-right: 20px;
  margin-left: 15px;
}

.player-countdown {
  display: flex;
  align-items: center;
}

.remaining-cards {
  margin-top: 1rem;
}

.remaining-cards-item {
  width: 30px;
}

.remaining-cards-overlapping {
  margin-left: -20px;
}

.remaining-cards-size {
  color: white;
  font-size: 1.5rem;
  font-weight: bolder;
}

.rorate-180 {
  transform: rotateY(180deg)
}
</style>
