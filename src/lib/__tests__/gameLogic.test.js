import { makeMove, gameEnd } from "../gameLogic";
import { CELL_SUM, players } from "../../const/boardConfig";
import { newBoard } from "../newBoard";

/*
  0   1   2   3   4   5   6
  7   8   9   10	11	12	13
  14	15	16	17	18	19	20
  21	22	23	24	25	26	27
  28	29	30	31	32	33	34
  35	36	37	38	39	40	41
*/
describe("makeMove", () => {
  test("should fail if not your turn", () => {
    const board = newBoard();

    expect(() => makeMove(board, players.TWO, 41)).toThrow("Not your turn");
  });

  test("should fail if not your turn", () => {
    const board = newBoard();

    expect(() => makeMove(board, players.TWO, 15)).toThrow("Not your turn");
  });

  test("should fail for over treshold cases", () => {
    const board = newBoard();

    expect(() => makeMove(board, players.ONE, 42)).toThrow(
      "Incorrect move position: 42"
    );
    expect(() => makeMove(board, players.ONE, -1)).toThrow(
      "Incorrect move position: -1"
    );
  });

  test("should fail if next row empty", () => {
    const board = newBoard();

    expect(() => makeMove(board, players.ONE, 32)).toThrow(
      "Next row is not empty!"
    );
    expect(() => makeMove(board, players.ONE, 0)).toThrow(
      "Next row is not empty!"
    );
    expect(() => makeMove(board, players.ONE, 7)).toThrow(
      "Next row is not empty!"
    );
    expect(() => makeMove(board, players.ONE, 34)).toThrow(
      "Next row is not empty!"
    );
  });

  test("should not fail if not your turn", () => {
    let board = newBoard();

    board = makeMove(board, players.ONE, 41);
    board = makeMove(board, players.TWO, 35);
    board = makeMove(board, players.ONE, 36);
  });

  test("should not fail", () => {
    let board = newBoard();

    board = makeMove(board, players.ONE, 41);
    board = makeMove(board, players.TWO, 40);
    board = makeMove(board, players.ONE, 35);
  });

  test("should run a straight game", () => {
    let board = newBoard();

    board.cells = Array.from({ length: CELL_SUM }, (x, i) => {
      switch (i) {
        case 0:
        case 1:
        case 2:
        case 4:
          return players.ONE;
        case 24:
        case 25:
        case 26:
        case 27:
          return players.TWO;
        default:
          return players.NONE;
      }
    });

    board.currentPlayer = players.ONE;

    expect(gameEnd(4, board).isGameEnd).toEqual(false);
    expect(gameEnd(0, board).isGameEnd).toEqual(false);
    expect(gameEnd(1, board).isGameEnd).toEqual(false);
    expect(gameEnd(2, board).isGameEnd).toEqual(false);

    expect(gameEnd(24, board).isGameEnd).toEqual(true);
    expect(gameEnd(27, board).isGameEnd).toEqual(true);
    expect(gameEnd(26, board).isGameEnd).toEqual(true);
    expect(gameEnd(25, board).isGameEnd).toEqual(true);

    expect(gameEnd(24, board).winningCells.map(cell => cell.i)).toEqual([
      24,
      25,
      26,
      27
    ]);

    expect(gameEnd(27, board).winningCells.map(cell => cell.i)).toEqual([
      24,
      25,
      26,
      27
    ]);
  });

  test("should run a diagonal game 1", () => {
    let board = newBoard();

    board.cells = Array.from({ length: CELL_SUM }, (x, i) => {
      switch (i) {
        case 6:
        case 12:
          return players.ONE;
        case 3:
        case 9:
        case 15:
        case 21:
          return players.TWO;
        default:
          return players.NONE;
      }
    });

    board.currentPlayer = players.ONE;

    expect(gameEnd(3, board).isGameEnd).toEqual(true);
    expect(gameEnd(9, board).isGameEnd).toEqual(true);
    expect(gameEnd(15, board).isGameEnd).toEqual(true);
    expect(gameEnd(21, board).isGameEnd).toEqual(true);

    expect(gameEnd(15, board).winningCells.map(cell => cell.i)).toStrictEqual([
      21,
      15,
      9,
      3
    ]);
  });

  test("should run a diagonal game 2,3", () => {
    let board = newBoard();

    board.cells = Array.from({ length: CELL_SUM }, (x, i) => {
      switch (i) {
        case 6:
        case 12:
        case 18:
        case 24:
          return players.ONE;
        case 40:
        case 33:
        case 26:
          return players.TWO;
        default:
          return players.NONE;
      }
    });

    board.currentPlayer = players.TWO;

    expect(gameEnd(6, board).isGameEnd).toEqual(true);
    expect(gameEnd(12, board).isGameEnd).toEqual(true);
    expect(gameEnd(18, board).isGameEnd).toEqual(true);
    expect(gameEnd(24, board).isGameEnd).toEqual(true);

    expect(gameEnd(24, board).winningCells.map(cell => cell.i)).toStrictEqual([
      24,
      18,
      12,
      6
    ]);

    expect(gameEnd(40, board).isGameEnd).toEqual(false);
    expect(gameEnd(26, board).isGameEnd).toEqual(false);
    expect(gameEnd(33, board).isGameEnd).toEqual(false);

    expect(gameEnd(40, board).winningCells).toBeFalsy();
  });

  test("should run a diagonal game 3,4", () => {
    let board = newBoard();

    board.cells = Array.from({ length: CELL_SUM }, (x, i) => {
      switch (i) {
        case 3:
        case 11:
        case 19:
        case 27:
          return players.ONE;
        case 14:
        case 22:
        case 30:
        case 38:
          return players.ONE;
        case 40:
        case 33:
        case 26:
          return players.TWO;
        default:
          return players.NONE;
      }
    });

    board.currentPlayer = players.TWO;

    expect(gameEnd(3, board).isGameEnd).toEqual(true);
    expect(gameEnd(11, board).isGameEnd).toEqual(true);
    expect(gameEnd(19, board).isGameEnd).toEqual(true);
    expect(gameEnd(27, board).isGameEnd).toEqual(true);

    expect(gameEnd(14, board).isGameEnd).toEqual(true);
    expect(gameEnd(22, board).isGameEnd).toEqual(true);
    expect(gameEnd(30, board).isGameEnd).toEqual(true);
    expect(gameEnd(38, board).isGameEnd).toEqual(true);

    expect(gameEnd(40, board).isGameEnd).toEqual(false);
    expect(gameEnd(26, board).isGameEnd).toEqual(false);
    expect(gameEnd(33, board).isGameEnd).toEqual(false);
  });

  test("should run a straight game 1", () => {
    let board = newBoard();

    board.cells = Array.from({ length: CELL_SUM }, (x, i) => {
      switch (i) {
        case 0:
        case 1:
        case 2:
        case 3:
          return players.ONE;
        case 40:
        case 33:
        case 26:
          return players.TWO;
        default:
          return players.NONE;
      }
    });

    board.currentPlayer = players.TWO;

    expect(gameEnd(0, board).isGameEnd).toEqual(true);
    expect(gameEnd(3, board).isGameEnd).toEqual(true);
    expect(gameEnd(1, board).isGameEnd).toEqual(true);
    expect(gameEnd(2, board).isGameEnd).toEqual(true);

    expect(gameEnd(40, board).isGameEnd).toEqual(false);
    expect(gameEnd(26, board).isGameEnd).toEqual(false);
    expect(gameEnd(33, board).isGameEnd).toEqual(false);
  });

  test("should run a straight game 2", () => {
    let board = newBoard();

    board.cells = Array.from({ length: CELL_SUM }, (x, i) => {
      switch (i) {
        case 2:
        case 9:
        case 16:
        case 23:
          return players.ONE;
        case 41:
        case 34:
        case 27:
          return players.TWO;
        default:
          return players.NONE;
      }
    });

    board.currentPlayer = players.TWO;

    expect(gameEnd(2, board).isGameEnd).toEqual(true);
    expect(gameEnd(9, board).isGameEnd).toEqual(true);
    expect(gameEnd(16, board).isGameEnd).toEqual(true);
    expect(gameEnd(23, board).isGameEnd).toEqual(true);

    expect(gameEnd(41, board).isGameEnd).toEqual(false);
    expect(gameEnd(34, board).isGameEnd).toEqual(false);
    expect(gameEnd(27, board).isGameEnd).toEqual(false);
  });

  test("should run a simple straight win game player 2", () => {
    let board = newBoard();

    board = makeMove(board, players.ONE, 41);
    board = makeMove(board, players.TWO, 35);
    board = makeMove(board, players.ONE, 34);
    board = makeMove(board, players.TWO, 36);
    board = makeMove(board, players.ONE, 27);
    board = makeMove(board, players.TWO, 37);
    board = makeMove(board, players.ONE, 40);
    board = makeMove(board, players.TWO, 38);

    board = gameEnd(38, board, players.TWO);
    expect(board.isGameEnd).toEqual(true);
  });

  test("should run a simple straight win game player 1", () => {
    let board = newBoard();

    board = makeMove(board, players.ONE, 41);
    board = makeMove(board, players.TWO, 35);
    board = makeMove(board, players.ONE, 40);
    board = makeMove(board, players.TWO, 36);
    board = makeMove(board, players.ONE, 39);
    board = makeMove(board, players.TWO, 28);
    board = makeMove(board, players.ONE, 38);

    board = gameEnd(38, board, players.ONE);
    expect(board.isGameEnd).toEqual(true);

    expect(() => makeMove(board, players.TWO, 29)).toThrow("Game has ended");
  });
});
