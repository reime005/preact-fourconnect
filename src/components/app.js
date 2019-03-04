import { h, Component } from "preact";
import { Router, route } from "preact-router";
import createHashHistory from "history/createHashHistory";

import Header from "./header";

import Home from "../routes/home";
import Game from "../routes/game";
import Web3 from "../routes/web3/index";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.onNewGame = this.onNewGame.bind(this);
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

  render({}, { isOnline }) {
    return (
      <div id="app">
        <div id="container">
          <Header isOnline={isOnline} />
          <Router onChange={this.handleRoute} history={createHashHistory()}>
            <Home onNewGame={this.onNewGame} path="/" />
            <Game path="/game" />
            <Web3 path="/web3" />
          </Router>
        </div>
      </div>
    );
  }
}
