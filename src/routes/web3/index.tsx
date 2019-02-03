import { Component, h } from 'preact';
// import Web3 from "web3";

// import { Button } from 'preact-material-components/ts/Button';
// import 'preact-material-components/Button/style.css';

import { Board } from '../../components/board/board';
import drizzleOptions, { fourConnectEvents } from '../../const/drizzleOptions';
import FourConnectListener from '../../helpers/web3/FourConnectListener';
import { Selector } from '../../components/selector';
import { Dialog } from '../../components/dialog';
import { getBoardData } from '../../helpers/web3/getBoardData';
import { nextFreeCell } from '../../lib/nextFreeCell';
import { getEtherInGame } from '../../lib/getEtherInGame';

type Props = {

}

type State = {
  columnSelected: number,
  web3: any,
  opponentsAddress: string,
  createGameBidEth: string,
  joinGameBidEth: string,
  joinGameId: number,
  chosenIndex: number,
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
      bidPlayerOne: string,
      bidPlayerTwo: string,
    }
  },
  gameIds: any[],
  selectedGameId: number,
  maxCreationTimeout: number,
  maxMoveTimeout: number,
  lastEvents: {
    [eventName: string]: {
      [blockNumber: string]: string
    }
  }
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
      chosenIndex: -1,
      stackId: 0x0,
      accounts: [],
      games: {},
      gameIds: [],
      initialized: false,
      lastEvents: {},
      selectedGameId: 0
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
    this.subscribeToEvent = this.subscribeToEvent.bind(this);
    this.initializeEventsForGames = this.initializeEventsForGames.bind(this);
    this.onCellClicked = this.onCellClicked.bind(this);
    this.refreshGame = this.refreshGame.bind(this);
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

    this.getState();
  }

  public async joinGame() {
    try {
      const openGameId = await this.fourConnectListener.callMethod('getOpenGameId');
      // this.fourConnectListener.subscribeEvent('logGameStarted', (error: any, evt: any) => {
      //   if (error) {
      //     console.error(error);
      //   }
      //   console.warn(evt);
      // },
      // {filter: { gameId: [new String(openGameId)] }})

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
    const { selectedGameId, accounts } = this.state;
    
    try {
      await this.fourConnectListener.cacheSend(
        'makeMove',
        selectedGameId,
        id,
        {
          from: accounts[0]
        }
      );
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

      this.setState({
        gameIds
      });
      
      gameIds.forEach(async gameId => {
        try {
          this.refreshGame(gameId);
        } catch (error) {
          console.warn(error);
        }
      });

      this.setState({
        chosenIndex: 0,
        selectedGameId: gameIds[0]
      });

      this.initializeEventsForGames();
    } catch (e) {
      console.warn(e);
    }
  }

  private async refreshGame(gameId: number) {
    const game = await getBoardData(this.fourConnectListener, gameId);

    const games = {
      ...this.state.games, 
      [gameId]: {
        ...this.state.games[gameId],
        ...game
      }
    };

    this.setState({
      games
    });
  }

  private onCellClicked(column: number) {
    const cellIndex = nextFreeCell(column, this.state.games[this.state.selectedGameId]);
    this.makeMove(cellIndex);
  }

  private initializeEventsForGames() {
    fourConnectEvents.forEach(eventName => {
      if (eventName === 'logGameInitialized') {
        this.subscribeToEvent(eventName, false);
      } else {
        this.subscribeToEvent(eventName, true);
      }
    });
  }

  private subscribeToEvent(eventName: string, useFilter: boolean) {
    let filter = {};

    if (useFilter) {
      filter = {
        gameId: [...this.state.gameIds.map(i => String(i))]
      }
    }

    this.fourConnectListener.subscribeEvent(eventName, (error: any, evt: any) => {
      if (!error) {
        this.setState({
          lastEvents: {
            ...this.state.lastEvents,
            [eventName]: {
              ...this.state.lastEvents[eventName],
              [evt.blockNumber]: Date.now()
            }
          }
        })
      } else {
        console.error(error);
      }
    },
    {filter})
  }

  public render({}, { initialized, accounts, games, gameIds, chosenIndex, columnSelected, selectedGameId, web3 }: State) {
    return (
      <div style={{ paddingTop: 65, flex: 1 }}>
        <h1>{initialized ? 'initialized' : '...'}</h1>
        <h1>{initialized && accounts ? accounts[0] : ''}</h1>

        <button onClick={() => this.getState()}>state</button>
        {/* <button onClick={() => this.createGame()}>create new game</button> */}
        <button onClick={() => {}}>claim timeout win</button>
        <button onClick={() => this.newRestrictedGame.MDComponent.show()}>new game</button>
        <button onClick={() => this.joinGameDialogRef.MDComponent.show()}>join</button>

        {gameIds.length ? 
          <div>
            <h2>Your games: </h2>

            <p>{JSON.stringify(gameIds)}</p>
            <Selector 
              chosenIndex={chosenIndex} 
              hintText={'GameIds'} 
              options={gameIds} 
              onChange={(e: Event & {target: EventTarget & {selectedIndex: number}}) => {                 
                  this.setState({
                    chosenIndex: e.target.selectedIndex,
                    selectedGameId: this.state.gameIds[e.target.selectedIndex-1]
                  })
                }
              } 
            />
          </div>
          : null
        }

        {games[selectedGameId] ?
          <div>
          <p>{games[selectedGameId].playerOne === accounts[0] && 'You are player 1'}</p>
          <p>{games[selectedGameId].playerTwo === accounts[0] && 'You are player 2'}</p>
          <p>{games[selectedGameId].running && 'Game is running'}</p>
          <p>{games[selectedGameId].currentPlayer == 1 && 'It is player 1s turn'}</p>
          <p>{games[selectedGameId].currentPlayer == 2 && 'It is player 2s turn'}</p>
          <p>{'There is ' + getEtherInGame(games[selectedGameId].bidPlayerOne, games[selectedGameId].bidPlayerTwo, web3) + ' ETH to win!'}</p>
          <p>{JSON.stringify(games[selectedGameId])}</p>
            <Board
              cells={games[selectedGameId] ? games[selectedGameId].cells : []}
              columnSelected={columnSelected}
              onClick={this.onCellClicked}
              playersTurn={true}
              onMouseOver={(columnSelected: number) => this.setState({ columnSelected })}
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
              label: 'Opponent\'s address? (optional)',
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
