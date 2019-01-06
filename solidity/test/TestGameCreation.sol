pragma solidity >=0.5.0 < 0.6.0;

import "truffle/Assert.sol";
import "./ThrowProxy.sol";
import "../contracts/FourConnect.sol";

// Solidity test contract, meant to test Thrower
contract TestGameCreation {
    // function testDenyJoinNonExistingGame() public {
    //     FourConnect fourConnect = new FourConnect();
    //     ThrowProxy fourConnectProxy = new ThrowProxy(address(fourConnect));

    //     //prime the proxy.
    //     FourConnect(address(fourConnectProxy)).joinGame(0);
    //     //execute the call that is supposed to throw.
    //     //r will be false if it threw. r will be true if it didn't.
    //     //make sure you send enough gas for your contract method.
    //     bool r = fourConnectProxy.execute.gas(200000)();

    //     Assert.isFalse(r, "Should throw by joining a non existing game.");
    // }

    // function testAllowJoinExistingGame() public {
    //     FourConnect fourConnect = new FourConnect();
    //     ThrowProxy fourConnectProxy = new ThrowProxy(address(fourConnect));

    //     //prime the proxy.
    //     FourConnect(address(fourConnectProxy)).newGame();
    //     // FourConnect(address(fourConnectProxy)).joinGame(1);
    //     //execute the call that is supposed to throw.
    //     //r will be false if it threw. r will be true if it didn't.
    //     //make sure you send enough gas for your contract method.
    //     bool r = fourConnectProxy.execute.gas(200000)();

    //     Assert.isTrue(r, "Should not throw by joining an existing game.");
    // }
}
