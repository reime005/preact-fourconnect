pragma solidity ^0.5.2;

import "./FourConnectBase.sol";

contract FourConnectModifiers is FourConnectBase {

    modifier onlyWhenGameExists(uint gameId) {
        require(games[gameId].playerOne != address(0));
        _;
    }

    modifier onlyWhenGameNotExists(uint gameId) {
        require(games[gameId].playerOne == address(0));
        _;
    }

    modifier onlyWhenRunning(uint gameId) {
        require(games[gameId].running, "Game is not running");
        _;
    }

    modifier onlyWhenNotRunning(uint gameId) {
        require(!games[gameId].running);
        _;
    }

    modifier onlyPlayers(uint gameId) {
        require(
            msg.sender == games[gameId].playerOne ||
            msg.sender == games[gameId].playerTwo);
        _;
    }

    modifier onlyNonOwner(uint gameId) {
        require(
            msg.sender == games[gameId].playerTwo);
        _;
    }

    modifier onlyOwner(uint gameId) {
        require(
            msg.sender == games[gameId].playerOne, "Only owner of this game");
        _;
    }

    /// @notice Only the player who is supposed to turn
    /// @param gameId The id of the game
    modifier onlyActivePlayer(uint gameId) {
        require(msg.sender == getPlayerAddress(gameId, true), "Only active player");
        _;
    }

    /// @notice Only the player who is not supposed to turn
    /// @param gameId The id of the game
    modifier onlyInactivePlayer(uint gameId) {
        require(msg.sender == getPlayerAddress(gameId, false));
        _;
    }

    modifier onlyGameCreator(uint gameId) {
        require(msg.sender == games[gameId].playerOne);
        _;
    }

    modifier onlyAfterTimeout(uint gameId) {
        require(now > games[gameId].lastTimePlayed + MAX_MOVE_TIMEOUT);
        _;
    }

    modifier onlyInTimeout(uint gameId) {
        require(now < games[gameId].lastTimePlayed + MAX_MOVE_TIMEOUT);
        _;
    }

    modifier onlyAfterCreationTimeout(uint gameId) {
        require(now > games[gameId].creationTime + MAX_CREATION_TIMEOUT);
        _;
    }
}