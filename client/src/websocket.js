class SocketServer {
  constructor(url) {
    this.ws = new WebSocket(url);
  }
  connect(name) {
    this.ws.send("");
  }

  socket(msg) {
    this.ws.send(msg);
  }
}

export default SocketServer;
