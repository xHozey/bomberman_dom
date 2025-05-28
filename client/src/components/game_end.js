import { Div, Span } from "../../mostJS/index.js";

const GameEnd = ({ data }) => {
  return Div({}, [
    Span({}, data.nickname),
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
