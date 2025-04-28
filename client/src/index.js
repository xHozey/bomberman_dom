import { render } from "../core/dom.js";
import { App, Main } from "./app.js";
import { addRoutes } from "../core/router.js";

addRoutes({
    "/test": Main,
})

render(App);
