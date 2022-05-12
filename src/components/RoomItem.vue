<template>
  <div class="room-card-component">
    <!--进入房间Dialog-->
    <mu-dialog title="" :open.sync="enterPasswordModal" max-width="80%" width="600">
      <!--密码不能为空警告-->
      <mu-alert color="warning" @delete="passwordNullalert = false" delete
                v-if="passwordNullalert" transition="mu-scale-transition">
        <mu-icon left value="warning"></mu-icon> 密码不能为空！
      </mu-alert>
      <!--密码错误警告-->
      <mu-alert color="error" @delete="passwordErrorAlert = false" delete
                v-if="passwordErrorAlert" transition="mu-scale-transition">
        <mu-icon left value="error"></mu-icon> {{ errorMessage }}
      </mu-alert>

      <mu-flex justify-content="center">
        <mu-text-field v-model="password" icon="locked" label="请输入房间密码"></mu-text-field>
      </mu-flex>
      <mu-flex justify-content="center">
        <mu-button slot="actions" flat color="primary" @click="submitEnter">
          确定
        </mu-button>
      </mu-flex>
    </mu-dialog>

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
      <mu-badge :content="room.userList.length" circle color="secondary" v-if="!room.ready">
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
  export default {
    name: "RoomCard",
    data() {
      return {
        enterPasswordModal: false,
        passwordNullalert: false,
        passwordErrorAlert: false,
        errorMessage: '发生了未知错误，请重试！',

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
            this.enterPasswordModal = true;
          } else {
            this.requestEnter();
          }
        }
      },
      requestEnter() {
        let body = {id: this.room.id, password: this.password};
        this.$http.post(this.$urls.rooms.join, body).then(
          response => {
            this.$router.push({name: 'Room', params: {id: this.room.id}})
            localStorage.setItem('CURRENT_ROOM_ID', this.room.id);
          }
        ).catch(
          error => {
            this.passwordNullalert = false;
            this.passwordErrorAlert = true;
            this.errorMessage = error.response.data.message;
          }
        );
      },
      submitEnter() {
        if (this.password == null) {
          this.passwordNullalert = true;
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

  @media screen and (max-width:840px) {
    .room-item {
      padding: 0;
    }
  }

</style>
