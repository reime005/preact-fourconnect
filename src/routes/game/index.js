import { h, Component } from 'preact';
import style from './style';
import GameView from '../../components/game';

export default class Game extends Component {
	state = {
	};

	// gets called when this route is navigated to
	componentDidMount() {
		//TODO: [mr] move cells construction to here?
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
	}

	render({ cells }, { }) {
		return (
			<div class={style.container}>
				<GameView cells={cells} />
			</div>
		);
	}
}
