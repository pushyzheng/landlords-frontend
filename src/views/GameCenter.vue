<template>
  <div id="game-center-view" v-bind:style="gameCenterStyleObj" v-if="!isVerticle">
    <!--欢迎音乐-->
    <audio loop="loop" :src="welcomeMusicUrl" autoplay="autoplay"/>

    <mu-flex justify-content="center">
      <h1>游戏大厅</h1>
    </mu-flex>

    <!--没有房间显示的提示-->
    <div v-if="roomList.length == 0" id="no-room">
      <mu-flex justify-content="center">
        <!--<img src="../assets/202381.svg" id="no-room-img">-->
      </mu-flex>
      <mu-flex justify-content="center" id="no-room-text">
        没有找到房间 <br> 点击下方的 + 按钮可以创建房间 <br> 并邀请好友一起游戏！
      </mu-flex>
    </div>

    <!--房间列表-->
    <mu-list id="room-list" v-else v-bind:style="roomListStyleObj">
      <RoomItem v-for="room in roomList" :room="room"/>
    </mu-list>

    <!--创建房间dialog-->
    <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="createRoomModal">
      <mu-appbar color="primary" title="创建房间">
        <mu-button slot="right" flat @click="createRoomModal=false">
          <mu-icon value="close"></mu-icon>
        </mu-button>
      </mu-appbar>
      <div style="padding: 24px;">
        <mu-text-field v-model="title" label="房间名" icon="account_circle"/>
        <br>
        <mu-text-field v-model="password" label="请输入房间密码" icon="locked"/>
        <br>
        <mu-flex justify-content="center" align-items="center">
          <mu-button round color="primary" large @click="createRoom">创建</mu-button>
        </mu-flex>
      </div>
    </mu-dialog>

    <br>
    <mu-flex justify-content="center">
      <!--<mu-button @click="backToRoom" v-show="showBackToRoom" color="primary" large round>返回房间</mu-button>-->
    </mu-flex>

    <!--创建房间按钮-->
    <mu-button fab color="red" @click="createRoomModal=true" id="create-button">
      <mu-icon value="add"></mu-icon>
    </mu-button>
    <!--刷新按钮-->
    <mu-button @click="getRoomList" color="primary" fab id="refresh-buttom">
      <mu-icon value="refresh"></mu-icon>
    </mu-button>

  </div>
  <VerticleTip v-else/>
</template>

<script>
import enums from '../config/enums'
import musicUrls from '../config/music'
import RoomItem from "../components/RoomItem";
import VerticleTip from "../components/VerticleTip";

export default {
  components: {VerticleTip, RoomItem},
  data() {
    return {
      isVerticle: false,
      createRoomModal: false,
      title: null,
      password: null,
      gameCenterStyleObj: {
        height: document.documentElement.clientHeight + 'px'
      },
      roomListStyleObj: {
        minHeight: document.documentElement.clientHeight / 1.5 + 'px'
      },
      welcomeMusicUrl: musicUrls.welcome,
      roomList: []
    }
  },
  computed: {
    showBackToRoom() {
      return localStorage.getItem('CURRENT_ROOM_ID') != null ? true : false;
    }
  },
  created() {
    window.addEventListener('orientationchange', this.orientationchangeListener);  // 绑定横竖屏切换事件
    if (document.documentElement.clientWidth < 500) {
      this.isVerticle = true;
    } else {
      if (localStorage.getItem('token') == null) {
        this.$router.push({name: 'Login'})
      } else {
        this.getRoomList();
      }
    }
  },
  mounted() {
    if (localStorage.getItem('token') == null) {
      this.$router.push({name: 'Login'})
    } else {
      this.getRoomList();
    }
  },
  methods: {
    getRoomList() {
      this.$http.get(this.$urls.rooms.listRoom).then(
        response => {
          this.roomList = response.data.data;
        }
      ).catch(error => {
          console.error(error)
          // this.$router.push({name: 'Login'})
          // location.href = '/'
        }
      )
    },
    createRoom() {
      let body = {
        password: this.password,
        title: this.title
      };
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
    },
    orientationchangeListener() {  // 处理横竖屏切换事件
      location.reload();
    }
  }
}
</script>

<style scoped>

#game-center-view {
  padding: 10px;
  background-image: url("../assets/game-center-bg.jpg");
  background-size: cover;
}

#room-list {
  background-color: rgba(0, 0, 0, .54);
  border-radius: 30px;
  min-height: 500px;
}

#create-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

#refresh-buttom {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

#no-room {
  margin-top: 10px
}

#no-room-img {
  width: 300px;
}

#no-room-text {
  font-weight: bolder;
  font-size: 22px;
  margin-top: 20px;
  text-align: center;
  line-height: 2;
  color: #ffffff;
}

/* 手机端样式适应 */
@media screen and (max-width: 840px) {

  #no-room-img {
    width: 150px;
  }

  #no-room-text {
    font-size: 15px;
    margin-top: 10px;
  }
}
</style>
