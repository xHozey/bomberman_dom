import WebSocketServer from "./src/network/websocket_server.js";
const wss = new WebSocketServer(8080).SetupEventsHandler()
