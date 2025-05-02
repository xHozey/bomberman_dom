import { Ref } from "./utils.js"
import { MyEventSystem } from "../src/event.js";

function chat(nickname) {
    const sendButton = Ref.buttonRef.current;
    MyEventSystem.addEventListener(sendButton, "click", () => {
        sendMessage(nickname);
    });
}
function sendMessage(nickname) {
    const messageText = Ref.chatRef.current.value.trim();
    if (messageText !== "") {
        socket.send(
            JSON.stringify({
                type: "chatMsg",
                nickname: nickname,
                messageText: messageText,
            })
        );
        Ref.chatRef.current.value = "";
    }
}
function displayMsg(data) {
    const messageContainer = Ref.messagesRef.current;

    const newMessage = jsx(
        "div",
        { className: "message" },
        jsx("div", { className: "player-name" }, data.nickname),
        jsx("div", { className: "message-text" }, data.messageText)
    );
    messageContainer.appendChild(createElement(newMessage));
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
export {
    chat,
    sendMessage,
    displayMsg
}