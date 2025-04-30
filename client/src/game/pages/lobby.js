import { Div, H1 } from "../../../core/components.js";
import { useState } from "../../../core/state.js";

class Lobby {
  constructor(players, timeLeft = null) {
    this.players = players;
    this.timeLeft = timeLeft;
    this.intervalId = null;
  }

  render() {
    const [time, setTime] = useState(this.timeLeft);

    // if (this.players.length > 1 && time !== null && this.intervalId === null) {
    //   this.intervalId = setInterval(() => {
    //     setTime((prev) => {
    //       if (prev <= 1) {
    //         clearInterval(this.intervalId);
    //         this.intervalId = null;
    //         return 0;
    //       }
    //       return prev - 1;
    //     });
    //   }, 1000);
    // }

    return Div({ class: "lobby" }, [
      H1({className: "lobbyTitle"}, `Lobby ${this.players}/4`),
      // `${this.players}/4`,
      this.players > 1 && time !== null
        ? Div({ class: "timer" }, `Game starts in: ${time}s`)
        : Div({className: "waiting"}, "Waiting for more players..."),
    ]);
  }
}

export default Lobby;
