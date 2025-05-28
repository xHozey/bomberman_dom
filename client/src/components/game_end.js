import { Div, Span, Button } from "../../mostJS/index.js";


const GameEnd = ({ data }) => {
  return Div({}, [
    Span({}, data || "Unknown Winner"),
    Button(
      {
        onclick: () => {
          location.reload();
        },
      },
      "play again!"
    ),
  ]);
};

export default GameEnd;
