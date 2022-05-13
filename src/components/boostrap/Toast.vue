<template>
  <div>
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div :id="id" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <img :src="headerImg" alt="" id="header-img">
          <strong class="me-auto">
            {{ header }}
          </strong>
          <small>{{ right }}</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ body }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  props: {
    id: {
      default: 'liveToast'
    },
    header: {
      default: 'title'
    },
    headerImg: {
      default: '/static/images/default-avatar.png'
    },
    right: {
      default: '11 mins ago'
    },
    body: {
      default: 'Hello, world! This is a toast message.'
    }
  },
  methods: {
    show() {
      this.getBootstrapToast().show();
    },
    showWithTimeouit(t) {
      this.show();
      setTimeout(() => this.hide(), t)
    },
    hide() {
      this.getBootstrapToast().hide();
    },
    getBootstrapToast() {
      return new bootstrap.Toast("#" + this.id)
    }
  }
}
</script>

<style scoped>
#header-img {
  width: 20px;
  margin-right: 10px;
}
</style>
