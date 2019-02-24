import { Component, h } from "preact";

import { BoardControls } from "src/components/boardControls/boardControls";
import { Events } from "src/components/events/events";
import { LoadingContainer } from "src/components/loadingContainer/LoadingContainer";
import { cancelCreatedGame } from "src/helpers/web3/cancelCreatedGame";
import { claimTimeoutVictory } from "src/helpers/web3/claimTimeoutVictory";
import { giveUp } from "src/helpers/web3/giveUp";
import { withdraw } from "src/helpers/web3/withdraw";
import { joinGame } from "../../../src/helpers/web3/joinGame";
import { makeMove } from "../../../src/helpers/web3/makeMove";
import { newGame } from "../../../src/helpers/web3/newGame";
import { Board } from "../../components/board/board";
import { Dialog } from "../../components/dialog";
import { Selector } from "../../components/selector";
import drizzleOptions, { fourConnectEvents } from "../../const/drizzleOptions";
import FourConnectListener from "../../helpers/web3/FourConnectListener";
import { getBoardData } from "../../helpers/web3/getBoardData";
import { getEtherInGame } from "../../lib/getEtherInGame";
import { nextFreeCell } from "../../lib/nextFreeCell";

import { makeMoveAndClaimVictory } from "src/helpers/web3/makeMoveAndClaimVictory";
import { gameEnd } from "src/lib/gameLogic";
import { nextPlayer } from "src/lib/nextPlayer";
import * as style from "./style.css";

interface Props {}

interface State {
  columnSelected: number;
  web3: any;
  opponentsAddress: string;
  createGameBidEth: string;
  joinGameBidEth: string;
  joinGameId: number;
  chosenIndex: number;
  stackId: number;
  openGameId: number;
  accounts: any[];
  initialized: boolean;
  games: {
    [gameId: number]: FourConnectGame;
  };
  gameIds: any[];
  selectedGameId: number;
  maxCreationTimeout: number;
  maxMoveTimeout: number;
  lastEvents: {
    [eventName: string]: {
      [blockNumber: string]: {
        timestamp: Date,
        gameId: number,
      };
    };
  };
}

class Web3Route extends Component<Props, State> {
  public fourConnectListener: FourConnectListener;
  public poll: any;
  public joinGameDialogRef: any;
  public newRestrictedGame: any;

  constructor(props) {
    super(props);

    this.state = {
      openGameId: -1,
      maxCreationTimeout: 0,
      maxMoveTimeout: 0,
      columnSelected: 0,
      web3: {},
      opponentsAddress: "",
      createGameBidEth: "",
      joinGameBidEth: "",
      joinGameId: -1,
      chosenIndex: 1,
      stackId: 0x0,
      accounts: [],
      games: {},
      gameIds: [],
      initialized: false,
      lastEvents: {},
      selectedGameId: 0,
    };

    this.fourConnectListener = new FourConnectListener({
      options: { gameMode: "new", drizzleOptions },
    });

    // this.startPolling = this.startPolling.bind(this);
    this.initialize = this.initialize.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribeToEvent = this.subscribeToEvent.bind(this);
    this.initializeEventsForGames = this.initializeEventsForGames.bind(this);
    this.onCellClicked = this.onCellClicked.bind(this);
    this.refreshGame = this.refreshGame.bind(this);
    this.renderGameIdSelector = this.renderGameIdSelector.bind(this);
  }

  public async componentDidMount() {
    this.initialize();
  }

  public componentWillUnmount() {
    clearInterval(this.poll);
  }

  public async initialize() {
    if (typeof process === "undefined") {
      return;
    }

    let web3, maxCreationTimeout, maxMoveTimeout;

    try {
      const data = await this.fourConnectListener.start();

      web3 = data.web3;
      (maxCreationTimeout = data.maxCreationTimeout),
        (maxMoveTimeout = data.maxMoveTimeout);
    } catch (e) {
      console.error(e);
    }

    const accounts = (await web3.eth.getAccounts()) || [];

    let lastEvents = {};

    try {
      lastEvents = JSON.parse(localStorage.getItem("events"));
    } catch (error) {
      console.warn(error);
    }

    this.setState({
      web3,
      accounts,
      initialized: true,
      maxCreationTimeout,
      maxMoveTimeout,
      lastEvents,
    });

    this.getState();

    this.getAllPastEvents();
  }

