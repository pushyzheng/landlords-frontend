let domain = "http://localhost";

export default {
  auth: {
    login: domain + '/login',
    qqLogin: domain + '/qqLogin'
  },
  users: {
    me: domain + '/users/me'
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
    myCards: domain + '/games/cards',
    bid: domain + '/games/bid',
    play: domain + '/games/play',
    pass: domain + '/games/pass'
  },
  ws: {
    connect(token) {
      return `ws://localhost/ws?token=${token}`
    }
  }

}
