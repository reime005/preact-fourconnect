pragma solidity >=0.5.0 < 0.6.0;

import "truffle/Assert.sol";

// Proxy contract for testing throws
contract ThrowProxy {
    address public target;
    bytes data;

    constructor(address _target) public {
        target = _target;
    }

    //prime the data using the fallback function.
    function() external {
        data = msg.data;
    }

    // function execute() public returns (bool) {
    //     return target.call(data);
    // }
}