class ChatService {
  constructor(players) {
    this.players = players;
  }

  sendMessage(sender, message) {
    this.players.forEach((p) => {
      if (sender.id != p.id) {
        p.socket.send(
          JSON.stringify({
            nickname: sender.nickname,
            message,
          })
        );
      }
    });
  }
}

export default ChatService;
