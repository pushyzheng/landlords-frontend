<template>
  <div>
    <div style="text-align: center"><h1>{{ roomId }}</h1></div>
    <!--玩家列表-->
    <div v-for="player in playerList">
      <img :src="player.user.avatar" style="float: left;margin-right: 20px;width: 60px;">
      <h3>{{ player.user.username }}（{{ player.identityName }}）</h3>
      <span v-show="gamePreparing" style="color: red">{{ player.ready == true ? '已准备' : '未准备' }}</span>
    </div>

    <div v-show="userPreparing">
      <br><br><br>
      <button @click="ready" v-show="gamePreparing">准备</button>
      <button @click="exitRoom" v-show="gamePreparing">退出房间</button>
    </div>

    <TableBoard ref="tableBoard" />
  </div>
</template>

<script>
  import enums from '../config/enums'
  import TableBoard from "../components/TableBoard";

  export default {
    components: {TableBoard},
    data() {
      return {
        userPreparing: true,

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
            // 如果当前游戏的状态为游戏中，则调用TableBoard组件的方法，获取卡牌
            if (this.room.status === this.$enums.roomStatus.playing) {
              this.$refs.tableBoard.getMyCards();
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
      /**
       * 接收webSocket回调消息的函数
       */
      onWsMessage(event) {
        console.log(event.data);
        let data = JSON.parse(event.data);
        // 准备游戏消息处理
        if (data.type === enums.wsType.readyGame) {
          for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].user.id == data.userId) {
              let player = this.playerList[i];
              player.ready = true;
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
        else if (data.type === enums.wsType.pleasePlayCard) {
          this.$refs.tableBoard.showPlay();
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
          console.error('WebSocket连接发生错误');
        };
        this.websocket.onmessage = this.onWsMessage;
      }
    }
  }
</script>

<style scoped>

</style>
