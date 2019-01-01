import { h, Component } from 'preact';
import style from './style';
import Board from '../board';
import { players, CELL_SUM, boardSize } from '../../const/boardConfig';
import { nextPlayer } from '../../lib/nextPlayer';
import { makeMove, gameEnd, makeAIMove } from '../../lib/gameLogic';
import { GameEnd } from '../gameend';
import { initialGameState } from '../../const/initialState';
import { delay } from 'core-js';
import { newBoard } from '../../lib/newBoard';

class GameView extends Component {
	async _resetState() {
		let board = JSON.parse(localStorage.getItem('fourconnect.board'));

		if (board.isGameEnd) {
			board = null;
		}
		
		let hasAI = true;

		if (this.props.board) {
			board = this.props.board;
			hasAI = false;
		}

		if (!board) {
			if (!this.props.board) {
				board = newBoard(players.NONE);
			}
	
			//TODO: [mr] calc current/first player here
			board.currentPlayer = players.ONE;
		}

		this.setState({
			board,
			hasAI,
			rowsCount: boardSize.rows,
			columnSelected: -1,
			playersTurn: true,
		});

		if (hasAI && board.currentPlayer !== players.ONE) {
			await delay(Math.floor((Math.random() * 1500) + 500));
			
			board = await makeAIMove(board);

			this.setState({ board });
		}

		if (!this.props.board) {
			localStorage.setItem('fourconnect.board', JSON.stringify(board));
		}
	}

	componentDidUpdate() {
		if (!this.props.board) {
			localStorage.setItem('fourconnect.board', JSON.stringify(this.state.board));
		}
	}

	async onGameEndClick() {
		await delay(500);
		
		//await this.props.newGame(); --> new props
		this._resetState();
	}

	async onCellClick(column) {
		const nextFreeCell = (column, board) => {
			for (let i = CELL_SUM - boardSize.columns + column; i >= 0; i -= boardSize.columns) {
				if (board.cells[i] === players.NONE) {
					return i;
				}
			}

			throw 'No empty cells in this column';
		}

		await delay(150);

		try {
			if (this.state.board.isGameEnd) {
				throw 'Game has end';
			}

			if (this.state.board.currentPlayer !== players.ONE) {
				throw 'Not your turn';
			}

			const cellIndex = nextFreeCell(column, this.state.board);

			let board = makeMove(this.state.board, players.ONE, cellIndex);

			board = gameEnd(cellIndex, board, players.ONE);

			this.setState({
				board,
			}, async() => {
				if (!board.isGameEnd && this.state.hasAI && board.currentPlayer === players.TWO) {
					await delay(Math.floor((Math.random() * 1500) + 500));
	
					board = makeAIMove(board);
	
					this.setState({ board });
				}
			});
		} catch (error) {
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
		
		this.state = initialGameState;

		this._resetState = this._resetState.bind(this);
		this.onGameEndClick = this.onGameEndClick.bind(this);
		this.onCellClick = this.onCellClick.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
	}

	componentDidMount() {
		this._resetState();
	}

	render({ }, { board, columnSelected, playersTurn }) {

		return (
			<div class={style.container}>
					<Board 
						cells={board.cells || []} 
						onClick={this.onCellClick} 
						columnSelected={columnSelected} 
						playersTurn={playersTurn} 
						onMouseOver={this.onMouseOver} 
					/>
					<GameEnd 
						isGameEnd={board.isGameEnd} 
						won={playersTurn} 
						onGameEndClick={this.onGameEndClick}
					/>
			</div>
		);
	}
}

export default GameView;
