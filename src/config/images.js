import enums from './enums'

const STATIC_IMAGES_PATH = 'static/images'

export default {
  getPlayerAvatar: player => {
    if (player == null || player == undefined) {
      return STATIC_IMAGES_PATH + '/default-avatar.png'
    }
    if (player.identity == undefined) {
      return player.user.avatar
    }
    if (player.identity == enums.identity.farmer) {
      return STATIC_IMAGES_PATH + '/role-farmer.png'
    } else {
      return STATIC_IMAGES_PATH + '/role-landlord.png'
    }
  }
}
