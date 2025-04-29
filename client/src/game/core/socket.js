class Socket {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.listeners = {};
  }

  connect() {
    if (!this.socket) {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => {
        console.log("Connected to server");
      };

      this.socket.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          const type = data.type;
          if (this.listeners[type]) {
            this.listeners[type].forEach((cb) => cb(data));
          }
        } catch (err) {
          console.error("Invalid JSON:", err);
        }
      };
    }
    return this.socket;
  }

  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
}

export default Socket;
