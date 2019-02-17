<template>
  <div id="game-center-view">
    <h1 v-if="roomList.length == 0">当前没有房间</h1>

    <div v-for="room in roomList" style="font-size: 20px;">
      <a href="javascript:void(0)" @click="enterRoom(room)">{{ room.id }}</a>
      <span v-if="room.status == 'PREPARING'">准备中</span>
      <span v-else>游戏中</span>
      <span>房间人数： {{ room.userList.length }}</span>
    </div>

    <div style="margin-top: 20px;">
      <button @click="createRoom" class="operation-button">创建房间</button>
      <button @click="getRoomList" class="operation-button">刷新</button>
      <button @click="backToRoom" v-show="showBackToRoom" class="operation-button">返回房间</button>
    </div>

  </div>
</template>

<script>
  import enums from '../config/enums'

  export default {
    data() {
      return {
        roomList: []
      }
    },
    computed: {
      showBackToRoom () {
        return localStorage.getItem('CURRENT_ROOM_ID') != null ? true : false;
      }
    },
    created() {
      if (localStorage.getItem('token') == null) {
        this.$router.push({name: 'Login'})
      }
      this.getRoomList();
    },
    methods: {
      getRoomList() {
        this.$http.get(this.$urls.rooms.listRoom).then(
          response => {
            this.roomList = response.data.data;
          }
        ).catch(
          error => alert('请求失败，请登录')
        )
      },
      enterRoom(room) {
        let curRoomId = localStorage.getItem('CURRENT_ROOM_ID');
        if (curRoomId === room.id) {
          this.$router.push({name: 'Room', params: {id: room.id}})
          return;
        }
        if (room.userList.length >= 3) alert("人数已满，无法加入");
        else if (room.status == enums.roomStatus.playing) alert('游戏已开始，无法加入');
        else {
          if (room.locked) {
            var password = prompt("请输入房间的密码：");
            if (password === null) return;
          }
          let body = {id: room.id, password: password};
          this.$http.post(this.$urls.rooms.join, body).then(
            response => {
              alert('加入房间成功');
              this.$router.push({name: 'Room', params: {id: room.id}})
              localStorage.setItem('CURRENT_ROOM_ID', room.id);
            }
          ).catch(
            error => alert(error.response.data.message)
          );
        }
      },
      createRoom() {
        let password = prompt("请输入房间的密码：");
        let body = {password: password};
        this.$http.post(this.$urls.rooms.create, body).then(
          response => {
            alert('创建房间成功');
            let roomId = response.data.data.id;
            this.$router.push({name: 'Room', params: {id: roomId}})
            localStorage.setItem('CURRENT_ROOM_ID', roomId);
          }
        ).catch(
          error => alert(error.response.data.message)
        )
      },
      backToRoom() {
        this.$router.push({name: 'Room', params: {id: localStorage.getItem('CURRENT_ROOM_ID')}})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
