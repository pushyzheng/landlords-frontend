<template>
  <div id="room-view">
    <!--左下角消息通知-->
    <Toast id="chat-toast"
           :header="toast.header"
           :body="toast.body"
           :right="toast.right"
           :header-img="toast.headerImg"
           ref="chatToast"/>

    <!--游戏音效组件-->
    <GameAudio ref="gameAudio"/>

    <!-- 右上角的背景音乐开关 -->
    <div class="form-check form-switch" style="position: fixed;top: 20px;right: 20px;">
      <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
             @change="pauseBGM" v-model="bgmSwtich">
      <label class="form-check-label" for="flexSwitchCheckDefault" style="color: white">
        背景音乐
      </label>
    </div>

    <mu-flex justify-content="center">
      <TopCard :cards="room.topCards" v-if="room != null && showTopCards"/>
    </mu-flex>

    <!--其他玩家用户信息-->
    <div id="other-player-user">
      <!--上家（左边玩家）-->
      <Player :player="prevPlayer"
              :gamePreparing="gamePreparing"
              :show-count-down="countdown.prev"
              ref="prevPlayer"/>

      <!--下家（右边玩家）-->
      <Player :player="nextPlayer"
              :gamePreparing="gamePreparing"
              :show-count-down="countdown.next"
              ref="nextPlayer" direction="row-reverse"/>
    </div>

    <!--准备和退出房间操作按钮-->
    <mu-flex justify-content="center" align-items="center">
      <div v-if="userPreparing">
        <button type="button" class="btn btn-primary btn-lg" style="margin-right: 1rem;border-radius: 1.3rem"
                @click="ready" v-show="gamePreparing">
          &nbsp;&nbsp;准备&nbsp;&nbsp;
        </button>
        <button type="button" class="btn btn-danger btn-lg" style="border-radius: 1.3rem"
                @click="exitRoom" v-show="gamePreparing">
          &nbsp;退出房间&nbsp;
        </button>
      </div>
      <div v-else>
        <button type="button" class="btn btn-secondary btn-lg" style="margin-right: 1rem;border-radius: 1.3rem"
                @click="unReady" v-show="gamePreparing">
          &nbsp;&nbsp;取消准备&nbsp;&nbsp;
        </button>
      </div>
    </mu-flex>

    <!--当前玩家最近出的牌-->
    <div style="display: flex;justify-content: center;">
      <CardList :cards="curPlayer.recentCards" v-if="curPlayer != null"/>
    </div>

    <TableBoard ref="tableBoard" :room="room"
                @selectCard="selectCardListener"
                @distributeCard="distributeListener"/>

    <!--当前玩家的信息和状态栏-->
    <div id="bottom">
    </div>

    <!-- 底层边栏的组件 -->
    <bottom-bar :room="room" :gamePreparing="gamePreparing"/>

    <!--结束时显示信息的Dialog-->
    <mu-dialog :title="gameEndDialogTitle" width="450" :open.sync="gameEndDialog">
      <mu-list>
        <mu-list-item avatar button :ripple="true" v-for="result in roundResult.resList">
          <mu-list-item-title>{{ result.username }}（{{ result.identityName }}）</mu-list-item-title>
          <mu-list-item-action>
            <mu-badge :content="result.moneyChange"></mu-badge>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
      <div style="display: flex;justify-content: space-between">
        <mu-button color="error" round large @click="gameEndDialogSubmit">确定</mu-button>
        <mu-button color="primary" round large @click="continueGame">继续游戏</mu-button>
      </div>
    </mu-dialog>
  </div>
</template>

<script>
import enums from '../config/enums'
import TableBoard from "../components/TableBoard";
import Avatar from "../components/Avatar";
import CardList from "../components/PlayerCardList";
import GameAudio from "../components/GameAudio";
import VerticleTip from "../components/VerticleTip";
import TopCard from "../components/TopCard";
import Toast from "../components/boostrap/Toast";
import Countdown from "../components/Countdown";
import Player from "../components/Player";
import PlayerInfo from "../components/PlayerInfo";
import BottomBar from "../components/BottomBar";

