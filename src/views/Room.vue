<template>
  <div id="room-view" v-bind:style="roomViewStyleObj">
    <GameAudio ref="gameAudio" />

    <!--其他玩家用户信息-->
    <div id="other-player-user">
      <!--上家（左边玩家）-->
      <div id="prev-player" v-if="prevPlayer != null">
        <div style="margin-right: 20px;">
          <div>
            <Avatar :url="prevPlayer.user.avatar"/>
          </div>
          <span class="others-username">{{ prevPlayer.user.username }}</span><br>
          <span class="others-money">
            <img src="../assets/money-bag.png" class="money-icon">{{ prevPlayer.user.money }}
          </span><br>
          <span class="others-identity" v-show="prevPlayer.identityName != ' '">{{ prevPlayer.identityName }}</span>
        </div>
        <div v-if="gamePreparing">
          <img src="../assets/ok-left.png" style="width: 70px;" v-if="prevPlayer.ready">
        </div>
        <div class="remaining-cards" v-else>{{ prevPlayer.cardSize }}</div>
        <CardList :cards="prevPlayer.recentCards" id="prev-player-recentcards" />
      </div>
      <div v-else></div>

      <!--下家（右边玩家）-->
      <div id="next-player" v-if="nextPlayer != null">
        <CardList :cards="nextPlayer.recentCards" id="next-player-recentcards" />
        <div v-if="gamePreparing">
          <img src="../assets/ok-right.png" style="width: 70px;" v-if="nextPlayer.ready">
        </div>
        <div class="remaining-cards" v-else>{{ nextPlayer.cardSize }}</div>

        <div style="margin-left: 20px;">
          <div>
            <Avatar :url="nextPlayer.user.avatar"/>
          </div>
          <span class="others-username">{{ nextPlayer.user.username }}</span><br>
          <span class="others-money">
            <img src="../assets/money-bag.png" class="money-icon"> {{ nextPlayer.user.money }}
          </span><br>
          <span class="others-identity" v-show="nextPlayer.identityName != ' '">{{ nextPlayer.identityName }}</span>
        </div>
      </div>
      <div v-else></div>
    </div>

    <!--准备和退出房间操作按钮-->
    <mu-flex justify-content="center" align-items="center">
      <div v-if="userPreparing">
        <mu-button @click="ready" v-show="gamePreparing" color="primary" large round>准备</mu-button>
        <mu-button @click="exitRoom" v-show="gamePreparing" color="error" large round>退出房间</mu-button>
      </div>
      <div v-else>
        <mu-button @click="unReady" v-show="gamePreparing" color="success" large round>取消准备</mu-button>
      </div>
    </mu-flex>

    <!--当前玩家最近出的牌-->
    <div style="display: flex;justify-content: center;">
      <CardList :cards="curPlayer.recentCards" v-if="curPlayer != null"/>
    </div>

    <TableBoard ref="tableBoard" :room="room" @selectCard="selectCardListener"/>

    <!--当前玩家的信息和状态栏-->
    <div id="my-info">
      <div>
        <Avatar :url="curUser.avatar"/>
        <span id="curuser-username">{{ curUser.username }}</span>
        <span id="curuser-money">
          <img src="../assets/money-bag.png" class="money-icon">
          {{ curUser.money }}
        </span>
      </div>
      <div>
        <!--房间当前的倍数-->
        <span id="room-multiple">当前倍数：{{ room == null ? 0 : room.multiple }}</span>
      </div>
    </div>

    <!--结束时显示信息的Dialog-->
    <mu-dialog title="Dialog" width="500" :open.sync="gameEndDialog">

      <div style="display: flex;justify-content: space-between">
        <mu-button color="error" round large @click="gameEndDialog=false">确定</mu-button>
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

  export default {
    components: { GameAudio, CardList, Avatar, TableBoard },
    data() {
      return {
        roomViewStyleObj: {
          height: document.documentElement.clientHeight + 'px'
        },
        userPreparing: false,
        gameEndDialog: false,
        prevPlayer: null,
        curPlayer: null,
        nextPlayer: null,

        roomId: this.$route.params.id,
        playerList: null,
        room: null,
        websocket: null,
        wsTimeoutObj: null
      }
    },
    computed: {
      gamePreparing() {
        if (this.room == null) return false;
        else return this.room.status == this.$enums.roomStatus.preparing;
      },
      curUser() {
        return this.$store.state.curUser;
      }
    },
    methods: {
      getRoom() {
        this.$http.get(this.$urls.rooms.getRoomById(this.roomId)).then(
          response => {
            this.room = response.data.data;
            this.playerList = this.room.playerList;
            if (this.room.status === this.$enums.roomStatus.preparing) {
              this.getPlayerReady();
            }
            this.getPrevAndNextPlayer();
          }
        ).catch(
          error => {
            if (error.response.status == 404) {
              alert('该房间不存在，将返回大厅');
            } else {
              alert('发生未知错误，返回大厅： \n' + error);
            }
            this.$router.push({name: 'GameCenter'});
          }
        );
      },
      exitRoom() {
        let body = {id: this.roomId}
        this.$http.post(this.$urls.rooms.exit, body).then(
          response => {
            localStorage.removeItem('CURRENT_ROOM_ID');
            this.$router.push({name: 'GameCenter'});
          }
        ).catch(
          error => alert(error.response.data.message)
        )
      },
      ready() {
        this.userPreparing = false;
        let body = {roomId: this.roomId}
        this.$http.post(this.$urls.game.ready, body).then(
          response => {
            console.log(response.data.data);
          }
        ).catch(
          error => alert(error.response.data.message)
        )
      },
      unReady() {
        this.$http.post(this.$urls.game.unReady).then(
          response => {
            this.userPreparing = true;
          }
        ).catch(
          error => alert(error.response.data.message)
        )
      },
      getPlayerReady() {
        this.$http.get(this.$urls.player.isReady).then(
          response => {
            this.userPreparing = !response.data.data;
          }
        ).catch(
          error => alert(error)
        )
      },
      gameEnd(data) {
        this.$refs.gameAudio.pauseNormalMusic();
        this.$refs.gameAudio.playEndMusic(data.winning);
        this.getRoom();
        this.userPreparing = false;
        this.$refs.tableBoard.gameEndListener();

        let str = "";
        for (let i = 0; i < data.resList.length; i++) {
          str += JSON.stringify(data.resList[i]) + "\n";
        }
        alert('游戏结束：\n' + "获胜方：" + data.winingIdentityName + "\n" + "比分情况：\n" + str);
      },
      /**
       * 计算出上家和下家的player对象
       */
      getPrevAndNextPlayer() {
        let playerList = this.room.playerList;
        for (let i = 0; i < playerList.length; i++) {
          if (playerList[i].user.id == this.curUser.id) {
            this.curPlayer = playerList[i];
            let prevPlayerId = this.curPlayer.id == 1 ? 3 : this.curPlayer.id - 1;
            let nextPlayerId = this.curPlayer.id == 3 ? 1 : this.curPlayer.id + 1;
            this.prevPlayer = playerList[prevPlayerId - 1];
            this.nextPlayer = playerList[nextPlayerId - 1];
          }
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
          this.getRoom();
        }
        // 开始游戏消息处理
        else if (data.type === enums.wsType.startGame) {
          // alert('开始游戏！');
          this.$refs.tableBoard.getMyCards();
        }
        // 玩家加入或者加入
        else if (data.type === enums.wsType.playerJoin || data.type === enums.wsType.playerExit) {
          this.getRoom();
        }
        // 叫牌消息处理
        else if (data.type === enums.wsType.bid) {
          this.$refs.tableBoard.showBid();
        }
        // 叫牌结束
        else if (data.type === enums.wsType.bidEnd) {
          this.getRoom();
        }
        // 通知玩家出牌
        else if (data.type === enums.wsType.pleasePlayCard) {
          // alert('请出牌!!!')
          this.$refs.tableBoard.showPlay();
          this.$refs.tableBoard.getCanPass();
        }
        // 有玩家出牌
        else if (data.type === enums.wsType.playCard) {
          this.getRoom();
          this.$refs.gameAudio.playOutMusic(data.cardType, data.number);
        }
        // 有玩家不出
        else if (data.type === enums.wsType.pass) {
          this.$refs.gameAudio.playPassMusic(data.user);
        }
        // 游戏结束
        else if (data.type === enums.wsType.gameEnd) {
          this.gameEnd(data);
        }
      },
      connectWebsocket() {
        let self = this;
        if ('WebSocket' in window) {
          this.websocket = new WebSocket(this.$urls.ws.connect(localStorage.getItem('token')));
        }
        this.websocket.onmessage = this.onWsMessage;
        this.websocket.onopen = function () {
          console.log('WebSocket连接成功');
          self.startWsTimeOut();
        }
        this.websocket.onerror = function () {
          console.error('WebSocket连接发生错误')
        }
        this.websocket.onclose = function () {
          console.log('websocket断开连接了，尝试重连。。。');
        }
      },
      startWsTimeOut() {
        let self = this;
        this.wsTimeoutObj = setTimeout(function () {
          self.websocket.send("ping");
        }, 10000)
      },
      resetWsTimeOut() {
        clearTimeout(this.wsTimeoutObj);
        this.startWsTimeOut();
      },
      selectCardListener() {
        this.$refs.gameAudio.playSelectMusic();  // 播放选择牌音效
      },
      continueGame() {
        this.gameEndDialog = false;
        this.ready();
      }
    },
    created() {
      this.getRoom();
      if (localStorage.getItem('token') != null) {
        this.connectWebsocket();
      }
    },
    mounted() {
      // this.$refs.gameAudio.playNormalMusic();
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
  }

  #other-player-user {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  #my-info {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 5px;
    background-color: rgba(0,0,0,.54);
  }

  #curuser-username {
    font-size: 20px;
    margin-left: 20px;
    color: white;
    font-weight: bolder;
  }

  #curuser-money {
    font-size: 20px;
    margin-left: 20px;
    color: white;
    font-weight: bolder;
  }

  #room-multiple {
    font-size: 20px;
    margin-right: 30px;
    color: white;
    font-weight: bolder;
  }

  .others-username {
    color: white;
    font-weight: bolder;
    font-size: 18px;
  }

  .others-money {
    font-size: 15px;
    color: white;
    font-weight: bolder;
  }

  .others-identity {
    font-size: 15px;
    color: white;
    font-weight: bolder;
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

  .remaining-cards {
    background-image: url('../assets/card-back.png');
    color: white;
    font-weight: bolder;
    font-size: 20px;
    -webkit-background-size: cover;
    background-size: cover;
    border-radius: 10px;
    padding: 15px 9px;
  }

  .money-icon{
    width: 20px;
    margin-right: 4px;
  }

</style>
