<template>
  <div id="game-audio">
    <!--欢乐斗地主经典准备音乐-->
    <audio id="normal-music" loop="loop"
           src="https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/MusicEx/MusicEx_Welcome.mp3"/>

    <!--不出音效-->
    <audio id="pass-music" src="https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/Man/Man_buyao4.mp3"/>

    <!--游戏结束时音效-->
    <audio id="end-music" :src="endMusicUrl"/>

    <!--出牌音效-->
    <audio id="out-music" :src="outMusicUrl"/>

    <!--聊天消息-->
    <audio id="chat-music" :src="chatAudioUrl"/>
  </div>
</template>

<script>
import musicUrls from '../config/music'

export default {
  name: "GameAudio",
  data() {
    return {
      endMusicUrl: null,
      outMusicUrl: null,
      chatAudioUrl: null,

      normalAudio: null,
      endAudio: null,
      outAudio: null,
      passAudio: null,
      chatAudio: null
    }
  },
  methods: {
    playNormalMusic() {
      this.normalAudio.play();
    },
    pauseNormalMusic() {
      this.normalAudio.pause();
    },
    playEndMusic(isWinning) {
      if (isWinning) this.endMusicUrl = musicUrls.end.winning
      else this.endMusicUrl = musicUrls.end.failing;
      this.doPlay(this.endAudio)
    },
    playOutMusic(type, number) {
      let url = undefined;
      if (type == 'SINGLE' || type == 'PAIR') {
        url = musicUrls.card[type][number];
      } else {
        url = musicUrls.card[type];
      }
      console.log('playOutMusic url is：' + url);
      if (url != undefined) {
        this.outMusicUrl = url;
        this.doPlay(this.outAudio)
      }
    },
    playPassMusic(user) {
      this.passAudio.play();
    },
    playChatAudio(typeId) {
      if (typeId == 0) return  // 自定义消息
      let url = musicUrls.chat[typeId]
      if (url != undefined) {
        this.chatAudioUrl = url
        this.doPlay(this.chatAudio)
      }
    },
    /**
     * 因为dom重新渲染，所有需要等待一小段时间来等待dom渲染完成，如果出现没有声音，则调大该时间的长度
     * @param dom The document of audio
     */
    doPlay(dom) {
      setTimeout(() => dom.play(), 100)
    }
  },
  mounted() {
    this.normalAudio = document.getElementById('normal-music');
    this.endAudio = document.getElementById('end-music');
    this.outAudio = document.getElementById('out-music');
    this.passAudio = document.getElementById('pass-music');
    this.chatAudio = document.getElementById('chat-music');
  }
}
</script>

<style scoped>

</style>
