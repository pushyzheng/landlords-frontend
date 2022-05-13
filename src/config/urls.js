// let host = "landlord.pushy.site/api";
let host = "localhost:8080";

let domain = 'http://' + host;

export default {
  auth: {
    login: domain + '/login',
    qqLogin: domain + '/qqLogin'
  },
  users: {
    update: domain + '/users',
    myself: domain + '/users/myself'
  },
  player: {
    myCards: domain + '/player/cards',
    isPlayerRound: domain + '/player/round',
    isReady: domain + '/player/ready',
    canPass: domain + '/player/pass',
    canBid: domain + '/player/bidding'
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
