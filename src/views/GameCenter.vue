<template>
  <div id="game-center-view" v-bind:style="gameCenterViewStyles">
    <!--欢迎音乐-->
    <audio loop="loop" :src="welcomeMusicUrl" autoplay="autoplay"/>

    <!--左侧个人信息-->
    <Profile/>

    <div id="game-center-title">
      游戏大厅
    </div>

    <image-button class="position-absolute top-0 end-0" width="50" style="padding: 1rem"
                  data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"
                  :url="avatarUrl"/>

    <!--没有房间显示的提示-->
    <div v-if="roomList.length == 0" id="no-room">
      <div id="no-room-text">
        没有找到房间 <br> 点击下方的 + 按钮可以创建房间 <br> 并邀请好友一起游戏！
      </div>
    </div>

    <!--房间列表-->
    <mu-list id="room-list" v-else>
      <RoomItem v-for="room in roomList" :room="room"/>
    </mu-list>

    <Modal @submit="createRoom"
           title="创建新的房间"
           ref="createRoomModal"
           header-img="/static/images/create-team.png">
      <div>
        <alert-new ref="createRoomAlert"/>
        <form>
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="username-input" placeholder="房间名" v-model="title">
            <label>房间名</label>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control" id="password-input" placeholder="请输入房间密码" v-model="password">
            <label>请输入房间密码</label>
          </div>
        </form>
      </div>
    </Modal>

    <!--创建房间按钮-->
    <image-button url="/static/images/create.png" width="70" id="create-button"
                  @click="showCreateRoomModal"/>
  </div>
</template>

<script>
import enums from '../config/enums'
import musicUrls from '../config/music'
import RoomItem from "../components/RoomItem";
import VerticleTip from "../components/VerticleTip";
import Modal from "../components/boostrap/Modal";
import AlertNew from "../components/boostrap/Alert";
import Profile from "../components/Profile";
import ImageButton from "../components/ImageButton";

export default {
  components: {ImageButton, AlertNew, VerticleTip, RoomItem, Modal, Profile},
  data() {
    return {
      title: null,
      password: null,
      welcomeMusicUrl: musicUrls.welcome,
      roomList: [],
      gameCenterViewStyles: {
        'background-image': `url('${this.$images.getGameCenterBackground()}')`
      }
    }
  },
  computed: {
    avatarUrl() {
      return this.$images.getUserAvatar(this.$store.state.curUser)
    }
  },
  created() {
    if (localStorage.getItem('token') == null) {
      this.$router.push({name: 'Login'})
    } else {
      this.getRoomList();
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
      let body = {password: this.password, title: this.title};
      this.$http.post(this.$urls.rooms.create, body)
        .then(response => {
          let roomId = response.data.data.id;
          // this.$router.push({name: 'Room', params: {id: roomId}})
          location.href = '/#/rooms/' + roomId
          location.reload();
          localStorage.setItem('CURRENT_ROOM_ID', roomId);
        })
        .catch(error => {
          this.$refs.createRoomModal.reset();
          this.$refs.createRoomAlert.error(error.response.data.message)
          console.warn(error.response.data.message)
        })
    },
    showCreateRoomModal() {
      this.$refs.createRoomModal.toggle()
    }
  }
}
</script>

<style scoped>

#game-center-view {
  padding: 10px;
  background-size: cover;
  height: 100vh;
}

#game-center-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
  color: white;
  font-size: 2rem;
  margin-bottom: 2rem;
}

#room-list {
  background-color: rgba(0, 0, 0, .54);
  border-radius: 30px;
  min-height: 70vh;
  width: 85vw;
  margin: 0 auto;
}

#create-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

#refresh-button {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

#profile-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  color: white;
  font-weight: bolder;
}

#no-room {
  margin-top: 10px
}

#no-room-text {
  font-weight: bolder;
  font-size: 1.5rem;
  margin-top: 8rem;
  text-align: center;
  line-height: 2;
  color: #ffffff;
}

/* 手机端样式适应 */
@media screen and (max-width: 900px) {

  #no-room-text {
    font-size: 1.2rem;
    margin-top: 4rem;
  }

  #game-center-title {
    margin-bottom: 0.5rem;
  }

  #room-list {
    min-height: 70vh;
  }
}
</style>
