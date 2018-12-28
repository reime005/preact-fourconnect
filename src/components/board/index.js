import { h } from 'preact';
import style from './style';
import Row from '../row';

const Board = ({ cells, onClick, rowsCount = 7 }) => {
	const rows = [];
	let row = [];

	//TODO: [mr] map?
	cells.forEach((cell, i) => {
		row.push(cell);

		if (i % rowsCount === (rowsCount - 1)) {
			rows.push(<Row key={rows.length} row={row} onClick={onClick} />);
			row = [];
		}
	});

	console.warn(rows);
	
	return (
		<div style={style.container}>
			{rows}
		</div>
	);
};

export default Board;
