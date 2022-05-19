import enums from './enums'
import utils from './utils'

const STATIC_IMAGES_PATH = 'static/images'
const TABLE_BG_IMAGES_PATH = STATIC_IMAGES_PATH + '/table'

const DEFAULT_AVATAR = STATIC_IMAGES_PATH + '/default-avatar.png'

const tableBackgroundImages = [
  'table-background.jpg',
  'table-background-2.jpg',
  'table-background-3.jpg',
]

let join = (dir, filename) => `${dir}/${filename}`

export default {
  getUserAvatar: user => {
    if (utils.isNull(user) || utils.isEmpty(user)) {
      return DEFAULT_AVATAR
    }
    return user.avatar
  },
  /**
   * 如果存在地主或农民身份的话, 返回身份头像
   * 否则返回用户头像
   * 如果用户头像为空, 则返回默认头像
   */
  getPlayerAvatar: player => {
    if (player == null || player == undefined || utils.isEmpty(player.user.avatar)) {
      return DEFAULT_AVATAR
    }
    if (player.identity == undefined) {
      return player.user.avatar
    }
    if (player.identity == enums.identity.farmer) {
      return STATIC_IMAGES_PATH + '/role-farmer.png'
    } else {
      return STATIC_IMAGES_PATH + '/role-landlord.png'
    }
  },
  getTableBackgroundImages: () => {
    let result = []
    tableBackgroundImages.forEach(filename => {
      result.push(join(TABLE_BG_IMAGES_PATH, filename))
    })
    return result
  },
  getTableBackgroundImageById: typeId => {
    let selected = localStorage.getItem('selectedTableBackgroundImage')
    if (!utils.isEmpty(selected)) {
      return join(TABLE_BG_IMAGES_PATH, tableBackgroundImages[selected])
    }
    let filename = tableBackgroundImages[typeId]
    if (utils.isEmpty(filename)) {
      filename = tableBackgroundImages[0]
    }
    return join(TABLE_BG_IMAGES_PATH, filename)
  }
}
