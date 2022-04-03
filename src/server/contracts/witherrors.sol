// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.0 <0.9.0;

contract Test {
    address private _owner;
    mapping( => uint256) private _balances;

    constructor() {
        _owner = msg.sender;
    }
}
