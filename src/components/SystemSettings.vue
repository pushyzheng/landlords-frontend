<template>
  <div id="system-settings-component">
    <Modal ref="settingModal" id="settings-modal" title="系统设置" @submit="submit">
      <div>
        <alert ref="alert"/>
        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="server-domain-input" placeholder="服务器地址"
                 v-model="serverDomain">
          <label>服务器地址</label>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "./boostrap/Modal";
import Alert from "./boostrap/Alert";
import Vue from "vue";

const STORATE_SERVER_DOMAIN_KEY = "serverDomain"

export default {
  name: "SystemSettings",
  components: {Modal, Alert},
  data() {
    return {
      serverDomain: this.$urls.getDomain()
    }
  },
  methods: {
    show() {
      this.$refs.settingModal.toggle()
    },
    submit() {
      if (this.$utils.isEmpty(this.serverDomain)) {
        this.$refs.alert.warning('服务器地址不能为空')
      } else {
        localStorage.setItem(STORATE_SERVER_DOMAIN_KEY, this.serverDomain)
        this.$refs.alert.success('更新配置成功')
      }
      this.$refs.settingModal.reset()
    }
  }
}
</script>

<style scoped>

</style>
