import { Main, App } from "./app.js";
import { addRoutes } from "../core/router.js";

addRoutes({
  "/": Main,
  "/app": App,
});
