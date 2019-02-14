// let host = "api.landlord.pushy.site";
let host = "192.168.0.111";

let domain = 'http://' + host;

export default {
  auth: {
    login: domain + '/login',
    qqLogin: domain + '/qqLogin'
  },
  users: {
    myself: domain + '/users/myself'
  },
  player: {
    myCards: domain + '/player/cards',
    isPlayerRound: domain + '/player/round',
    isReady: domain + '/player/ready',
    canPass: domain + '/player/pass'
  },
  rooms: {
    listRoom: domain + '/rooms',
    getRoomById (id) {
      return domain + `/rooms/${id}`
    },
    create: domain + '/rooms',
    join: domain + '/rooms/join',
    exit: domain + '/rooms/exit'
  },
  game: {
    ready: domain + '/games/ready',
    unReady: domain + '/games/unReady',
    myCards: domain + '/games/cards',
    bid: domain + '/games/bid',
    play: domain + '/games/play',
    pass: domain + '/games/pass'
  },
  ws: {
    connect(token) {
      return `ws://${host}/ws?token=${token}`
    }
  }

}