export default {
  components: {
    Countdown, TopCard, VerticleTip, GameAudio, CardList,
    Avatar, TableBoard, Toast, Player, PlayerInfo, BottomBar
  },
  data() {
    return {
      bgmSwtich: false,
      userPreparing: false,
      gameEndDialog: false,
      showTopCards: false,
      prevPlayer: null,
      curPlayer: null,
      nextPlayer: null,

      roomId: this.$route.params.id,
      playerList: null,
      room: null,
      roundResult: {winning: false},   // 一局之后结算的分数对象
      websocket: null,
      wsTimeoutObj: null,
      toast: {
        header: '',
        body: '',
        right: '',
        headerImg: ''
      },
      chatContent: '',
      countdown: {
        prev: false,
        next: false
      }
    }
  },
  computed: {
    gamePreparing() {
      if (this.room == null) return false;
      else return this.room.status == this.$enums.roomStatus.preparing;
    },
    curUser() {
      return this.$store.state.curUser;
    },
    gameEndDialogTitle() {
      if (this.roundResult == null) return;
      if (this.roundResult.winning == true) return '恭喜你！胜利了';
      else return '很抱歉！失败了！'
    }
  },
  methods: {
    /**
     * 刷新页面和进入房间时获取房间信息数据
     */
    getRoom() {
      this.$http.get(this.$urls.rooms.getRoomById(this.$route.params.id))
        .then(response => {
          this.room = response.data.data;
          this.playerList = this.room.playerList;
          if (this.room.status === this.$enums.roomStatus.preparing) {  // 准备中
            this.getPlayerReady();
          } else if (this.room.status === this.$enums.roomStatus.playing) { // 游戏中
            if (this.room.stepNum != -1) {  // 尚未叫牌结束
              this.showTopCards = true;
            }
          }
          this.$refs.tableBoard.getMyCards();
          if (this.curPlayer == null || this.curPlayer == undefined) {
            setTimeout(this.getPrevAndNextPlayer, 100)
          }
        })
        .catch(error => {
          console.error(error)
          if (error.response != undefined) {
            if (error.response.status == 404) {
              alert('该房间不存在，将返回大厅');
            } else {
              alert('发生未知错误，返回大厅： \n' + error);
            }
            this.$router.push({name: 'GameCenter'});
          }
        });
    },
    /**
     * 刷新房间和玩家的信息
     */
    refreshRoom() {
      if (this.$route.params.id == undefined) return;
      this.$http.get(this.$urls.rooms.getRoomById(this.$route.params.id))
        .then(response => {
          this.room = response.data.data;
          this.playerList = response.data.data.playerList;
          this.getPrevAndNextPlayer();
        })
        .catch(error => alert(error));
    },
    /**
     * 退出房间
     */
    exitRoom() {
      this.$http.post(this.$urls.rooms.exit, {id: this.roomId})
        .then(response => {
          localStorage.removeItem('CURRENT_ROOM_ID');
          this.$router.push({name: 'GameCenter'});
        })
        .catch(error => alert(error.response.data.message))
    },
    /**
     * 准备
     */
    ready() {
      this.bgmSwtich = true;
      this.$refs.gameAudio.playNormalMusic();
      this.$http.post(this.$urls.game.ready, {roomId: this.roomId})
        .then(response => this.userPreparing = false)
        .catch(error => alert(error.response.data.message))
    },
    /**
     * 取消准备
     */
    unReady() {
      this.$http.post(this.$urls.game.unReady)
        .then(response => this.userPreparing = true)
        .catch(error => alert(error.response.data.message))
    },
    /**
     * 查看当前用户是否是准备状态
     */
    getPlayerReady() {
      this.$http.get(this.$urls.player.isReady)
        .then(response => this.userPreparing = !response.data.data)
        .catch(error => alert(error))
    },
    /**
     * 游戏结束
     */
    gameEnd(data) {
      this.gameEndDialog = true;
      this.roundResult = data;
      this.$refs.gameAudio.pauseNormalMusic();
      this.$refs.gameAudio.playEndMusic(data.winning);
      this.refreshRoom();
      this.$refs.tableBoard.gameEndListener();
    },
    /**
     * 计算出上家和下家的player对象
     */
    getPrevAndNextPlayer() {
      let playerList = this.room.playerList;
      let prevPlayerId = -1
      let nextPlayerId = -1;
      for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].user.id == this.curUser.id) {
          this.curPlayer = playerList[i];
          prevPlayerId = this.curPlayer.id == 1 ? 3 : this.curPlayer.id - 1;
          nextPlayerId = this.curPlayer.id == 3 ? 1 : this.curPlayer.id + 1;
          console.log(`cur: ${this.curPlayer.id}, prevPlayerId: ${prevPlayerId}, nextPlayerId: ${nextPlayerId}`)
          this.prevPlayer = playerList[prevPlayerId - 1];
          this.nextPlayer = playerList[nextPlayerId - 1];
          console.log(playerList)
          console.log(`cur: ${JSON.stringify(this.curPlayer)}, prev: ${JSON.stringify(this.prevPlayer)}, next: ${this.nextPlayer}`)
        }
      }
      let cur = this.room.stepNum % 3;
      if (cur == 0) cur = 3;

      if (cur === nextPlayerId) {
        this.countdown.next = true;
        this.countdown.prev = false;
        this.$refs.nextPlayer.startCountdown(this.room.countdown)
      } else if (cur === prevPlayerId) {
        this.countdown.next = false
        this.countdown.prev = true;
        this.$refs.prevPlayer.startCountdown(this.room.countdown)
      } else {
        this.countdown.prev = false;
        this.countdown.next = false;
      }
    },
    /**
     * 接收webSocket回调消息的函数
     */
    onWsMessage(event) {
      console.log(event.data);
      let data = JSON.parse(event.data);
      if (data.type === enums.wsType.pong) {
        this.resetWsTimeOut();
      }
      // 准备游戏消息处理
      else if (data.type === enums.wsType.unReadyGame || data.type === enums.wsType.readyGame) {
        this.refreshRoom();
      }
      // 开始游戏消息处理
      else if (data.type === enums.wsType.startGame) {
        this.$refs.tableBoard.distributeCard();
      }
      // 玩家加入或者加入
      else if (data.type === enums.wsType.playerJoin || data.type === enums.wsType.playerExit) {
        this.refreshRoom();
      }
      // 叫牌消息处理
      else if (data.type === enums.wsType.bid) {
        this.$refs.tableBoard.showBid();
      }
      // 叫牌结束
      else if (data.type === enums.wsType.bidEnd) {
        this.refreshRoom();
        this.showTopCards = true;
        this.$refs.tableBoard.getMyCards();
      }
      // 通知玩家出牌
      else if (data.type === enums.wsType.pleasePlayCard) {
        this.$refs.tableBoard.showPlay();
        this.$refs.tableBoard.getCanPass();
      }
      // 有玩家出牌
      else if (data.type === enums.wsType.playCard) {
        this.refreshRoom();
        this.$refs.gameAudio.playOutMusic(data.cardType, data.number);
      }
      // 有玩家不出
      else if (data.type === enums.wsType.pass) {
        this.refreshRoom();
        this.$refs.gameAudio.playPassMusic(data.user);
      }
      // 游戏结束
      else if (data.type === enums.wsType.gameEnd) {
        this.gameEnd(data);
      } else if (data.type === enums.wsType.chat) {
        this.chat(data);
      }
    },
    connectWebsocket() {
      if ('WebSocket' in window) {
        this.websocket = new WebSocket(this.$urls.ws.connect(localStorage.getItem('token')));
      } else {
        this.$notif.error('你的浏览器不支持 WebSocket, 将影响游戏功能使用')
      }
      this.websocket.onmessage = this.onWsMessage;
      this.websocket.onopen = () => {
        this.startWsTimeOut();
      }
      this.websocket.onerror = err => {
        this.$notif.error('websocket 连接失败, 会影响游戏正常运行')
        console.error('WebSocket connect error: ')
        console.error(err)
      }
      this.websocket.onclose = () => {
        console.warn('websocket 断开连接了')
      }
    },
    /**
     * 周期性向 Server 上报消息, 保证不掉线
     */
    startWsTimeOut() {
      this.wsTimeoutObj = setTimeout(() => this.websocket.send("ping"), 10000)
    },
    resetWsTimeOut() {
      clearTimeout(this.wsTimeoutObj);
      this.startWsTimeOut();
    },
    selectCardListener() {
      this.$refs.gameAudio.playSelectMusic();  // 播放选择牌音效
    },
    distributeListener() {
      this.$refs.gameAudio.playDealAudio();  // 播放发牌音效
    },
    continueGame() {  // 点击结算Dialog继续游戏触发的事件
      this.$refs.gameAudio.playNormalMusic();
      this.gameEndDialog = false;
      this.ready();
    },
    gameEndDialogSubmit() {  // 点击结算Dialog确认触发的事件
      this.userPreparing = true;
      this.$refs.gameAudio.playNormalMusic();
      this.gameEndDialog = false;
    },
    pauseBGM(e) {
      if (!this.bgmSwtich) {
        this.$refs.gameAudio.pauseNormalMusic()
      } else {
        this.$refs.gameAudio.playNormalMusic()
      }
    },
    /**
     * 处理聊天消息
     */
    chat(message) {
      let sender = message.sender
      if (sender != undefined) {
        this.toast.header = message.sender.username
        this.toast.headerImg = message.sender.avatar
      }
      this.toast.body = message.content
      this.toast.right = message.createTime
      this.$refs.chatToast.showWithTimeouit(3000)
      this.$refs.gameAudio.playChatAudio(message.typeId)
    }
  },
  created() {
    if (localStorage.getItem('token') != null) {
      this.connectWebsocket();
    }
    this.getRoom();
  }
}
</script>

<style scoped>

#room-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-image: url("../assets/table-background.jpg");
  background-size: cover;
  height: 100vh;
}

#other-player-user {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

#prev-player {
  display: flex;
  align-items: flex-end
}

#prev-player-recentcards {
  margin-left: 20px;
}

#next-player {
  display: flex;
  align-items: flex-end
}

#next-player-recentcards {
  margin-right: 20px;
}
</style>
