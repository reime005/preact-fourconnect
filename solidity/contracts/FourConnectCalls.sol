pragma solidity ^0.5.2;

pragma experimental ABIEncoderV2;

import "./FourConnectModifiers.sol";

/// @title Contract for a Connect Four Game
/// @author Marius Reimer
/// @notice 
/// @dev This contract contains only external view / call methods
contract FourConnectCalls is FourConnectModifiers {

    function getPlayersIds(address player) 
        external 
        view
        returns (uint[] memory) {
        require(player != address(0));
        return joinedGames[player];
    }
    
    function getBoard(uint gameId) 
        external 
        view 
        onlyWhenGameExists(gameId)
        returns (Player[42] memory) {
        return games[gameId].board;
    }

    function getCurrentUID() 
        external
        view
        returns (uint) {
        return currentUID;
    }

    function getOpenGameId()
        external
        view
        onlyWhenGameExists(0)
        returns (uint) {
        for (uint i = 0; i <= currentUID; ++i) {
            if (games[i].running == false && 
                games[i].winner == address(0) && 
                games[i].exclusive == false) {
                return i;
            }
        }
        
        revert("no open games");
    }

    function getLastTimePlayed(uint gameId)
        external 
        view 
        onlyWhenGameExists(gameId)
        returns (uint) {
        return games[gameId].lastTimePlayed;
    }

    function getCurrentPlayer(uint gameId)
        external 
        view 
        onlyWhenGameExists(gameId)
        returns (Player) {
        return games[gameId].currentPlayer;
    }

    function getCreationTime(uint gameId)
        external 
        view 
        onlyWhenGameExists(gameId)
        returns (uint) {
        return games[gameId].creationTime;
    }

    function getMaxMoveTimeout()
        external 
        pure 
        returns (uint) {
        return MAX_MOVE_TIMEOUT;
    }

    function getMaxCreationTimeout() 
        external 
        pure 
        returns (uint) {
        return MAX_CREATION_TIMEOUT;
    }

    function getBidPlayerOne(uint gameId) 
        external 
        view 
        // onlyOwner(gameId)
        onlyWhenGameExists(gameId)
        returns(uint) {
        return games[gameId].bidPlayerOne;
    }

    function getBidPlayerTwo(uint gameId) 
        external 
        view 
        // onlyNonOwner(gameId)
        onlyWhenGameExists(gameId)
        returns(uint) {
        return games[gameId].bidPlayerTwo;
    }

    function getPlayerOne(uint gameId)
        external
        view
        onlyWhenGameExists(gameId)
        returns(address) {
        return games[gameId].playerOne;
    }

    function getPlayerTwo(uint gameId)
        external
        view
        onlyWhenGameExists(gameId)
        returns(address) {
        return games[gameId].playerTwo;
    }

    function getWinner(uint gameId)
        external
        view
        onlyWhenGameExists(gameId)
        returns(address) {
        return games[gameId].winner;
    }

    function getRunning(uint gameId)
        external
        view
        onlyWhenGameExists(gameId)
        returns(bool) {
        return games[gameId].running;
    } 
}