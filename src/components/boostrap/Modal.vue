<template>
  <div>
    <div class="modal fade"
         :id="id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" v-bind:class="{'modal-fullscreen':this.$utils.isPhone()}">
        <div class="modal-content">
          <div class="modal-main">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel" v-if="!showImage">
                {{ title }}
              </h5>
              <div v-else>
                <img :src="headerImg" alt="header-image" class="modal-header-image">
              </div>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-lg"
                    data-bs-dismiss="modal">
              {{ cancelBtnText }}
            </button>
            <button type="button" class="btn btn-primary btn-lg" id="submit-btn"
                    @click="submit"
                    v-bind:class="{ 'btn-primary': submitBtn.isPrimary,'btn-success': submitBtn.isSuccess,
                    disabled: submitBtn.isDisabled }">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                    v-if="submitBtn.isDisabled"></span>
              {{ submitBtn.text }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    id: {
      default: 'modal'
    },
    title: {
      default: 'Modal'
    },
    headerImg: {
      default: null
    },
    submitBtnText: {
      default: '确认'
    },
    cancelBtnText: {
      default: '取消'
    }
  },
  data() {
    return {
      showImage: false,
      submitBtn: {
        text: '登录',
        isDisabled: false,
        isSuccess: false,
        isPrimary: true
      }
    }
  },
  created() {
    this.submitBtn.text = this.submitBtnText;
    if (this.headerImg != null && this.headerImg.length != 0) {
      this.showImage = true;
    }
  },
  methods: {
    submit() {
      this.showLoading();
      this.$emit('submit');
    },
    toggle() {
      this.getBootstraptModal().toggle()
    },
    showLoading() {
      this.submitBtn.isDisabled = true;
      this.submitBtn.text = 'Loading';
    },
    showDirect() {
      this.submitBtn.isDisabled = true;
      this.submitBtn.isSuccess = true;
      this.submitBtn.text = '跳转中...'
    },
    reset() {
      this.submitBtn.isDisabled = false
      this.submitBtn.text = this.submitBtnText
    },
    getBootstraptModal() {
      return new bootstrap.Modal('#' + this.id)
    }
  }
}
</script>

<style scoped>

.modal-header {
  justify-content: center !important;
}

.modal-header-image {
  width: 13rem;
}

@media screen and (max-width: 900px) {

  .modal-main {
    display: flex;
  }

  .modal-body {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .modal-header-image {
    width: 12rem;
    margin-left: 2rem;
  }

  .modal-header {
    border-bottom: 0px !important;
  }
}
</style>
