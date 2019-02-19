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
    <mu-card>
      <mu-card-header title="pushyzheng" sub-title="房主" id="card-header">
        <mu-avatar slot="avatar">
          <img src="https://i.loli.net/2019/02/17/5c6954a577d6b.gif">
        </mu-avatar>
      </mu-card-header>
      <mu-card-title :title="room.id" sub-title="欢迎大家来斗地主啦！！！！！！！！" class="card-title"/>
      <mu-card-actions>
        <div style="display: flex;justify-content: space-between">
          <div v-if="room.status == 'PREPARING'">
            准备中
          </div>
          <div v-else>
            游戏中
          </div>
          <mu-button flat @click="enterRoom">加入房间</mu-button>
        </div>
      </mu-card-actions>
    </mu-card>
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

  .card-title {
    padding: 0px 16px;
  }

</style>
