// src/utils/contract.js
import { BrowserProvider, Contract } from "ethers";
import LogisticsTraceabilityABI from "./LogisticsTraceabilityABI.json";

export const switchToSepolia = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xAA36A7" }],
    });
  } catch (error) {
    if (error.code === 4902) {
      alert("Le réseau Sepolia n'est pas ajouté à MetaMask.");
    } else {
      console.error("Erreur lors du changement de réseau :", error);
    }
  }
};

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Veuillez installer Metamask pour utiliser cette application !");
    throw new Error("Metamask non installé");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Remplacez Web3Provider par BrowserProvider pour ethers v6
  const provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  console.log("Network chainId:", network.chainId); // Ajout de log
  if (network.chainId !== 11155111) {
    await switchToSepolia();
  }

  const signer = await provider.getSigner();
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  console.log("Contract address:", contractAddress); // Ajout de log

  // Créer une instance du contrat avec BrowserProvider
  const contract = new Contract(contractAddress, LogisticsTraceabilityABI, signer);

  return { contract, provider };
};
