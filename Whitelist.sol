// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    mapping(address => bool) public whitelistedAddresses;
    address public owner;

    event Whitelisted(address indexed account);
    event RemovedFromWhitelist(address indexed account);

    constructor() {
        owner = msg.sender;
        whitelistedAddresses[msg.sender] = true; // L'initiateur est automatiquement whitelisté
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelistedAddresses[msg.sender], "You are not authorized");
        _;
    }

    function addWhitelisted(address account) public onlyOwner {
        whitelistedAddresses[account] = true;
        emit Whitelisted(account);
    }

    function removeWhitelisted(address account) public onlyOwner {
        whitelistedAddresses[account] = false;
        emit RemovedFromWhitelist(account);
    }
}
