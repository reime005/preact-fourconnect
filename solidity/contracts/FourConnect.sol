pragma solidity ^0.5.2;

import "./FourConnectCalls.sol";

/// @title Contract for a Connect Four Game
/// @author Marius Reimer
/// @notice 
/// @dev This is the core contract
contract FourConnect is FourConnectCalls {
    
    constructor() public {
    }

    /// @notice Fallback method. Sending ether to this contract 
    /// will cause expection, since 'payable' is missing. 
    function() external {
        revert();
    }

    /// @notice The winner may withdraw the amount
    /// @param gameId The id of the game
    function withdraw(uint gameId) 
        public {
        require(false == games[gameId].running);
        require(msg.sender == games[gameId].winner);

        uint amount = games[gameId].bidPlayerOne + games[gameId].bidPlayerTwo;
        games[gameId].bidPlayerOne = 0;
        games[gameId].bidPlayerTwo = 0;
        // Zero the pending refund before
        // sending to prevent re-entrancy attacks
        msg.sender.transfer(amount);
    }

    /// @notice Creates a non restricted game (anyone can join)
    function newGame() 
        external 
        payable
        returns(uint) {
        uint gameId = nextUID();
        internalGameInit(gameId);
        return gameId;
    }

    /// @notice Creates a restricted game (only the specified player can join)
    /// @param playerTwo The second player to join this game
    function newRestrictedGame(address playerTwo) 
        external 
        payable
        returns(uint) {
        require(playerTwo != msg.sender);
        uint gameId = nextUID();
        games[gameId].exclusive = true;
        games[gameId].playerTwo = playerTwo;
        internalGameInit(gameId);
        return gameId;
    }

    /// @notice Join a specific game
    /// @param gameId The id of the game
    function joinGame(uint gameId) 
        external 
        payable
        onlyWhenGameExists(gameId)
        onlyWhenNotRunning(gameId) {
        require(games[gameId].playerOne != msg.sender);

        // if a game without bid exists, do no check, otherwise they must not be equal
        if (msg.value != 0 || games[gameId].bidPlayerOne != 0) {
            require(msg.value != games[gameId].bidPlayerOne);
        }

        if (games[gameId].exclusive) {
            require(games[gameId].playerTwo == msg.sender);
        } else {
            games[gameId].playerTwo = msg.sender;
        }

        // select first player depending on the higher bid price
        if (games[gameId].bidPlayerOne > msg.value) {
            games[gameId].currentPlayer = Player.ONE;
        } else {
            games[gameId].currentPlayer = Player.TWO;
        }

        internalGameStart(gameId);
    }

    /// @notice Join a specific game
    /// @param gameId The id of the game
    function claimTimeoutVictory(uint gameId)
        external
        onlyAfterTimeout(gameId)
        onlyInactivePlayer(gameId)
        onlyWhenRunning(gameId)
    {
        // game ends with inactive player
        internalGameEnd(gameId, getPlayerAddress(gameId, false));
    }

    //The pieces in toClaim must be sorted positions, least to greatest
    function makeMoveAndClaimVictory(uint gameId, uint8 moveToMake, uint8[4] calldata claim)
        external
        onlyActivePlayer(gameId)
        onlyWhenRunning(gameId)
    {
        Player player = games[gameId].currentPlayer;
        // get active player
        address playerAddress = getPlayerAddress(gameId, true);

        makeMove(gameId, moveToMake);

        require(checkHasWon(gameId, player, claim));

        // game ends with active player
        internalGameEnd(gameId, playerAddress);
    }

    /// @notice Checks and persists the move on the board
    /// @param gameId The id of the game
    /// @param position Board position for the desired move
    function makeMove(uint gameId, uint8 position)
        public
        onlyActivePlayer(gameId)
        onlyWhenRunning(gameId)
        onlyInTimeout(gameId)
    {
        Player player = games[gameId].currentPlayer;
/*
    0   1   2   3   4   5   6
    7   8   9   10	11	12	13
    14	15	16	17	18	19	20
    21	22	23	24	25	26	27
    28	29	30	31	32	33	34
    35	36	37	38	39	40	41
*/
        require(position >= 0 && position <= 41);
        require(games[gameId].board[position] == Player.NONE);

        if (position <= 34){
            require(games[gameId].board[position + 7] != Player.NONE);
        }

        games[gameId].board[position] = player;

        if (player == Player.ONE) {
            games[gameId].currentPlayer = Player.TWO;
        } else {
            games[gameId].currentPlayer = Player.ONE;
        }

        emit logGameMoveMade(gameId, player, position);
    }

    /// @notice Give players the possibilty to give up at any time, so that the other player wins
    /// @param gameId The id of the game
    function giveUp(uint gameId) 
        external
        onlyPlayers(gameId)
        onlyWhenRunning(gameId) {
        if (msg.sender == games[gameId].playerOne) {
            internalGameEnd(gameId, games[gameId].playerTwo);
        } else if (msg.sender == games[gameId].playerTwo) {
            internalGameEnd(gameId, games[gameId].playerOne);
        }
    } 

    /// @notice Check if claimed moves are a valid win
    /// @param gameId The id of the game
    /// @param who The Player who claimed the win
    /// @param moves Set of positions claimed for the win
    /// @return true if won, else exception is thrown
    function checkHasWon(uint gameId, Player who, uint8[4] memory moves) 
        public 
        view 
        returns(bool) {
        for (uint8 i = 0; i < 4; i++){
            require(moves[i] >= 0 && moves[i] <= 41);
            require(games[gameId].board[moves[i]] == who);
        }

        /*
        0   1   2   3   4   5   6
        7   8   9   10	11	12	13
        14	15	16	17	18	19	20
        21	22	23	24	25	26	27
        28	29	30	31	32	33	34
        35	36	37	38	39	40	41
        */

        // All moves must be in decreasing order and have the same distance to each other
        require(moves[0] > moves[1]);

        uint8 diff = moves[0] - moves[1];

        require(
            moves[1] - moves[2] == diff &&
            moves[2] - moves[3] == diff);

        // Check if moves are arranged correctly, because relying to the diff alone
        // is not enough (example: moves in 37, 29, 21, 13 are not valid)
        if (diff == 6) {
            // diagonal-left claim. therefore:
            // last id must be further to the left than the first
            require(moves[3] % 7 > moves[0] % 7);
        } else if (diff == 1 || diff == 8) {
            // horizontal or diagonal-left claim. therefore:
            // last id must be further to the left than the first
            require(moves[0] % 7 > moves[3] % 7);
        } else if (diff != 7) {
            // vertical moves do not need verification, since it happened in the foor loop
            revert();
        }

        return true;
    }

    //If nobody has joined your game, you can cancel and get money back
    function cancelCreatedGame(uint gameId)
        external
        onlyWhenGameExists(gameId)
        onlyWhenNotRunning(gameId)
        onlyAfterCreationTimeout(gameId)
        onlyOwner(gameId) {
        games[gameId].winner = msg.sender;

        emit logGameCanceled(gameId);
    }
}