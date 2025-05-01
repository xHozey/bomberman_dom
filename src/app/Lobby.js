import { SimpleJS } from "../framework/index.js"
import { Chat } from "./chat.js"
import { Forbidden } from "./forbidden.js"

export const Lobby = () => {
    return (

        SimpleJS.state.currentPage == "/lobby" ?
            SimpleJS.createElement("div", { class: "body q container-body" }, [
                Chat(),
                SimpleJS.createElement("div", { class: "" }, [
                    SimpleJS.createElement("h2", { class: "" }, [
                        `${SimpleJS.state.playerCount} players`
                    ]),
                    SimpleJS.createElement("h6", { class: "" }, [
                        `${SimpleJS.state.timer != undefined ? `starting in ${SimpleJS.state.timer}` : "waiting..."}`
                    ])
                ])
            ])
            : Forbidden()
    )
}
