import { Ref } from "./utils.js"

function notificationPower(data) {
    let notificationsEle = Ref.notificationsRef.current;
    if (!notificationsEle) return;

    // let notification = jsx("div", { className: "power-notification"})

    if (data.bombPower) {
        notificationsEle.innerHTML = "💣 Bomb Power increased!";
        notificationsEle.style.borderLeft = "4px solid #ff6b6b";
    } else if (data.speed) {
        notificationsEle.innerHTML = "⚡ Speed boost activated!";
        notificationsEle.style.borderLeft = "4px solid #4ecdc4";
    } else if (data.fire) {
        notificationsEle.innerHTML = "🔥 Fire Range increased!";
        notificationsEle.style.borderLeft = "4px solid #ffa502";
    } else {
        return;
    }

    setTimeout(() => {
        // notificationsEle.removeChild(elementToRemove);
        notificationsEle.innerHTML = "";
    }, 3000);
}
function powerupCollected(data) {
    const canvas = Ref.gameCanvasRef.current;
    const tileElement = Selectbyrowcol(
        canvas,
        data.position.row,
        data.position.col
    );
    if (tileElement) {
        tileElement.innerHTML = "";
    }
}

export {
    notificationPower,
    powerupCollected
}