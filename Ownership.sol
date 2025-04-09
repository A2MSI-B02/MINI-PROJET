// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProductTracking.sol";

contract Ownership is ProductTracking {
    function transferOwnership(uint productId, address newOwner) public onlyWhitelisted {
        require(products[productId].currentOwner == msg.sender, "Only the current owner can transfer ownership");

        address previousOwner = products[productId].currentOwner;
        products[productId].currentOwner = newOwner;
        products[productId].timestamp = block.timestamp;

        emit ProductUpdated(productId, previousOwner, newOwner, block.timestamp);
    }
}
