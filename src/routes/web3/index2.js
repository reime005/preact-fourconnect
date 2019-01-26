import { h, Component } from "preact";
import { Drizzle, generateStore } from "drizzle";

import style from "./style";
import drizzleOptions from "../../const/drizzleOptions";
import getWeb3 from "../../helpers/web3/getWeb3";
import { delay } from "core-js";
import FourConnectListener from "../../helpers/web3/FourConnectListener";
import { Board } from "../../components/board/board";

class Web3 extends Component {
  state = {
    cells: []
  };

  constructor(props) {
    super(props);

    this.fourConnectListener = null;

    this.startPolling = this.startPolling.bind(this);
    this.initialize = this.initialize.bind(this);
    this.send = this.send.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.getState = this.getState.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.makeMove = this.makeMove.bind(this);
  }

  async componentDidMount() {
    this.initialize();
  }

  componentWillUnmount() {
    clearInterval(this.poll);
  }

  async initialize() {
    if (typeof process === "undefined") {
      return;
    }
    this.fourConnectListener = new FourConnectListener({
      options: { gameMode: "new", drizzleOptions }
    });

    let web3;

    try {
      web3 = await this.fourConnectListener.start();
    } catch (e) {
      console.error(e);
    }

    const accounts = await web3.eth.getAccounts();
    this.setState({ accounts, initialized: true });

    // const drizzleStore = generateStore(drizzleOptions);
    // this.drizzle = new Drizzle(drizzleOptions, drizzleStore);

    // if (web3) {
    //   this.startPolling();
    // }

    // await delay(2000);

    // this.drizzle.contracts.FourConnect.events.allEvents({}, (error, event) => {
    //   if (error) {
    //     console.warn(error);
    //   }
    //   console.warn(event);
    // });
  }

  async send() {
    // const currentTx = this.drizzle.contracts.FourConnect.methods.makeMove.cacheSend(0, 0);
    try {
      const stackId = await this.fourConnectListener.cacheSend("newGame", {
        from: this.state.accounts[0]
      });

      this.setState({ stackId });
    } catch (e) {
      console.warn(e);
    }
  }

  async joinGame(id) {
    try {
      const stackId = await this.fourConnectListener.cacheSend("joinGame", id, {
        from: this.state.accounts[0]
      });

      this.setState({ stackId });
    } catch (e) {
      console.warn(e);
    }
  }

  async makeMove(id) {
    try {
      const stackId = await this.fourConnectListener.cacheSend(
        "makeMove",
        id,
        0,
        {
          from: this.state.accounts[0]
        }
      );

      this.setState({ stackId });
    } catch (e) {
      console.warn(e);
    }
  }

  async retrieve() {
    const status = await this.fourConnectListener.getStatus(
      this.state.stackId || 0
    );
    console.warn(status);
  }

  async getState() {
    try {
      this.setState({
        cells: await this.fourConnectListener.callMethod("getBoard", 0)
      });
    } catch (e) {
      console.warn(e);
    }
  }

  startPolling() {
    this.poll = setInterval(() => {
      const state =
        (this.drizzle && this.drizzle.store && this.drizzle.store.getState()) ||
        {};

      this.setState({ initialized: state.drizzleStatus.initialized });

      if (state.drizzleStatus.initialized) {
        this.setState({ methods: this.drizzle.contracts.FourConnect.methods });
        // console.log(this.drizzle.contracts.FourConnect.methods)
      }

      // console.log(this.drizzle.store.getState());
      // console.log(this.drizzle.contracts);
    }, 500);
  }

  render({}, { initialized, methods, accounts, cells }) {
    return (
      <div style={{ paddingTop: 65, flex: 1 }}>
        <h1>{initialized ? "initialized" : "..."}</h1>
        <h1>{initialized && accounts ? accounts[0] : ""}</h1>

        <button onClick={this.send}>send</button>
        <button onClick={this.retrieve}>retrieve</button>
        <button onClick={this.getState}>state</button>
        <button onClick={() => this.joinGame(0)}>join</button>
        <button onClick={() => this.makeMove(0)}>makeMove</button>

        {cells && (
          <div>
            <p>{JSON.stringify(cells)}</p>

            <Board
              cells={cells}
              onClick={this.makeMove}
              rowsCount={7}
              playersTurn={true}
              onMouseOver={() => {}}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Web3;
