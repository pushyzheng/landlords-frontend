<template>
  <div id="components" class="container">
    <fullscreen v-model="fullscreen">
      <h2 style="color: white">全屏</h2>
    </fullscreen>

    <button type="button" @click="toggleFullscreen" class="btn btn-primary">Fullscreen</button>
    <!-- Api  -->
    <button type="button" @click="toggleApi" class="btn btn-primary">FullscreenApi</button>
    <!-- Directive  -->
    <button type="button" v-fullscreen class="btn btn-primary">FullscreenDirective</button>

    <div>
      <div>
        <h1>Image Button</h1>
        <image-button url="static/images/button-blue.png">
          SUBMIT
        </image-button>
      </div>

      <div>
        <h1>alert</h1>
        <button class="btn btn-primary" @click="$refs.alertNew.success('success')">alert success</button>
        <button class="btn btn-primary" @click="$refs.alertNew.warning('warnning')">alert warnning</button>
        <button class="btn btn-primary" @click="$refs.alertNew.error('error')">alert error</button>
        <alert-new default-type="success" ref="alertNew"></alert-new>
      </div>

      <div>
        <h1>modal</h1>
        <button class="btn btn-primary" @click="toggle">
          show modal
        </button>
      </div>

      <div>
        <h1>Toast</h1>
        <button class="btn btn-primary" @click="showToast">
          show toast
        </button>
      </div>

      <div>
        <h1>countdown</h1>
        <button class="btn btn-primary" @click="startCountdown">
          start coutdown
        </button>

        <div style="background: black">
          <Countdown ref="countdown"/>
        </div>
      </div>

      <div>
        <h1>Scale</h1>
        <div>
          <scale value="0.5">
            <card :data="{numberValue: 1, type:'SPADE'}"/>
          </scale>
        </div>
      </div>

      <div>
        <h1>Card</h1>
        <div style="display: flex">
          <card :data="{numberValue: 1, type:'SPADE'}"/>
          <card :data="{numberValue: 1, type:'CLUB'}"/>
          <card :data="{numberValue: 1, type:'HEART'}"/>
          <card :data="{numberValue: 1, type:'DIAMOND'}"/>
          <card :data="{numberValue: 14,type:'SMALL_JOKER'}"/>
          <card :data="{numberValue: 15,type:'BIG_JOKER'}"/>
        </div>
      </div>

      <div>
        <h1>CardList</h1>
        <card-list :data="threeCards" :overlapping="false"/>

        <h1>CardList overlapping</h1>
        <card-list :data="cards"/>

        <h1>CardList - selectable</h1>
        <div style="margin-bottom: 2rem">
          selectedList: {{ selectedList }}
        </div>
        <button @click="$refs.selectedCardList.resetSelected()">重置</button>
        <card-list :data="cards" selectable="true" ref="selectedCardList" @select="onSelected"/>

        <h1>CardList zoom - 0.5</h1>
        <div>
          <scale value="0.5">
            <card-list :data="threeCards" :overlapping="false"/>
          </scale>

          <p>overlapping: </p>
          <scale value="0.5">
            <card-list :data="threeCards" :overlapping="true"/>
          </scale>
        </div>
      </div>

      <Modal title="NewMessage" @submit="submit" ref="modal" id="exampleModal"
             header-img="/static/images/lock.png">
        <form>
          <div class="mb-3">
            <label for="recipient-name" class="col-form-label">Recipient:</label>
            <input type="text" class="form-control" id="recipient-name">
          </div>
          <div class="mb-3">
            <label for="message-text" class="col-form-label">Message:</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
        </form>
      </Modal>

      <Toast id="test-toast" ref="testToast"/>
    </div>
  </div>
</template>

<script>
import mock from "../config/mock";
import Modal from "../components/boostrap/Modal";
import AlertNew from "../components/boostrap/Alert";
import Toast from "../components/boostrap/Toast";
import Countdown from "../components/Countdown";
import Card from "../components/card/Card";
import CardList from "../components/card/CardList";
import ImageButton from "../components/ImageButton";
import Scale from "../components/Scale";

export default {
  components: {Scale, ImageButton, CardList, AlertNew, Modal, Toast, Countdown, Card},
  name: "Components",
  data() {
    return {
      showLoading: false,
      fullscreen: false,
      card: {
        numberValue: 1,
        type: 'CLUB'
      },
      cards: [],
      threeCards: [],
      selectedList: []
    }
  },
  created() {
    this.cards = mock.cards
    let mockCards = []
    for (let i = 0; i < 3; i++) {
      mockCards.push({numberValue: i + 1, type: 'SPADE'})
    }
    this.threeCards = mockCards;
  },
  methods: {
    toggle() {
      this.$refs.modal.toggle()
    },
    submit() {
      console.log('submit')

      let self = this;
      setTimeout(function () {
        self.$refs.modal.reset();
      }, 1000)

      setTimeout(function () {
        self.$refs.modal.showDirect();
      }, 2000)
    },
    submit2() {
      this.showLoading = true
    },
    showToast() {
      this.$refs.testToast.showWithTimeouit(2000)
    },
    startCountdown() {
      this.$refs.countdown.start(30)
    },
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen
    },
    toggleApi() {
      this.$fullscreen.toggle()
    },
    onSelected(idx, selected) {
      this.selectedList = selected
    }
  }
}
</script>

<style scoped>
#components {
  margin-bottom: 10rem;
}
</style>
