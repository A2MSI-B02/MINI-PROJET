// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ownership.sol";

contract Whitelist is Ownership {
    mapping(address => bool) private whitelistedAddresses;

    event AddressAddedToWhitelist(address indexed participant);
    event AddressRemovedFromWhitelist(address indexed participant);

    function addToWhitelist(address _participant) public onlyOwner {
        require(_participant != address(0), "WhitelistManager: Cannot add zero address");
        require(!whitelistedAddresses[_participant], "WhitelistManager: Address is already whitelisted");

        whitelistedAddresses[_participant] = true;
        emit AddressAddedToWhitelist(_participant);
    }

    function removeFromWhitelist(address _participant) public onlyOwner {
        require(whitelistedAddresses[_participant], "WhitelistManager: Address is not whitelisted");

        whitelistedAddresses[_participant] = false;
        emit AddressRemovedFromWhitelist(_participant);
    }

    function isWhitelisted(address _participant) public view returns (bool) {
        return whitelistedAddresses[_participant];
    }

    modifier onlyWhitelisted() {
        require(whitelistedAddresses[msg.sender], "WhitelistManager: You are not authorized");
        _;
    }
}
