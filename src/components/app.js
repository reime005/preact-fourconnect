import { h, Component } from "preact";
import { Router, route } from "preact-router";

import Header from "./header";

// Code-splitting is automated for routes
import Home from "../routes/home";
import Profile from "../routes/profile";
import Game from "../routes/game";
import { OfflineListener } from "../helpers/offlineListener";
import Web3 from "../routes/web3/index";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthentified: false,
      isRunning: false,
      isOnline: false
    };

    this.onNewGame = this.onNewGame.bind(this);
  }
  componentDidMount() {
    this.offlineListener = new OfflineListener({
      onChange: isOnline => this.setState({ isOnline })
    });

    this.offlineListener.start();
  }

  componentWillUnmount() {
    this.offlineListener.stop();
  }

  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    if (!e.previous) {
      route("/web3", true);
    }
  };

  onNewGame() {
    this.setState({ isRunning: true }, () => {
      route("/game");
    });
  }

  render({}, { isOnline, isRunning, name }) {
    return (
      <div id="app">
        <div id="container">
          <Header isOnline={isOnline} />
          <Router onChange={this.handleRoute}>
            <Home
              isRunning={isRunning}
              onNewGame={this.onNewGame}
              changeName={this.changeName}
              name={name}
              path="/"
            />
            <Game isOnline={isOnline} path="/game" />
            <Web3 isOnline={isOnline} path="/web3" />
          </Router>
        </div>
      </div>
    );
  }
}
