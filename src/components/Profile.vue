<template>
  <div>
    <div class="offcanvas offcanvas-end" tabindex="-1"
         id="offcanvasRight"
         aria-labelledby="offcanvasRightLabel">

      <div class="offcanvas-header">
        <h5 id="offcanvasRightLabel">个人信息</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div style="display: flex;justify-content: center">
          <img :src="profile.avatar" alt="" id="profile-avatar">
        </div>
        <br><br>
        <div class="mb-3">
          <label for="username" class="form-label">用户名</label>
          <input type="text" class="form-control" id="username" v-model="profile.username">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">密码</label>
          <input type="text" class="form-control" id="password" v-model="profile.password">
        </div>
        <div class="d-grid gap-2" id="submit-btn">
          <button class="btn btn-primary" type="button" @click="submitUpdate">
            更新资料
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "../components/Avatar";

export default {
  name: "Profile",
  components: {Avatar},
  data() {
    return {
      profile: {
        username: 'loading',
        password: 'loading',
        avatar: 'static/images/default-avatar.png',
        moeny: 0
      }
    }
  },
  created() {
    this.$http.get(this.$urls.users.myself)
      .then(response => {
          this.profile = response.data.data
          if (this.profile.avatar == null || this.profile.avatar.length == 0) {
            this.profile.avatar = 'static/images/default-avatar.png'
          }
        }
      );
  },
  mounted() {

  },
  methods: {
    submitUpdate() {
      this.$http.put(this.$urls.users.update, this.profile)
        .then(response => {
            alert('更新成功')
            console.log(response.data)
          }
        ).catch(error => {
          alert('更新失败')
      })
    }
  }
}
</script>

<style scoped>
#profile-avatar {
  border-radius: 75px;
  width: 150px;
}

#submit-btn {
  margin-top: 30px;
}
</style>
