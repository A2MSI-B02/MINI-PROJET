// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Whitelist.sol"; // Assurez-vous de bien importer Whitelist.sol

contract ProductTracking is Whitelist {
    // Structure représentant un produit
    struct Product {
        uint id; // Identifiant unique du produit
        string name; // Nom du produit
        address currentOwner; // Adresse du propriétaire actuel
        string status; // Statut du produit (par ex.: "Créé", "En transit", "Livré")
        uint timestamp; // Horodatage de la dernière mise à jour
    }

    mapping(uint => Product) public products; // Mapping des ID de produits à leurs données
    uint public productCount; // Compteur de produits pour générer des ID uniques

    // Événements pour notifier des changements
    event ProductCreated(
        uint id,
        string name,
        address indexed owner,
        uint timestamp
    );
    event ProductStatusUpdated(
        uint id,
        string oldStatus,
        string newStatus,
        uint timestamp
    );

    constructor() {
        productCount = 0; // Initialisation du compteur des produits
    }

    // Fonction pour créer un nouveau produit
    function createProduct(string memory name, string memory initialStatus)
        public
        onlyWhitelisted
    {
        productCount++; // Incrémentation pour générer un identifiant de produit unique
        products[productCount] = Product({
            id: productCount,
            name: name,
            currentOwner: msg.sender,
            status: initialStatus,
            timestamp: block.timestamp
        });

        emit ProductCreated(
            productCount,
            name,
            msg.sender,
            block.timestamp
        );
    }

    // Fonction pour récupérer les détails d'un produit
    function getProduct(uint productId)
        public
        view
        returns (
            uint id,
            string memory name,
            address owner,
            string memory status,
            uint timestamp
        )
    {
        Product memory product = products[productId];
        return (
            product.id,
            product.name,
            product.currentOwner,
            product.status,
            product.timestamp
        );
    }

    // Fonction pour mettre à jour le statut d'un produit
    function updateProductStatus(uint productId, string memory newStatus)
        public
        onlyWhitelisted
    {
        Product storage product = products[productId];
        string memory oldStatus = product.status;
        product.status = newStatus;
        product.timestamp = block.timestamp;

        emit ProductStatusUpdated(
            product.id,
            oldStatus,
            newStatus,
            block.timestamp
        );
    }
}
