class Socket {
  constructor(url) {
    this.url = url;
    this.socket;
  }

  connect() {
    if (!this.socket) {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => {
        this.message();
      };
    }
    return this.socket;
  }

  send(data) {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  message() {
    this.socket.onmessage = (e) => {
      console.log(e.data);
    };
  }
}

export default Socket;
