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
	_resetState() {
		let board = {};
		let hasAI = true;

		if (this.props.board) {
			board = this.props.board;
			hasAI = false;
		} else {
			board = newBoard(players.NONE);
		}

		//TODO: [mr] calc current/first player here

		this.setState({
			board,
			hasAI,
			rowsCount: boardSize.rows,
			columnSelected: -1,
			playersTurn: true,
		});
	}

	async onGameEndClick() {
		await delay(500);
		
		//await this.props.newGame(); --> new props
		this._resetState();

		//tmp
		this.setState({isGameEnd: false})
	}

	async onCellClick(cellIndex) {
		await delay(250);

		try {
			if (this.state.board.isGameEnd) {
				throw 'Game has end';
			}

			let board = makeMove({ 
				...this.state.board,
				currentPlayer: players.ONE,//this.state.currentPlayer 
			},
			players.ONE, cellIndex);

			board = gameEnd(
			cellIndex, 
			{ 
				...board,
				currentPlayer: players.ONE
			},
			players.ONE);

			if (!board.isGameEnd && this.state.hasAI) {
				board = makeAIMove( 
					{ 
						...board,
						currentPlayer: players.TWO
					});
			}

			console.error(board.isGameEnd);

			this.setState({
				board,
			});
		} catch (error) {
			console.error(error);
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
						won={!playersTurn} 
						onGameEndClick={this.onGameEndClick}
					/>
			</div>
		);
	}
}

export default GameView;
