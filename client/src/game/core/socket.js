class Socket {
  constructor(url) {
    this.url = url;
    this.socket;
  }

  connect() {
    if (!this.socket) {
      this.socket = new WebSocket(this.url);
    }
    return this.socket;
  }

  send(data) {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
}

export default Socket;
