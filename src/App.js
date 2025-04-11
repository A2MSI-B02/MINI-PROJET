/* global BigInt */
import React, { useState, useEffect } from "react";
import { getContract } from "./utils/contract";
import "./App.css";

function App() {
  // État pour stocker l'adresse connectée
  const [currentAccount, setCurrentAccount] = useState(null);
  
  // États pour la gestion de la whitelist et des produits
  const [whitelistAddress, setWhitelistAddress] = useState("");
  const [productId, setProductId] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [newProduct, setNewProduct] = useState({
    manufacturer: "",
    lotNumber: "",
    productName: "",
    lotId: "",
    totalProducts: "",
    lastOwner: "",
    purchaseDate: ""
  });

  // Adresse du contrat
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  console.log("Adresse du contrat chargée :", contractAddress);
  if (!contractAddress) {
    throw new Error("Adresse du contrat non définie dans .env");
  }

  // Fonction de connexion à MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Veuillez installer MetaMask !");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la connexion au portefeuille.");
    }
  };

  // Vérifier dès le chargement si un compte est déjà connecté
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  // Fonction pour ajouter une adresse à la whitelist
  const addToWhitelist = async () => {
    try {
      const { contract, provider } = await getContract();

      const network = await provider.getNetwork();
      console.log("Network chainId détecté :", network.chainId);
      if (network.chainId !== 11155111) {
        await switchToSepolia(); // Appel de la fonction pour changer de réseau
      }

      console.log("Contrat récupéré :", contract);
      console.log("Adresse à ajouter :", whitelistAddress);
      const tx = await contract.addToWhitelist(whitelistAddress);
      console.log("Transaction envoyée :", tx);
      await tx.wait();
      alert("Adresse ajoutée en whitelist !");
    } catch (error) {
      console.error("Erreur lors de l'ajout à la whitelist :", error);
      alert("Erreur lors de l'ajout à la whitelist.");
    }
  };

  // Fonction pour ajouter un nouveau produit
  const addProduct = async () => {
    try {
      const { contract, provider } = await getContract();

      const network = await provider.getNetwork();
      console.log("Network chainId détecté :", network.chainId);
      if (network.chainId !== 11155111) {
        alert("Veuillez vous connecter au réseau Sepolia dans Metamask !");
        throw new Error("Réseau incorrect");
      }

      const {
        manufacturer,
        lotNumber,
        productName,
        lotId,
        totalProducts,
        lastOwner,
        purchaseDate
      } = newProduct;

      // Lancer la transaction en convertissant les valeurs numériques en bigint
      const tx = await contract.addProduct(
        manufacturer,
        BigInt(lotNumber),
        productName,
        lotId,
        BigInt(totalProducts),
        lastOwner,
        BigInt(purchaseDate)
      );
      await tx.wait();
      alert("Produit ajouté avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du produit.");
    }
  };

  // Fonction pour récupérer les détails d'un produit
  const getProduct = async () => {
    try {
      const { contract, provider } = await getContract();

      const network = await provider.getNetwork();
      console.log("Network chainId détecté :", network.chainId);
      if (network.chainId !== 11155111) {
        alert("Veuillez vous connecter au réseau Sepolia dans Metamask !");
        throw new Error("Réseau incorrect");
      }

      const product = await contract.getProduct(productId);
      setProductDetails(product);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la récupération du produit.");
    }
  };

  // Fonction pour changer de réseau vers Sepolia
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xAA36A7" }], // 0xAA36A7 est le chainId hexadécimal pour Sepolia
      });
    } catch (error) {
      if (error.code === 4902) {
        alert("Le réseau Sepolia n'est pas ajouté à MetaMask.");
      } else {
        console.error("Erreur lors du changement de réseau :", error);
      }
    }
  };

  // Gestion des entrées du formulaire pour un nouveau produit
  const handleProductChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="App">
      <h1 className="title">Logistics Traceability</h1>

      {/* Bouton de connexion au portefeuille */}
      <div className="section">
        {currentAccount ? (
          <p>Connecté en tant que : {currentAccount}</p>
        ) : (
          <button onClick={connectWallet}>Connecter le portefeuille</button>
        )}
      </div>

      {/* Section Whitelist */}
      <div className="section">
        <h2>Ajouter une adresse en Whitelist</h2>
        <input
          type="text"
          placeholder="Adresse Ethereum"
          value={whitelistAddress}
          onChange={(e) => setWhitelistAddress(e.target.value)}
        />
        <button onClick={addToWhitelist}>Ajouter</button>
      </div>

      {/* Section pour l'ajout d'un produit */}
      <div className="section">
        <h2>Ajouter un Nouveau Produit</h2>
        <input
          type="text"
          name="manufacturer"
          placeholder="Fabricant"
          value={newProduct.manufacturer}
          onChange={handleProductChange}
        />
        <input
          type="number"
          name="lotNumber"
          placeholder="Numéro de Lot"
          value={newProduct.lotNumber}
          onChange={handleProductChange}
        />
        <input
          type="text"
          name="productName"
          placeholder="Nom du Produit"
          value={newProduct.productName}
          onChange={handleProductChange}
        />
        <input
          type="text"
          name="lotId"
          placeholder="ID du Lot"
          value={newProduct.lotId}
          onChange={handleProductChange}
        />
        <input
          type="number"
          name="totalProducts"
          placeholder="Total des Produits"
          value={newProduct.totalProducts}
          onChange={handleProductChange}
        />
        <input
          type="text"
          name="lastOwner"
          placeholder="Dernier Propriétaire"
          value={newProduct.lastOwner}
          onChange={handleProductChange}
        />
        <input
          type="number"
          name="purchaseDate"
          placeholder="Date d'Achat (timestamp)"
          value={newProduct.purchaseDate}
          onChange={handleProductChange}
        />
        <button onClick={addProduct}>Ajouter Produit</button>
      </div>

      {/* Section pour récupérer un produit */}
      <div className="section">
        <h2>Obtenir les Détails d'un Produit</h2>
        <input
          type="number"
          placeholder="ID du Produit"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button onClick={getProduct}>Récupérer</button>
        {productDetails && (
          <div className="product-details">
            <h3>Détails du Produit :</h3>
            <p>
              <strong>Fabricant :</strong> {productDetails.manufacturer}
            </p>
            <p>
              <strong>Numéro de Lot :</strong> {productDetails.lotNumber.toString()}
            </p>
            <p>
              <strong>Nom du Produit :</strong> {productDetails.productName}
            </p>
            <p>
              <strong>ID du Lot :</strong> {productDetails.lotId}
            </p>
            <p>
              <strong>Total des Produits :</strong> {productDetails.totalProducts.toString()}
            </p>
            <p>
              <strong>Dernier Propriétaire :</strong> {productDetails.lastOwner}
            </p>
            <p>
              <strong>Date d'Achat :</strong> {productDetails.purchaseDate.toString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
