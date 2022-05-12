<template>
  <div id="game-audio">

    <!--欢乐斗地主经典准备音乐-->
    <!--https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/MusicEx/MusicEx_Welcome.mp3-->

    <!--游戏中和准备时的音乐-->
    <audio id="normal-music" loop="loop">
      <source src="https://static.pushy.site/game/music/room-normal-4.mp3" type="audio/mp3" />
    </audio>

    <!--选择牌音效-->
    <audio id="select-music">
      <source src="https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/Special/SpecSelectCard.mp3" type="audio/mp3" />
    </audio>

    <!--不出音效-->
    <audio id="pass-music" src="https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/Man/Man_buyao4.mp3"/>

    <!--发牌音效-->
    <audio id="deal-music" src="https://hlddz.huanle.qq.com/resRoot-1.3.0.3/Sound/Special/Special_Dispatch.mp3"/>

    <!--游戏结束时音效-->
    <audio id="end-music" :src="endMusicUrl"/>

    <!--出牌音效-->
    <audio id="out-music" :src="outMusicUrl"/>

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

        normalAudio: null,
        selectAudio: null,
        endAudio: null,
        outAudio: null,
        passAudio: null,
        dealAudio: null
      }
    },
    methods: {
      playNormalMusic() {
        this.normalAudio.play();
      },
      pauseNormalMusic() {
        this.normalAudio.pause();
      },
      playSelectMusic() {
        this.selectAudio.play();
      },
      playEndMusic(isWinning) {
        if (isWinning) this.endMusicUrl = musicUrls.end.winning
        else this.endMusicUrl = musicUrls.end.failing;
        let self = this;
        setTimeout(function () {
          self.endAudio.play();
        }, 100)  // 因为dom重新渲染，所有需要等待一小段时间来等待dom渲染完成，如果出现没有声音，则调大该时间的长度
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
          let self = this;
          setTimeout(function () {
            self.outAudio.play();
          }, 100)
        }
      },
      playPassMusic(user) {
        this.passAudio.play();
      },
      playDealAudio() {
        this.dealAudio.play();
      }
    },
    mounted() {
      this.normalAudio = document.getElementById('normal-music');
      this.selectAudio = document.getElementById('select-music');
      this.endAudio = document.getElementById('end-music');
      this.outAudio = document.getElementById('out-music');
      this.passAudio = document.getElementById('pass-music');
      this.dealAudio = document.getElementById('deal-music');
    }
  }
</script>

<style scoped>

</style>
