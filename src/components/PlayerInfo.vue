<template>
  <div>
    <div v-if="achievement != null">
      <ul class="list-group">
        <li class="list-group-item player-popover">
          <img src="/static/images/money-bag.png" alt="" width="20px;">
          <span class="player-popover-text">金币: ¥{{ player.user.money }}</span>
        </li>

        <li class="list-group-item player-popover">
          <img src="/static/images/win-match.png" alt="" width="20px;">
          <span class="player-popover-text">胜场: {{ achievement.winMatch }}</span>
        </li>

        <li class="list-group-item player-popover">
          <img src="/static/images/fail-match.png" alt="" width="20px;">
          <span class="player-popover-text">败场: {{ achievement.failureMatch }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayerInfo",
  props: ['player'],
  data() {
    return {
      achievement: null
    }
  },
  created() {
    this.getAchievements();
  },
  methods: {
    getAchievements() {
      this.$http.get(this.$urls.achievement.getAchievementByUser(this.player.user.id))
        .then(response => {
          this.achievement = response.data.data
        })
        .catch(error => this.$notif.warning(error));
    }
  }
}
</script>

<style scoped>
.player-popover {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-popover-text {
  font-weight: 20px;
}
</style>
