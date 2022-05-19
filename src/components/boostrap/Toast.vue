<template>
  <div class="position-absolute start-50 translate-middle-x"
       v-bind:class="{'top-0': isPhone, 'bottom-0': !isPhone}">
    <div>
      <div :id="id" class="toast" role="alert" aria-atomic="true">
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
      default: '1 seconds ago'
    },
    body: {
      default: 'Hello, world! This is a toast message.'
    }
  },
  data() {
    return {
      isPhone: this.$utils.isPhone()
    }
  },
  methods: {
    show() {
      this.getBootstrapToast().show();
    },
    showWithTimeouit(t) {
      this.show();
      // setTimeout(() => {
      //   console.log('timeout...')
      //   this.hide();
      // }, t)
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
