<template>
  <div id="bottom-bar">
    <div id="chat-info" v-if="showChatInfo">
      <ul class="list-group">
        <li>
          <a class="list-group-item list-group-item-action" href="javascript:void(0)"
             v-for="msg in defaultMessage"
             v-bind:key="msg.content"
             @click="sendChatMessage(msg.type, msg.content)">
            {{ msg.content }}</a>
        </li>
      </ul>
    </div>
    <image-button url="/static/images/chat.png" width="40" id="chat-button" @click="showChatInfo=!showChatInfo"/>

    <Avatar :url="getPlayerAvatar" id="bottom-bar-avatar"/>

    <div id="bottom-bar-chat" v-if="false">
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
    <div v-if="false">
      <!--房间当前的倍数-->
      <span id="room-multiple" v-show="!gamePreparing">当前倍数：{{ room == null ? 0 : room.multiple }}</span>
    </div>
  </div>
</template>

<script>
import Avatar from "./Avatar";
import chatConfig from '../config/chat'
import ImageButton from "./ImageButton";

export default {
  name: "Bottom",
  components: {ImageButton, Avatar},
  props: ['room', 'gamePreparing'],
  data() {
    return {
      defaultMessage: chatConfig.defaultMessage,
      chatContent: null,
      showChatInfo: false
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
      this.showChatInfo = false
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
}

#bottom-bar-chat {
  display: flex;
}

#bottom-bar-avatar {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
}

#chat-button {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
}

#chat-info {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  max-height: 40vh;
  overflow-y: scroll;
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

  #chat-info {
    max-height: 60vh;
    overflow-y: scroll;
  }
}
</style>