  public async retrieve() {
    const status = await this.fourConnectListener.getStatus(
      this.state.stackId || 0,
    );
    console.warn(status);
  }

  public async getState() {
    try {
      let gameIds = await this.fourConnectListener.callMethod(
        "getPlayersIds",
        this.state.accounts[0],
      );

      if (!gameIds.length) {
        throw new Error("No games yet attended");
      }

      gameIds = gameIds.map((gameId: string) => Number(gameId));

      this.setState({
        gameIds,
      });

      gameIds.forEach(async (gameId) => {
        try {
          this.refreshGame(gameId);
        } catch (error) {
          console.warn(error);
        }
      });

      this.setState({
        selectedGameId: gameIds[this.state.chosenIndex - 1],
      });

      this.initializeEventsForGames();
    } catch (e) {
      console.warn(e);
    }
  }

  public render(
    {},
    {
      initialized,
      accounts,
      games,
      gameIds,
      chosenIndex,
      columnSelected,
      selectedGameId,
      web3,
      opponentsAddress,
      joinGameId,
      createGameBidEth,
      lastEvents,
      openGameId,
    }: State,
  ) {
    const ownPlayer = accounts[0];
    const selectedGame = games[selectedGameId] || null;
    const playersTurn =
      (selectedGame &&
        selectedGame.playerOne === ownPlayer &&
        selectedGame.currentPlayer === 1) ||
      (selectedGame &&
        selectedGame.playerTwo === ownPlayer &&
        selectedGame.currentPlayer === 2);

    return (
      <LoadingContainer
        web3={web3}
        accounts={accounts}
        drizzleStatus={{ initialized }}
      >
        <div style={{ margin: 15 }} class={style.container}>
          <div class={style.gameContainer}>
            <div>
              <BoardControls
                board={selectedGame}
                ownPlayer={ownPlayer}
                refreshState={() => this.refreshGame(this.state.selectedGameId)}
                refreshAllState={() => this.getState()}
                ethToWin={getEtherInGame(
                  (selectedGame && selectedGame.bidPlayerOne) || "0",
                  (selectedGame && selectedGame.bidPlayerTwo) || "0",
                  web3,
                )}
                joinGame={() => this.joinGame()}
                withdraw={() =>
                  withdraw(this.fourConnectListener, selectedGameId)
                }
                claimTimeout={() =>
                  claimTimeoutVictory(this.fourConnectListener, selectedGameId)
                }
                giveUp={() => giveUp(this.fourConnectListener, selectedGameId)}
                cancelCreatedGame={() =>
                  cancelCreatedGame(this.fourConnectListener, selectedGameId)
                }
                newGame={() => this.newRestrictedGame.MDComponent.show()}
                gameIdSelector={this.renderGameIdSelector()}
              />
            </div>
            <div>
              {selectedGame && (
                <Board
                  cells={selectedGame.cells}
                  columnSelected={columnSelected}
                  onClick={this.onCellClicked}
                  playersTurn={playersTurn}
                  onMouseOver={(columnSelected: number) =>
                    this.setState({ columnSelected })
                  }
                />
              )}
            </div>
          </div>

          <Events events={lastEvents} />

          <Dialog
          setRef={(joinGameDialogRef) =>
            (this.joinGameDialogRef = joinGameDialogRef)
          }
          acceptText={"Join Game"}
          declineText={"Cancel"}
          onAccept={() =>
            joinGame(this.fourConnectListener, joinGameId || openGameId)
          }
          headerText={"Join a new Game"}
          inputTexts={{
            gameId: {
              label: `Specific Game ID? ${
                openGameId > 0 ? "(" + openGameId + " is open)" : ""
              }`,
              onKeyUp: (joinGameId) =>
                this.setState({ joinGameId: Number(joinGameId) }),
            },
            payment: {
              label: "Your bid? (in ETH)",
              onKeyUp: (joinGameBidEth) => this.setState({ joinGameBidEth }),
            },
          }}
        />

        <Dialog
          setRef={(newRestrictedGame) =>
            (this.newRestrictedGame = newRestrictedGame)
          }
          acceptText={opponentsAddress ? "New restricted game" : "New game"}
          declineText={"Cancel"}
          onAccept={() =>
            newGame(
              this.fourConnectListener,
              accounts[0],
              createGameBidEth,
              opponentsAddress,
            )
          }
          headerText={"Create a new Game"}
          inputTexts={{
            gameId: {
              label: "Opponent's address? (optional)",
              onKeyUp: (opponentsAddress) => this.setState({ opponentsAddress }),
            },
            payment: {
              label: "Your bid? (in ETH) (optional)",
              onKeyUp: (createGameBidEth) => this.setState({ createGameBidEth }),
            },
          }}
        />
        </div>


      </LoadingContainer>
    );
  }

