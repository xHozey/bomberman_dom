import {
    updatePlayerCount,
    removePlayer,
    updateOtherPlayerPosition,
    updatePlayerStats,
    hearts,
    animationPlayerDead
} from "./player.js";
import { gameState, Ref } from "./utils.js"
// import {  } from "../src/router.js"
import { notificationPower } from "./powerups.js"
import { jsx } from "../src/framework.js";
import { render } from "../src/vdom.js";
import { startGame, destroyWall, broadcastPlayerInfo, powerupCollected } from "./game.js";
import { Game } from "./map.js"
import { drawBomb, removeBomb, drawExplosion } from "./bombs.js"
export let socket;
function connectToGameServer(name) {
    const host = window.location.hostname;
    socket = new WebSocket(`ws://${host}:8080`);
    socket.onopen = () => {
        console.log("Connected to WebSocket server");
        socket.send(
            JSON.stringify({
                type: "newPlayer",
                nickname: name,
            })
        );
    };
    socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        // console.log(data);
        handleServerMessages(data);
    };

    socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
    };
}

let tileMap;
function handleServerMessages(data) {
    const tileSize = 40;
    if (data.type == "startGame") {
        tileMap = new Game(tileSize, data);
    }
    switch (data.type) {
        case "updatePlayers":
            updatePlayerCount(data.playerCount, data.playerId, data.countP);
            break;
        case "startGame":
            startGame(data, tileMap);
            break;
        case "chatMsg":
            displayMsg(data);
            break;
        case "playerMove":
            updateOtherPlayerPosition(data);
            break;
        case "drawBomb":
            drawBomb(data.position.row, data.position.col);
            break;
        case "removeBomb":
            removeBomb(data.position.row, data.position.col);
            break;
        case "destroyWall":
            destroyWall(
                data.position.row,
                data.position.col,
                data.gift,
                data.index,
                data.frames
            );
            break;
        case "drawExplosion":
            drawExplosion(data.position.row, data.position.col, data.frames);
            break;
        case "HitByExplosion":
            socket.send(JSON.stringify(data));
            break;
        case "playerDead":
            animationPlayerDead(data);
            break;
        case "hearts":
            hearts(data);
            break;
        case "powerupCollected":
            powerupCollected(data);
            break;
        case "playerStatsUpdate":
            updatePlayerStats(data);
            notificationPower(data);
            break;
        case "brodcastplayerinfo":
            broadcastPlayerInfo(data);
            break;
        case "theWinnerIs":
            setTimeout(() => {
                socket.close();
            }, 5000);
            theWinnerIs(data);
            break;
        case "removePlayer":
            console.log("Player removed:", data.id);
            removePlayer(data.id);
            broadcastPlayerInfo(data);
            break;
        default:
            break;
    }
}

function theWinnerIs(data) {
    let gamepage = Ref.gamePageRef.current;
    const winScreen = jsx(
        "div",
        { id: "popup-msg", className: "popup", ref: Ref.popupRef },
        jsx("h2", {}, `🎉 The winner is: ${data.name} 🎉`),
        jsx(
            "button",
            {
                className: "play-again-btn",
                onclick: (e) => {
                    gameState.name = "";
                    e.preventDefault();
                    router.navigate("/");
                },
            },
            "Play Again"
        )
    );
    render(winScreen, gamepage);
}

export {
    connectToGameServer,
    handleServerMessages,
    theWinnerIs
}