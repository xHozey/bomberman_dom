class Socket {
    constructor(url) {
        this.url = url
        this.socket
    }

    connect() {
        if (this.socket === undefined) {
            this.socket = new WebSocket(this.url)
        }
        return this.socket
    }
}