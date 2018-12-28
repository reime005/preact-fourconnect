import { h, Component } from 'preact';
import style from './style';
import { playerToCellColor } from '../../lib/playerConvert';

class Cell extends Component {
	onCellClick() {
		this.props.onClick(this.props.i);
	}

	constructor(props) {
		super(props);

		this.onCellClick = this.onCellClick.bind(this);
	}

	render({ i, key, disabled, player, onClick }) {
		return (
			<div
				class={style.container}
				style={{
					pointerEvents: disabled ? '' : 'mouse'
				}}
				onClick={this.onCellClick}
			>
				<div
					class={style.cell}
					style={{
						backgroundColor: playerToCellColor(player)
					}}
				/>
			</div>
		);
	}
}

export default Cell;
