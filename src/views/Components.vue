<template>
  <div id="components">
    <Alert text="hello" type="danger"></Alert>

    <button class="btn btn-primary" @click="toggle">
      toggle
    </button>

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
  </div>
</template>

<script>
import Modal from "../components/Modal";
import Alert from "../components/Alert";

export default {
  components: {Modal, Alert},
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
    }
  }
}
</script>

<style scoped>

</style>
