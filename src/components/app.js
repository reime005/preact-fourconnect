import { h, Component } from 'preact';
import { Router, route } from 'preact-router';

import Header from './header';

// Code-splitting is automated for routes
import Home from '../routes/home';
import Profile from '../routes/profile';
import Game from '../routes/game';

export default class App extends Component {
	state = {
		isAuthentified: false,
		isRunning: true
	}

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		route('/game');
	};

	render({ isRunning }) {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home changeName={this.changeName} name={name} path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<Game isRunning={isRunning} path="/game" />
				</Router>
			</div>
		);
	}
}
