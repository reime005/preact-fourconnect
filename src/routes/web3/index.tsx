import { Component, h } from 'preact';
// import Web3 from "web3";

// import { Button } from 'preact-material-components/ts/Button';
// import 'preact-material-components/Button/style.css';

import { Board } from '../../components/board/board';
import drizzleOptions from '../../const/drizzleOptions';
import FourConnectListener from '../../helpers/web3/FourConnectListener';
import { Selector } from '../../components/selector';
import { Dialog } from '../../components/dialog';
import { getBoardData } from '../../helpers/web3/getBoardData';

type Props = {

}

type State = {
  columnSelected: number,
  web3: any,
  opponentsAddress: string,
  createGameBidEth: string,
  joinGameBidEth: string,
  joinGameId: number,
  selectedGameId: number,
  stackId: number,
  accounts: any[],
  initialized: boolean,
  games: {
    [gameId: number]: {
      cells: number[],
      running: boolean,
      lastTimePlayed: Date,
      playerOne: string,
      playerTwo: string
      currentPlayer: number,
      bidPlayerOne: number,
      bidPlayerTwo: number,
    }
  },
  gameIds: any[],
  maxCreationTimeout: number,
  maxMoveTimeout: number,
}

class Web3Route extends Component<Props, State> {
  fourConnectListener: FourConnectListener;
  poll: any;
  joinGameDialogRef: any;
  newRestrictedGame: any;

  constructor(props) {
    super(props);

    this.state = {
      maxCreationTimeout: 0,
      maxMoveTimeout: 0,
      columnSelected: 0,
      web3: {},
      opponentsAddress: '',
      createGameBidEth: '',
      joinGameBidEth: '',
      joinGameId: -1,
      selectedGameId: -1,
      stackId: 0x0,
      accounts: [],
      games: {},
      gameIds: [],
      initialized: false,
    }

    this.fourConnectListener = new FourConnectListener({
      options: { gameMode: 'new', drizzleOptions }
    });
    
    // this.startPolling = this.startPolling.bind(this);
    this.initialize = this.initialize.bind(this);
    this.newGame = this.newGame.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.getState = this.getState.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.makeMove = this.makeMove.bind(this);
  }

  public async componentDidMount() {
    this.initialize();
  }

  public componentWillUnmount() {
    clearInterval(this.poll);
  }

  public async initialize() {
    if (typeof process === 'undefined') {
      return;
    }

    let web3, maxCreationTimeout, maxMoveTimeout;

    try {
      const data = await this.fourConnectListener.start();

      web3 = data.web3;
      maxCreationTimeout = data.maxCreationTimeout,
      maxMoveTimeout = data.maxMoveTimeout;
    } catch (e) {
      console.error(e);
    }

    const accounts = await web3.eth.getAccounts() || [];

    this.setState({ web3, accounts, initialized: true, maxCreationTimeout, maxMoveTimeout });
  }

  public async joinGame() {
    try {
      const openGameId = await this.fourConnectListener.callMethod('getOpenGameId');
      this.fourConnectListener.subscribeEvent('logGameStarted', (error: any, evt: any) => {
        console.warn(evt);
      },
      {filter: { gameId: [new String(openGameId)] }})

      await this.fourConnectListener.cacheSend('joinGame', openGameId, {
        from: this.state.accounts[0]
      });
    } catch (e) {
      console.warn(e);
    }
  }

  public async newGame() {
    try {
      const { web3, opponentsAddress, createGameBidEth }: State = this.state;

      if (opponentsAddress) {
        await this.fourConnectListener.cacheSend('newRestrictedGame', opponentsAddress, {
          from: this.state.accounts[0],
          value: web3.utils.toWei(createGameBidEth || '0', 'ether')
        });
      } else {
        await this.fourConnectListener.cacheSend('newGame', {
          from: this.state.accounts[0],
          value: web3.utils.toWei(createGameBidEth || '0', 'ether')
        });
      }
    } catch (e) {
      console.warn(e);
    }
  }

