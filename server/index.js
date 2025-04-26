import { WebSocketServer } from "./src/network/websocket_server";

const wss = new WebSocketServer(8080)
wss.