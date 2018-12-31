import { h } from 'preact';
import style from './style';
import Cell from '../cell';

const Row = ({ i, row, onClick, onMouseOver, columnSelected, playersTurn }) => {
	return(
	<div class={style.container}>
		{
			row.map((cell, columnId) => {
				return(
				<Cell
					i={(Number(i) - 6) + Number(columnId)}
					player={cell}
					columnIsSelected={columnSelected === columnId}
					playersTurn={playersTurn}
					onClick={onClick}
					onMouseOver={onMouseOver}
					column={columnId}
				/>)}
			)
		}
	</div>
)};

export default Row;
