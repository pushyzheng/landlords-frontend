<template>
  <div id="game-center-view">
    <!--欢迎音乐-->
    <!--<audio loop="loop" :src="welcomeMusicUrl" autoplay="autoplay" />-->

    <h1 v-if="roomList.length == 0">当前没有房间</h1>
    <!--房间列表-->
    <div style="display: flex">
      <RoomCard v-for="room in roomList" :room="room" />
    </div>

    <!--创建房间dialog-->
    <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="createRoomModal">
      <mu-appbar color="primary" title="创建房间">
        <mu-button slot="right" flat @click="createRoomModal=false">
          <mu-icon value="close"></mu-icon>
        </mu-button>
      </mu-appbar>
      <div style="padding: 24px;">
        <mu-text-field v-model="roomName" label="房间名" icon="account_circle"/><br>
        <mu-text-field v-model="password" label="请输入房间密码" icon="locked"/>
        <br>
        <mu-flex justify-content="center" align-items="center">
          <mu-button round color="primary" large @click="createRoom">创建</mu-button>
        </mu-flex>
      </div>
    </mu-dialog>

    <br>
    <mu-button @click="getRoomList" color="red" large round>刷新</mu-button>
    <mu-button @click="backToRoom" v-show="showBackToRoom" color="primary" large round>返回房间</mu-button>

    <!--创建房间按钮-->
    <mu-button fab color="red" @click="createRoomModal=true" id="create-button">
      <mu-icon value="add"></mu-icon>
    </mu-button>

  </div>
</template>

<script>
  import enums from '../config/enums'
  import musicUrls from '../config/music'
  import RoomCard from "../components/RoomCard";

  export default {
    components: {RoomCard},
    data() {
      return {
        createRoomModal: false,
        roomName: null,
        password: null,

        welcomeMusicUrl: musicUrls.welcome,
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
      createRoom() {
        let body = {password: this.password};
        this.$http.post(this.$urls.rooms.create, body).then(
          response => {
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

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  a {
    color: #42b983;
  }

  #game-center-view {
    padding: 10px;
  }

  #create-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }


</style>
