pragma solidity >=0.5.0 < 0.6.0;

// Contract you're testing
contract Thrower {
    uint amount = 6000;

    function setAmount(uint _amount) public payable {
        if (amount < _amount) {
            revert();
        }
        amount = _amount;
    }
}