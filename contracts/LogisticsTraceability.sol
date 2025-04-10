// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LogisticsTraceability {
    address public owner;
    mapping(address => bool) public whitelist;
    mapping(uint256 => Product) public products;
    uint256 public productCount;

    struct Product {
        string manufacturer;
        uint256 lotNumber;
        string productName;
        string lotId;
        uint256 totalProducts;
        string lastOwner;
        uint256 purchaseDate;
    }

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event WhitelistUpdated(address indexed participant, bool isWhitelisted);
    event ProductAdded(uint256 indexed productId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Not whitelisted");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function addToWhitelist(address participant) public onlyOwner {
        whitelist[participant] = true;
        emit WhitelistUpdated(participant, true);
    }

    function removeFromWhitelist(address participant) public onlyOwner {
        whitelist[participant] = false;
        emit WhitelistUpdated(participant, false);
    }

    function addProduct(
        string memory _manufacturer,
        uint256 _lotNumber,
        string memory _productName,
        string memory _lotId,
        uint256 _totalProducts,
        string memory _lastOwner,
        uint256 _purchaseDate
    ) public onlyWhitelisted {
        productCount++;
        products[productCount] = Product(
            _manufacturer,
            _lotNumber,
            _productName,
            _lotId,
            _totalProducts,
            _lastOwner,
            _purchaseDate
        );
        emit ProductAdded(productCount);
    }

    function getProduct(uint256 _productId) public view returns (Product memory) {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        return products[_productId];
    }
}
