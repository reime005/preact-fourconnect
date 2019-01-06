pragma solidity >=0.5.0 < 0.6.0;

import "truffle/Assert.sol";
import "./ThrowProxy.sol";
import "../contracts/Thrower.sol";

// Solidity test contract, meant to test Thrower
contract TestThrower {
    // function testIrgendwas() public {
    //     Thrower thrower = new Thrower();
    //     ThrowProxy throwProxy = new ThrowProxy(address(thrower)); //set Thrower as the contract to forward requests to. The target.

    //     //prime the proxy.
    //     Thrower(address(throwProxy)).setAmount(5000);
    //     Thrower(address(throwProxy)).setAmount(7000);
    //     //execute the call that is supposed to throw.
    //     //r will be false if it threw. r will be true if it didn't.
    //     //make sure you send enough gas for your contract method.
    //     bool r = throwProxy.execute.gas(200000)();

    //     Assert.isFalse(r, "Should be false, as it should throw");
    // }
}
