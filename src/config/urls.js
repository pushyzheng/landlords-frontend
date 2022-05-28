import utils from "./utils";

const STORATE_SERVER_DOMAIN_KEY = "serverDomain"

const defaultDomain = "api.landlords.pushyzheng.com";
// const defaultDomain = "localhost:8080";

function getDomain() {
  let storage = localStorage.getItem(STORATE_SERVER_DOMAIN_KEY);
  return utils.isEmpty(storage) ? defaultDomain : storage;
}

function getBaseurl() {
  return 'http://' + getDomain()
}

export default {
  domain() {
    return getDomain()
  },
  setDomain(domain) {
    localStorage.setItem(STORATE_SERVER_DOMAIN_KEY, domain)
  },
  auth: {
    login: getBaseurl() + '/login',
    qqLogin: getBaseurl() + '/qqLogin'
  },
  users: {
    update: getBaseurl() + '/users',
    myself: getBaseurl() + '/users/myself'
  },
  player: {
    myCards: getBaseurl() + '/player/cards',
    isPlayerRound: getBaseurl() + '/player/round',
    isReady: getBaseurl() + '/player/ready',
    canPass: getBaseurl() + '/player/pass',
    canBid: getBaseurl() + '/player/bidding'
  },
  rooms: {
    listRoom: getBaseurl() + '/rooms',
    getRoomById(id) {
      return getBaseurl() + `/rooms/${id}`
    },
    create: getBaseurl() + '/rooms',
    join: getBaseurl() + '/rooms/join',
    exit: getBaseurl() + '/rooms/exit'
  },
  game: {
    ready: getBaseurl() + '/games/ready',
    unReady: getBaseurl() + '/games/unReady',
    myCards: getBaseurl() + '/games/cards',
    bid: getBaseurl() + '/games/bid',
    play: getBaseurl() + '/games/play',
    pass: getBaseurl() + '/games/pass'
  },
  chat: {
    send: getBaseurl() + "/chat"
  },
  achievement: {
    getAchievementByUser: (id) => {
      return getBaseurl() + '/achievement/' + id
    }
  },
  ws: {
    connect(token) {
      return `ws://${getDomain()}/ws?token=${token}`
    }
  }
}
