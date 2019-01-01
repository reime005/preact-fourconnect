import { h, Component } from 'preact';
import style from './style';
import { playerToCellColor, playerToCellSelectedColor } from '../../lib/playerConvert';

class Cell extends Component {
	onCellClick() {
		console.warn(this.props.i);
		console.warn(typeof this.props.i);
		
		this.props.onClick(this.props.i);
	}

	onMouseOver(e) {
		this.props.onMouseOver(this.props.column);
	}

	constructor(props) {
		super(props);

		this.onCellClick = this.onCellClick.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
	}

	render({ i, columnIsSelected, player, playersTurn }) {
		return (
			<div
				key={`cell-${i}`}
				class={style.container}
				// style={{
				// 	pointerEvents: disabled ? '' : 'mouse'
				// }}
				onMouseEnter={this.onMouseOver}
				onClick={this.onCellClick}
				>
				<div
					class={style.cell}
					style={{
						backgroundColor: columnIsSelected ? playerToCellSelectedColor(player) : playerToCellColor(player)
					}}
				/>
			</div>
		);
	}
}

export default Cell;
