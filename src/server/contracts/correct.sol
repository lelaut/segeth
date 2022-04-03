// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.0 <0.9.0;

contract Test {
    address private _owner;
    mapping(address => uint256) private _balances;

    constructor() public {
        _owner = msg.sender;
    }
}
