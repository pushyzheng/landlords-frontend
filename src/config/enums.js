export default {

  roomStatus: {
    playing: 'PLAYING',
    preparing: 'PREPARING'
  },

  identity: {
    landlord: 'LANDLORD',
    farmer: 'FARMER'
  },

  cardType: {
    pade: 'PADE',
    heart: 'HEART',
    club: 'CLUB',
    diamond: 'DIAMOND',
  },

  wsType: {
    readyGame: "READY_GAME",
    unReadyGame: 'UNREADY_GAME',
    startGame: "START_GAME",
    gameEnd: 'GAME_END',
    playCard: 'PLAY_CARD',
    pass: 'PASS',

    playerJoin: "PLAYER_JOIN",
    playerExit: "PLAYER_EXIT",
    bid: 'BID',
    bidEnd: 'BID_END',

    pleasePlayCard: 'PLEASE_PLAY_CARD',

    chat: 'CHAT',

    pong: 'PONG'
  }

}
