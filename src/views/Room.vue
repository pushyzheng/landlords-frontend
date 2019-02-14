<template>
  <div>
    <div style="display: flex;">
      <!--玩家列表-->
      <div v-for="player in playerList" style="margin-left: 20px;">
        <img :src="player.user.avatar" style="width: 50px;">
        <h3>{{ player.user.username }}（{{ player.identityName }}）</h3>
        <span v-show="gamePreparing" style="color: red">{{ player.ready == true ? '已准备' : '未准备' }}</span>
      </div>
    </div>

    <br><br><br>
    <div style="display: flex;justify-content: center;">
      <div v-if="userPreparing">
        <button @click="ready" v-show="gamePreparing" class="operation-button">准备</button>
        <button @click="exitRoom" v-show="gamePreparing" class="operation-button">退出房间</button>
      </div>
      <div v-else>
        <button @click="unReady" v-show="gamePreparing" class="operation-button">取消准备</button>
      </div>
    </div>

    <TableBoard ref="tableBoard" :room="room" />

  </div>
</template>

<script>
  import enums from '../config/enums'
  import TableBoard from "../components/TableBoard";

  export default {
    components: {TableBoard},
    data() {
      return {
        userPreparing: false,

        roomId: this.$route.params.id,
        playerList: null,
        room: null,
        websocket: null
      }
    },
    computed: {
      gamePreparing() {
        if (this.room == null) return false;
        else return this.room.status == this.$enums.roomStatus.preparing;
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
          }
        ).catch(
          error => {
            alert('发生未知错误，返回大厅： \n' + error);
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
      /**
       * 接收webSocket回调消息的函数
       */
      onWsMessage(event) {
        console.log(event.data);
        let data = JSON.parse(event.data);
        // 准备游戏消息处理
        if (data.type === enums.wsType.readyGame || data.type === enums.wsType.unReadyGame) {
          for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].user.id == data.userId) {
              let player = this.playerList[i];
              if (data.type === enums.wsType.readyGame) player.ready = true;
              else player.ready = false;
              this.playerList.splice(i, 1, player);
            }
          }
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
          alert('请出牌!!!')
          this.$refs.tableBoard.showPlay();
          this.$refs.tableBoard.getCanPass();
        }
        else if (data.type === enums.wsType.playCard) {
          alert('有人出牌！！！' + data.userId)
        }
        // 游戏结束
        else if (data.type === enums.wsType.gameEnd) {
          alert('游戏结束：\n' + "获胜方：" + data.winingIdentityName + "\n");
        }
      }
    },
    created() {
      this.getRoom();
      if (localStorage.getItem('token') != null) {
        if ('WebSocket' in window) {
          this.websocket = new WebSocket(this.$urls.ws.connect(localStorage.getItem('token')));
        }
        this.websocket.onopen = function () {
          console.log('WebSocket连接成功');
        }
        this.websocket.onerror = function () {
          alert('WebSocket连接发生错误')
        };
        this.websocket.onmessage = this.onWsMessage;
      }
    }
  }
</script>

<style scoped>
</style>
