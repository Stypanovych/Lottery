// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.9;

contract Lottery {
    address public managerAddress;
    address payable[] public players;

    constructor() {
        managerAddress = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(payable(msg.sender));
    }

    function random() private view returns (uint) {// it's pseudorandom function and may be predicted.
        return uint(keccak256(abi.encode(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        require(players.length > 0);
        uint index = random() % players.length;
        address payable winner = players[index];
        winner.transfer(address(this).balance);
        players = new address payable[](0);
    }
    
    modifier restricted() {
        require(msg.sender == managerAddress);
        _;
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }
}