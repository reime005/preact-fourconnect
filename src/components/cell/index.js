import { h, Component } from "preact";
import style from "./style";
import {
  playerToCellColor,
  playerToCellSelectedColor
} from "../../lib/playerConvert";
import { boardSize } from "../../const/boardConfig";

class Cell extends Component {
  onCellClick() {
    this.props.onClick(this.props.column);
  }

  onMouseOver(e) {
    this.props.onMouseOver(this.props.column);
  }

  constructor(props) {
    super(props);

    this.onCellClick = this.onCellClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  render({ playersTurn, i, columnIsSelected, player, column }) {
    return (
      <div
        key={`cell-${i}`}
        class={style.container}
        // style={{
        // 	pointerEvents: disabled ? '' : 'mouse'
        // }}
        onMouseEnter={this.onMouseOver}
        onClick={this.onCellClick}
      >
        <div
          class={style.cell}
          style={{
            backgroundColor: columnIsSelected
              ? playerToCellSelectedColor(player)
              : playerToCellColor(player)
          }}
        >
          {/* {`${i}`} */}
        </div>
      </div>
    );
  }
}

export default Cell;
