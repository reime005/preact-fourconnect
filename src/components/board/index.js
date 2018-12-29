import { h } from 'preact';
import style from './style';
import Row from '../row';

const Board = ({ cells, onClick, rowsCount = 7, columnSelected, onMouseOver, playersTurn }) => {
	const rows = [];
	let row = [];

	//TODO: [mr] map?
	cells.forEach((cell, i) => {
		row.push(cell);

		if (i % rowsCount === (rowsCount - 1)) {
			rows.push(<Row row={row} columnSelected={columnSelected} playersTurn={playersTurn} onClick={onClick} onMouseOver={onMouseOver} />);
			row = [];
		}
	});

	return (
		<div class={style.container}>
			{rows}
		</div>
	);
};

export default Board;
