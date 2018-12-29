import { h, Component } from 'preact';
import style from './style';
import { playerToCellColor, playerToColumnColor } from '../../lib/playerConvert';

class Cell extends Component {
	onCellClick() {
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
						backgroundColor: columnIsSelected ? playerToColumnColor(player) : playerToCellColor(player)
					}}
				/>
			</div>
		);
	}
}

export default Cell;
