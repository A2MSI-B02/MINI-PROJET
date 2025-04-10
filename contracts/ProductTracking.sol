// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Whitelist.sol";

contract ProductTracking is Whitelist {
    struct Product {
        uint256 productId;
        string productName;
        uint256 lotId;
        address manufacturer;
        address currentOwner;
        uint256 purchaseDate;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCounter;

    event ProductAdded(uint256 indexed productId, string productName, address indexed manufacturer, uint256 lotId);
    event ProductTransferred(uint256 indexed productId, address indexed from, address indexed to);

    constructor() {
        productCounter = 0;
    }

    function addProduct(
        string memory _productName,
        uint256 _lotId
    ) public onlyWhitelisted {
        productCounter++;
        uint256 productId = productCounter;

        products[productId] = Product({
            productId: productId,
            productName: _productName,
            lotId: _lotId,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            purchaseDate: block.timestamp
        });

        emit ProductAdded(productId, _productName, msg.sender, _lotId);
    }

    function transferProduct(
        uint256 _productId,
        address _newOwner
    ) public {
        require(products[_productId].currentOwner == msg.sender, "ProductTracker: Only the current owner can transfer this product");
        require(_newOwner != address(0), "ProductTracker: New owner address cannot be zero.");

        products[_productId].currentOwner = _newOwner;

        emit ProductTransferred(_productId, msg.sender, _newOwner);
    }

    function getProductDetails(uint256 _productId) public view returns (Product memory) {
        require(products[_productId].productId != 0, "ProductTracker: Product does not exist.");
        return products[_productId];
    }
}
