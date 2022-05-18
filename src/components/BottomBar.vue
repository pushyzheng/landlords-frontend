<template>
  <div id="bottom-bar">
    <div>
      <Avatar :url="getPlayerAvatar" id="bottom-bar-avatar"/>
<!--      <span id="curuser-username">{{ curUser.username }}</span>-->
<!--      <span id="curuser-money">-->
<!--          <img src="../assets/money-bag.png" class="money-icon" alt="money-bag">-->
<!--          {{ curUser.money }}-->
<!--      </span>-->
    </div>
    <div id="bottom-bar-chat">
      <input type="text" class="form-control" id="chat-input" v-model="chatContent">
      <div class="btn-group">
        <button class="btn btn-secondary btn-lg" type="button" @click="sendChatMessage(0, chatContent)">
          send
        </button>
        <button type="button" class="btn btn-lg btn-secondary dropdown-toggle dropdown-toggle-split"
                data-bs-toggle="dropdown" aria-expanded="false">
          <span class="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="javascript:void(0)"
                 v-for="msg in defaultMessage"
                 v-bind:key="msg.content"
                 @click="sendChatMessage(msg.type, msg.content)">
            {{ msg.content }}</a></li>
        </ul>
      </div>
    </div>
    <div>
      <!--房间当前的倍数-->
      <span id="room-multiple" v-show="!gamePreparing">当前倍数：{{ room == null ? 0 : room.multiple }}</span>
    </div>
  </div>
</template>

<script>
import Avatar from "./Avatar";
import chatConfig from '../config/chat'

export default {
  name: "Bottom",
  components: {Avatar},
  props: ['room', 'gamePreparing'],
  data() {
    return {
      defaultMessage: chatConfig.defaultMessage,
      chatContent: null
    }
  },
  computed: {
    curUser() {
      return this.$store.state.curUser;
    },
    getPlayerAvatar() {
      return this.$images.getPlayerAvatar(this.curPlayer)
    }
  },
  methods: {
    /**
     * 发送聊天消息
     */
    sendChatMessage(type, content) {
      if (type === 0 && content.length == 0) {
        this.$notif.warning('发送消息不能为空')
        return
      }
      let body = {type: type, content: content, dimension: 'ROOM'}
      this.$http.post(this.$urls.chat.send, body)
        .then(response => this.chatContent = '')
        .catch(error => this.$notif.warning(error.response.data.message))
    }
  }
}
</script>

<style scoped>
#bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  background-color: rgba(0, 0, 0, .54);
}

#bottom-bar-chat {
  display: flex;
}

#chat-input {
  margin-right: 10px;
}

#curuser-username {
  font-size: 20px;
  margin-left: 20px;
  color: white;
  font-weight: bolder;
}

#curuser-money {
  font-size: 20px;
  margin-left: 20px;
  color: white;
  font-weight: bolder;
}

#room-multiple {
  font-size: 20px;
  margin-right: 30px;
  color: white;
  font-weight: bolder;
}

.money-icon {
  width: 20px;
  margin-right: 4px;
}

@media screen and (max-width: 900px) {

  #bottom-bar-chat {
    display: none;
  }
}
</style>
