<template>
  <div id="components">
    <button type="button" @click="toggleFullscreen" class="btn btn-primary">Fullscreen</button>
    <!-- Api  -->
    <button type="button" @click="toggleApi" class="btn btn-primary">FullscreenApi</button>
    <!-- Directive  -->
    <button type="button" v-fullscreen class="btn btn-primary">FullscreenDirective</button>

    <fullscreen v-model="fullscreen">
      <div>
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
    </fullscreen>
  </div>
</template>

<script>
import Modal from "../components/boostrap/Modal";
import AlertNew from "../components/boostrap/Alert";
import Toast from "../components/boostrap/Toast";
import Countdown from "../components/Countdown";

export default {
  components: {AlertNew, Modal, Toast, Countdown},
  name: "Components",
  data() {
    return {
      showLoading: false,
      fullscreen: false
    }
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
    }
  }
}
</script>

<style scoped>

</style>
