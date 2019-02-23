import { h } from "preact";
import Row from "../row";
import * as style from "./style.css";

interface BoardProps {
  cells: number[];
  onClick: Function;
  onMouseOver: Function;
  columnSelected: number;
  playersTurn: boolean;
}

export const Board = (props: BoardProps) => {
  const rows: JSX.Element[] = [];
  let row: number[] = [];

  // TODO: [mr] map? or work with css-grid
  Object.keys(props.cells).forEach((i) => {
    const cell: number = props.cells[i];

    row.push(cell);

    if (Number(i) % 7 === 6) {
      rows.push(
        <Row
          i={i}
          row={[...row]}
          columnSelected={props.columnSelected}
          playersTurn={props.playersTurn}
          onClick={props.onClick}
          onMouseOver={props.onMouseOver}
        />,
      );
      row = [];
    }
  });

  return <div class={style.container}>{rows}</div>;
 };

export default Board;
