import { h } from 'preact';
import style from './style';
import Cell from '../cell';

const Row = ({ key, row, onClick }) => (
	<div key={key} class={style.container}>
		{
			row.map((cell) => (
				<Cell
					key={`${key}-${cell.i}`}
					{...cell}
					onClick={onClick}
				/>)
			)
		}
	</div>
);

export default Row;
