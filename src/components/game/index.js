import { h, Component } from 'preact';
import style from './style';
import Board from '../board';
import { players, CELL_SUM, boardSize } from '../../const/boardConfig';
import { nextPlayer } from '../../lib/nextPlayer';
import { makeMove, gameEnd } from '../../lib/gameLogic';

class GameView extends Component {
	onCellClick(cellIndex) {
		try {
			const { cells, currentPlayer } = makeMove({ 
				cells: this.state.cells, 
				currentPlayer: this.state.currentPlayer 
			}, cellIndex);

			const isGameEnd = gameEnd({ 
				cells: this.state.cells, 
				currentPlayer: this.state.currentPlayer 
			});

			this.setState({
				cells,
				currentPlayer,
				isGameEnd,
			});
			 
		} catch(error) {
			this.setState({ error });
		}
	}

	onMouseOver(columnSelected) {
		const { playersTurn, currentPlayer } = this.state;

		if (!playersTurn) {
			return;
		}

		if (this.props.onMouseOver) {
			this.props.onMouseOver(columnSelected, currentPlayer);
		} else {
			this.setState({ columnSelected, currentPlayer: nextPlayer(currentPlayer) })
		}
		
		this.setState({ columnSelected });
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
			rowsCount,
			columnSelected: -1,
			currentPlayer: players.ONE,
			playersTurn: true,
			isGameEnd: false,
		};

		this.onCellClick = this.onCellClick.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
	}

	render({ }, { cells, columnSelected, playersTurn }) {

		return (
			<div class={style.container}>
				<Board cells={cells} onClick={this.onCellClick} columnSelected={columnSelected} playersTurn={playersTurn} onMouseOver={this.onMouseOver} />
			</div>
		);
	}
}

export default GameView;
