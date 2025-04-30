import { DOM } from "./dom.js";

export default function NotFound() {
  return DOM.Jsx(
    "div",
    { className: "container" },
    DOM.Jsx(
      "div",
      { className: "error-content" },
      DOM.Jsx("h1", {}, "404"),
      DOM.Jsx("p", {}, "Oops! The page you are looking for does not exist"),
      DOM.Jsx("Link", { href: "/" }, "Go to Homepage")
    )
  );
}
