<template>
  <div class="room-card-component">
    <!--进入房间Dialog-->
    <Modal ref="enterRoomModal"
           header-img="/static/images/lock.png"
           id="enterRoomModal"
           @submit="submitEnter">
      <div>
        <alert ref="enterRoomAlert"/>
        <input class="form-control form-control-lg" type="text"
               v-model="password"
               placeholder="该房间已加锁, 请输入密码"
               aria-label=".form-control-lg example">
      </div>
    </Modal>

    <mu-list-item avatar button :ripple="true" @click="enterRoom" class="room-item">
      <!--锁标志-->
      <mu-list-item-action v-if="room.locked">
        <mu-icon value="lock" color="red"></mu-icon>
      </mu-list-item-action>
      <mu-list-item-action v-else></mu-list-item-action>
      <!--房主头像-->
      <mu-list-item-action>
        <mu-avatar>
          <img :src="room.owner.avatar">
        </mu-avatar>
      </mu-list-item-action>
      <!--房间信息-->
      <mu-list-item-content>
        <mu-list-item-title>{{ room.id }}</mu-list-item-title>
        <mu-list-item-sub-title>
          {{ room.title }}
        </mu-list-item-sub-title>
      </mu-list-item-content>
      <!--准备中图标-->
      <mu-badge :content="room.userList.length+''" circle color="secondary" v-if="!room.ready">
        <mu-button icon large>
          <mu-icon value="group" color="white"></mu-icon>
        </mu-button>
      </mu-badge>
      <!--游戏中图标-->
      <mu-button ico n large v-else>
        <mu-icon value="play_circle_filled" color="white"></mu-icon>
      </mu-button>
    </mu-list-item>
  </div>
</template>

<script>
import Modal from "./boostrap/Modal";
import Alert from "./boostrap/Alert";

export default {
  name: "RoomCard",
  components: {Modal, Alert},
  data() {
    return {
      password: null
    }
  },
  props: ['room'],
  methods: {
    enterRoom() {
      let curRoomId = localStorage.getItem('CURRENT_ROOM_ID');
      if (curRoomId === this.room.id) {
        this.$router.push({name: 'Room', params: {id: this.room.id}})
        return;
      }
      if (this.room.userList.length >= 3) alert("人数已满，无法加入");
      else if (this.room.status == this.$enums.roomStatus.playing) alert('游戏已开始，无法加入');
      else {
        if (this.room.locked) {
          this.$refs.enterRoomModal.toggle()
        } else {
          this.requestEnter();
        }
      }
    },
    requestEnter() {
      let body = {
        id: this.room.id,
        password: this.password
      };
      this.$http.post(this.$urls.rooms.join, body).then(
        response => {
          location.href = '/#/rooms/' + this.room.id
          location.reload();
          // this.$router.push({name: 'Room', params: {id: this.room.id}})
          localStorage.setItem('CURRENT_ROOM_ID', this.room.id);
        }
      ).catch(
        error => {
          this.$refs.enterRoomAlert.error(error.response.data.message)
          this.$refs.enterRoomModal.reset()
        }
      );
    },
    submitEnter() {
      if (this.$utils.isEmpty(this.password)) {
        this.$refs.enterRoomAlert.warning('密码不能为空')
        this.$refs.enterRoomModal.reset()
      } else {
        this.requestEnter();
      }
    }
  }
}
</script>

<style scoped>

.room-card-component {
  flex: 1;
  margin-right: 20px;
}

.room-item {
  padding: 15px 0;
}

.mu-item-title {
  color: #ffffff;
  font-size: 25px;
  font-weight: bolder;
}

.mu-item-sub-title {
  color: #ffffff;
}

@media screen and (max-width: 840px) {
  .room-item {
    padding: 0;
  }
}

</style>
