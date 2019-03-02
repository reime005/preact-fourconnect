import { h, Component } from "preact";
import style from "./style";
import GameView from "../../components/game";

export default class Game extends Component {
  // gets called when this route is navigated to

  // gets called just before navigating away from the route
  componentWillUnmount() {}

  render({ cells }, {}) {
    return (
      <div class={style.container}>
        <GameView cells={cells} />
      </div>
    );
  }
}
