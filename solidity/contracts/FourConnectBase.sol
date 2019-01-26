pragma solidity ^0.5.2;

import "./Ownable.sol";

contract FourConnectBase is Ownable {

    /*** EVENTS ***/

    event logGameInitialized(uint gameId, bool exclusive);
    event logGameStarted(uint gameId);
    event logGameMoveMade(uint gameId, Player who, uint8 position);
    event logGameCanceled(uint gameId);
    event logGameEnd(uint gameId, address winner);

    /*** DATA TYPES ***/

    struct Game {
        uint bidPlayerOne;
        uint bidPlayerTwo;
        uint lastTimePlayed;
        uint creationTime;
        Player currentPlayer;
        address playerOne;
        address playerTwo;
        address winner;
        bool exclusive;
        bool running;

        Player[42] board;
    }

    enum Player { NONE, ONE, TWO }

    /*** CONSTANTS ***/

    uint constant MAX_MOVE_TIMEOUT = 1 hours;
    uint constant MAX_CREATION_TIMEOUT = 30 minutes;

    /*** VARIABLES ***/

    mapping (uint => Game) internal games;
    mapping (address => uint[]) internal joinedGames;
    
    uint internal currentUID;

    /*** INTERNAL METHODS AND HELPERS ***/

    /// @notice Return the gameId and increment it
    function nextUID() 
        internal 
        returns(uint) {
        return currentUID++;
    }

    /// @notice Internal helper to initialize a game
    /// @param gameId The id of the game
    function internalGameInit(uint gameId) 
        internal {
        games[gameId].bidPlayerOne = msg.value;
        games[gameId].playerOne = msg.sender;
        games[gameId].creationTime = now;
        emit logGameInitialized(gameId, false);
    }

    /// @notice Internal helper to start/join a game
    /// @param gameId The id of the game
    function internalGameStart(uint gameId) 
        internal {
        games[gameId].bidPlayerTwo = msg.value;
        games[gameId].running = true;
        games[gameId].lastTimePlayed = now;
        emit logGameStarted(gameId);
    }

    /// @notice Internal helper to finish a game
    /// @param gameId The id of the game
    /// @param winner The address of the winner
    function internalGameEnd(uint gameId, address winner) 
        internal {
        games[gameId].running = false;
        games[gameId].winner = winner;

        emit logGameEnd(gameId, winner);
    }

    /// @notice Internal helper to get the address of the current active/inactive player
    /// @param gameId The id of the game
    /// @param active Active or Inactive player
    function getPlayerAddress(uint gameId, bool active) 
        internal 
        view 
        returns(address) {
        Player player = games[gameId].currentPlayer;

        if (player == Player.ONE && active ||
            player == Player.TWO && !active) {
            return games[gameId].playerOne;
        } else if (player == Player.ONE && !active ||
            player == Player.TWO && active) {
            return games[gameId].playerTwo;
        } else {
            revert();
        }
    }    
}