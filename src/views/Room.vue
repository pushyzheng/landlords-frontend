<template>
  <div id="room-view">
    <audio id="game-bgm">
      <source src="https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/MusicEx/MusicEx_Welcome.mp3" type="audio/mp3" />
      <embed height="100" width="100" src="https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/MusicEx/MusicEx_Welcome.mp3" />
    </audio>

    <!--其他玩家用户信息-->
    <div id="other-player-user">
      <!--上家（左边玩家）-->
      <div id="prev-player" v-if="prevPlayer != null">
        <div style="margin-right: 20px;">
          <div>
            <Avatar :url="prevPlayer.user.avatar"/>
          </div>
          <span class="others-username">{{ prevPlayer.user.username }}</span><br>
          <span class="others-money">剩余金额：{{ prevPlayer.user.money }}</span><br>
          <span class="others-identity" v-show="prevPlayer.identityName != ' '">{{ prevPlayer.identityName }}</span>
        </div>
        <div style="color: red" v-if="gamePreparing">{{ prevPlayer.ready == true ? '已准备' : '未准备' }}</div>
        <div class="remaining-cards" v-else>{{ prevPlayer.cardSize }}</div>
        <CardList :cards="prevPlayer.recentCards" id="prev-player-recentcards" />
      </div>
      <div v-else></div>

      <!--下家（右边玩家）-->
      <div id="next-player" v-if="nextPlayer != null">
        <CardList :cards="nextPlayer.recentCards" id="next-player-recentcards" />
        <div style="color: red" v-if="gamePreparing">{{ nextPlayer.ready == true ? '已准备' : '未准备' }}</div>
        <div class="remaining-cards" v-else>{{ nextPlayer.cardSize }}</div>

        <div style="margin-left: 20px;">
          <div>
            <Avatar :url="nextPlayer.user.avatar"/>
          </div>
          <span class="others-username">{{ nextPlayer.user.username }}</span><br>
          <span class="others-money">剩余金额：{{ nextPlayer.user.money }}</span><br>
          <span class="others-identity" v-show="nextPlayer.identityName != ' '">【{{ nextPlayer.identityName }}】</span>
        </div>
      </div>
      <div v-else></div>
    </div>

    <!--准备和退出房间操作按钮-->
    <div style="display: flex;justify-content: center;">
      <div v-if="userPreparing">
        <button @click="ready" v-show="gamePreparing" class="operation-button">准备</button>
        <button @click="exitRoom" v-show="gamePreparing" class="operation-button">退出房间</button>
      </div>
      <div v-else>
        <button @click="unReady" v-show="gamePreparing" class="operation-button">取消准备</button>
      </div>
    </div>

    <!--当前玩家最近出的牌-->
    <div style="display: flex;justify-content: center;">
      <CardList :cards="curPlayer.recentCards" v-if="curPlayer != null"/>
    </div>

    <TableBoard ref="tableBoard" :room="room"/>

    <!--当前玩家的信息和状态栏-->
    <div id="my-info">
      <div>
        <Avatar :url="curUser.avatar"/>
        <span id="curuser-username">{{ curUser.username }}</span>
        <span id="curuser-money">剩余金额：{{ curUser.money }}</span>
      </div>
      <div>
        <!--房间当前的倍数-->
        <span id="room-multiple">当前倍数：{{ room == null ? 0 : room.multiple }}</span>
      </div>
    </div>

  </div>
</template>

<script>
  import enums from '../config/enums'
  import TableBoard from "../components/TableBoard";
  import Avatar from "../components/Avatar";
  import CardList from "../components/PlayerCardList";

  export default {
    components: {CardList, Avatar, TableBoard},
    data() {
      return {
        userPreparing: false,
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
              this.$router.push({name: 'GameCenter'});
            } else {
              alert('发生未知错误，返回大厅： \n' + error);
            }
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
        else if (data.type === enums.wsType.playCard) {
          this.getRoom();
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
      }
    },
    created() {
      this.getRoom();
      if (localStorage.getItem('token') != null) {
        this.connectWebsocket();
      }
    },
    mounted() {
      let audio = document.getElementById("game-bgm");
      // audio.play();
    }
  }
</script>

<style scoped>

  #room-view {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 722px;
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
    /*margin-top: 50px;*/
    margin-bottom: 10px;
    margin-left: 10px;
  }

  #curuser-username {
    font-size: 20px;
    background: #D3D3D3;
    margin-left: 20px;
  }

  #curuser-money {
    font-size: 20px;
    background: #D3D3D3;
    margin-left: 20px;
  }

  #room-multiple {
    font-size: 20px;
    background: #D3D3D3;
    margin-right: 50px;
  }

  .others-username {
    font-size: 18px;
    background: #D3D3D3;
  }

  .others-money {
    font-size: 15px;
    background: #D3D3D3;
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

</style>