  public async makeMove(id: number) {
    try {
      const stackId = await this.fourConnectListener.cacheSend(
        'makeMove',
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

  public async retrieve() {
    const status = await this.fourConnectListener.getStatus(
      this.state.stackId || 0
    );
    console.warn(status);
  }

  public async getState() {
    try {
      let gameIds = await this.fourConnectListener.callMethod('getPlayersIds', this.state.accounts[0]);

      if (!gameIds.length) {
        throw 'No games yet attended';
      }

      gameIds = gameIds.map((gameId: string) => Number(gameId));

      let games = {};

      this.setState({
        selectedGameId: 0,
        gameIds
      });
      
      gameIds.forEach(async gameId => {
        try {
          const game = await getBoardData(this.fourConnectListener, gameId);
          games[gameId] = {...games[gameId], ...game };

          this.setState({
            games,
          });
        } catch (error) {
          console.warn(error);
        }
      });
    } catch (e) {
      console.warn(e);
    }
  }

  public render({}, { initialized, accounts, games, gameIds, selectedGameId, columnSelected }: State) {
    return (
      <div style={{ paddingTop: 65, flex: 1 }}>
        <h1>{initialized ? 'initialized' : '...'}</h1>
        <h1>{initialized && accounts ? accounts[0] : ''}</h1>

        <button onClick={() => this.getState()}>state</button>
        {/* <button onClick={() => this.createGame()}>create new game</button> */}
        <button onClick={() => {}}>claim timeout win</button>
        <button onClick={() => this.newRestrictedGame.MDComponent.show()}>new game</button>
        <button onClick={() => this.joinGameDialogRef.MDComponent.show()}>join</button>
        <button onClick={() => this.makeMove(0)}>makeMove</button>

        {gameIds.length ? 
          <div>
            <h2>Your games: </h2>

            <p>{JSON.stringify(gameIds)}</p>
            <Selector 
              chosenIndex={selectedGameId} 
              hintText={'GameIds'} 
              options={gameIds} 
              onChange={(e: Event & {target: EventTarget & {selectedIndex: number}}) => { 
                  this.setState({
                    selectedGameId: e.target.selectedIndex
                  })
                }
              } 
            />
          </div>
          : null
        }

        {games != {} ?
          <div>
            <p>{JSON.stringify(games)}</p>

            <Board
              cells={games[selectedGameId] ? games[selectedGameId].cells : []}
              columnSelected={columnSelected}
              onClick={(i: number) => console.warn(i)}
              playersTurn={true}
              onMouseOver={() => {}}
            />
          </div>
          : null
        }

        <Dialog
          setRef={joinGameDialogRef=> this.joinGameDialogRef=joinGameDialogRef }
          acceptText={'Join Game'}
          declineText={'Cancel'}
          onAccept={this.joinGame}
          headerText={'Join a new Game'}
          inputTexts={{
            gameId: {
              label: 'Specific Game ID? (optional)',
              onKeyUp: joinGameId => this.setState({ joinGameId: Number(joinGameId) }),
            },
            payment: {
              label: 'Your bid? (in ETH)',
              onKeyUp: joinGameBidEth => this.setState({ joinGameBidEth }),
            },
          }}
        />

        <Dialog
          setRef={newRestrictedGame => this.newRestrictedGame=newRestrictedGame }
          acceptText={'New restricted game'}
          declineText={'Cancel'}
          onAccept={this.newGame}
          headerText={'Create a new Game'}
          inputTexts={{
            gameId: {
              label: 'Opponent\' address? (optional)',
              onKeyUp: opponentsAddress => this.setState({ opponentsAddress }),
            },
            payment: {
              label: 'Your bid? (in ETH) (optional)',
              onKeyUp: createGameBidEth => this.setState({ createGameBidEth }),
            },
          }}
        />
      </div>
    );
  }
}

export default Web3Route;