  private async joinGame() {
    try {
      const openGameId = await this.fourConnectListener.callMethod(
        "getOpenGameId",
      );

      this.setState({ openGameId });
    } catch (e) {
      console.error(e);
    }

    this.joinGameDialogRef.MDComponent.show();
  }

  private async refreshGame(gameId: number) {
    const game = await getBoardData(this.fourConnectListener, gameId);

    const games = {
      ...this.state.games,
      [gameId]: {
        ...this.state.games[gameId],
        ...game,
      },
    };

    this.setState({
      games,
    });
  }

  private onCellClicked(column: number) {
    const game = this.state.games[this.state.selectedGameId];

    const cellIndex = nextFreeCell(
      column,
      game,
    );

    const cells = [...game.cells];
    cells[cellIndex] = nextPlayer(game.currentPlayer) ;

    const end = gameEnd(cellIndex, { cells, currentPlayer: game.currentPlayer });

    if (end.isGameEnd) {
      makeMoveAndClaimVictory(this.fourConnectListener, this.state.selectedGameId, cellIndex, end.winningCells.map((cell) => cell.i));
    } else {
      makeMove(this.fourConnectListener, this.state.selectedGameId, cellIndex);
    }
  }

  private async getAllPastEvents() {
    // const evts = await this.fourConnectListener.getAllPastEvents("logGameInitialized", { gameId: [...this.state.gameIds] });

    // console.error(evts);
  }

  private initializeEventsForGames() {
    fourConnectEvents.forEach((eventName) => {
      if (eventName === "logGameInitialized") {
        this.subscribeToEvent(eventName, false);
      } else {
        this.subscribeToEvent(eventName, true);
      }
    });
  }

  private subscribeToEvent(eventName: string, useFilter: boolean) {
    let filter = null;

    if (useFilter) {
      filter = {
        gameId: [...this.state.gameIds.map((i) => String(i))],
      };
    }

    this.fourConnectListener.subscribeEvent(
      eventName,
      async (error: any, evt: any) => {
        if (!error) {
          const gameId = evt.returnValues && evt.returnValues.gameId;
          const { chosenIndex } = this.state;

          const lastEvents = {
            ...this.state.lastEvents,
            [eventName]: {
              ...this.state.lastEvents && this.state.lastEvents[eventName],
              [evt.blockNumber]: {
                timestamp: Date.now(),
                gameId: evt.returnValues && evt.returnValues.gameId,
              },
            },
          };

          localStorage.setItem("events", JSON.stringify(lastEvents));

          this.setState({
            lastEvents,
          });

          if (this.state.gameIds.indexOf(Number(gameId)) !== -1 ) {
            await this.getState();
            this.setState({ chosenIndex });
          }
        } else {
          console.error(error);
        }
      },
      { filter },
    );
  }

  private renderGameIdSelector() {
    const { chosenIndex, gameIds } = this.state;

    return <Selector
      chosenIndex={chosenIndex}
      hintText={"Selected Game"}
      options={gameIds}
      onChange={(
        e: Event & {
          target: EventTarget & { selectedIndex: number };
        },
      ) => {
        this.setState({
          chosenIndex: e.target.selectedIndex,
          selectedGameId: this.state.gameIds[
            e.target.selectedIndex - 1
          ],
        });
      }}
    />;
  }
}

export default Web3Route;
