import { jsx } from "../src/framework.js";
import { waiting } from "../js/game.js";
import { connectToGameServer } from "../js/socket.js";

export const Ref = {
  gameCanvasRef: { current: null },
  livesRef: { current: null },
  playersRef: { current: null },
  chatRef: { current: null },
  inputRef: { current: null },
  buttonRef: { current: null },
  messagesRef: { current: null },
  hearts: { current: null },
  StatusRef: { current: null },
  notificationsRef: { current: null },
  popupRef: { current: null },
  gamePageRef: { current: null },
};
export function GamePage() {
  return jsx(
    "div",
    { ref: Ref.gamePageRef },

    jsx("div", {
      id: "power-notifications",
      ref: Ref.notificationsRef,
      style:
        "position: absolute; top: 70px; right: 20px; z-index: 100; width: 250px;",
    }),

    jsx("div", {
      style: "display: none;",
      id: "popup-msg",
      ref: Ref.popupRef,
    }),

    // Content Container
    jsx(
      "div",
      { className: "content-container" },
      // Left Sidebar
      jsx(
        "aside",
        { className: "sidebar" },
        jsx(
          "div",
          { className: "sidebar-content" },
          jsx(
            "div",
            { className: "sidebar-section lives-section" },
            jsx(
              "div",
              { id: "playerlives" },
              jsx("p", { id: "lives", ref: Ref.livesRef }, "Lives :")
            ),
            jsx(
              "div",
              { id: "hearts", ref: Ref.hearts },
              jsx("img", {
                src: "../images/heart.png",
                alt: "Heart",
                className: "heart-icon",
              }),
              jsx("img", {
                src: "../images/heart.png",
                alt: "Heart",
                className: "heart-icon",
              }),
              jsx("img", {
                src: "../images/heart.png",
                alt: "Heart",
                className: "heart-icon",
              })
            )
          ),
          jsx("div", {
            className: "sidebar-section players-section",
            id: "players",
            ref: Ref.playersRef,
          })
        )
      ),

      jsx(
        "main",
        { className: "game-area" },
        jsx(
          "div",
          { className: "game-container" },
          jsx("div", {
            className: "game-canvas",
            id: "game",
            ref: Ref.gameCanvasRef,
          })
        )
      ),
      // Sidebar Chat Area
      jsx(
        "aside",
        { className: "chat-sidebar" },
        // Message Container
        jsx("div", { className: "message-container", ref: Ref.messagesRef }),
        // Chat Input Area
        jsx(
          "div",
          { className: "chat-input-area" },
          jsx("input", {
            type: "text",
            className: "chat-input",
            placeholder: "Type a message...",
            ref: Ref.chatRef,
          }),
          jsx(
            "button",
            { className: "send-button", ref: Ref.buttonRef },
            "Send"
          )
        )
      )
    )
  );
}

// Game state variable
export let gameState = {
  name: "",
  playerCount: 0,
};

// LoginPage component
export function LoginPage() {
  function handleNameInput(event) {
    gameState.name = event.target.value;
  }

  function handleLogin(event) {
    if (gameState.name.trim()) {
      connectToGameServer(gameState.name);
      waiting(event.target.parentNode);
    }
  }

  return jsx(
    "div",
    { id: "login" },
    jsx("h1", {}, "Bomber Man"),
    jsx("p", { id: "cont" }),
    jsx(
      "div",
      { id: "input" },
      jsx("input", {
        type: "text",
        id: "name",
        placeholder: "Enter your Name",
        onInput: handleNameInput,
      }),
      jsx(
        "button",
        {
          id: "NameBut",
          onClick: handleLogin,
          className: "login-button",
        },
        "Join Game"
      )
    )
  );
}
