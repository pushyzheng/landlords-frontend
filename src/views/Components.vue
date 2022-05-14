<template>
  <div id="components">
    <div>
      <h1>alert</h1>
      <Alert text="hello" type="danger"></Alert>
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
</template>

<script>
import Modal from "../components/boostrap/Modal";
import Alert from "../components/boostrap/Alert";
import Toast from "../components/boostrap/Toast";
import Countdown from "../components/Countdown";

export default {
  components: {Modal, Alert, Toast, Countdown},
  name: "Components",
  data() {
    return {
      showLoading: false
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
    }
  }
}
</script>

<style scoped>

</style>
