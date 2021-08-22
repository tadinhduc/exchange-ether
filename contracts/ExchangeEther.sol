// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

contract ExchangeEther {
    function validate(uint256 amount) public {
        require(amount >= 0, "You need to sell at least some tokens");
    }

    function sendViaTransfer(address payable _to, uint256 amount)
        public
        payable
    {
        // Send returns a boolean value indicating success or failure.
        // This function is not recommended for sending Ether.
        bool sent = _to.send(amount);
        require(sent, "Failed to send Ether");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
