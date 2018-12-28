import { h, Component } from 'preact';
import style from './style';
import Board from '../board';
import { players, CELL_SUM, boardSize } from '../../const/boardConfig';

class GameView extends Component {
	onCellClick(cellIndex) {
		console.log(cellIndex);
	}

	constructor(props) {
		super(props);

		let cells = [];
		let hasAI = true;
		let rowsCount = boardSize.rows;
		
		
		if (props.cells) {
			cells = props.cells.map(cell => cell);
			hasAI = false;
		}
		else {
			Array.from({ length: CELL_SUM }, (x, i) => cells.push({ i, player: players.NONE }));
		}

		if (props.rowsCount) {
			rowsCount = props.rowsCount;
		}

		this.state = {
			cells,
			hasAI,
			rowsCount
		};

		this.onCellClick = this.onCellClick.bind(this);
	}

	render({ }, { cells }) {

		return (
			<div class={style.container}>
				<Board cells={cells} onClick={this.onCellClick} />
			</div>
		);
	}
}

export default GameView;
