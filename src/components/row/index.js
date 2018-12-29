import { h } from 'preact';
import style from './style';
import Cell from '../cell';

const Row = ({ key, row, onClick, onMouseOver, columnSelected, playersTurn }) => (
	<div key={key} class={style.container}>
		{
			row.map((cell, column) => (
				<Cell
					{...cell}
					columnIsSelected={columnSelected === column}
					playersTurn={playersTurn}
					onClick={onClick}
					onMouseOver={onMouseOver}
					column={column}
				/>)
			)
		}
	</div>
);

export default Row;
