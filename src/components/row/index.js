import { h } from 'preact';
import style from './style';
import Cell from '../cell';
import { boardSize } from '../../const/boardConfig';

const Row = ({ i, row, onClick, onMouseOver, columnSelected, playersTurn }) => {
	return(
	<div class={style.container}>
		{
			row.map((cell, columnId) => {
				return(
				<Cell
					i={(Number(i) - boardSize.rows) + Number(columnId)}
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
