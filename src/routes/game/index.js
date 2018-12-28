import { h, Component } from 'preact';
import style from './style';
import GameView from '../../components/game';

export default class Game extends Component {
	state = {
	};

	// gets called when this route is navigated to
	componentDidMount() {
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
	}

	render({ cells }, { }) {
		return (
			<GameView cells={cells} />
		);
	}
}
