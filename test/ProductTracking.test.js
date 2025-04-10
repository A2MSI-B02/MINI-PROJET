const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductTracking Contract", function () {
  let ProductTracking;
  let productTracking;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const ProductTrackingFactory = await ethers.getContractFactory("ProductTracking");
    productTracking = await ProductTrackingFactory.deploy();
    await productTracking.deployed();
  });

  it("Devrait permettre au propriétaire d'ajouter un produit", async function () {
    await productTracking.addProduct(1, "Produit A");
    const product = await productTracking.getProduct(1);
    expect(product.name).to.equal("Produit A");
  });

  it("Devrait empêcher un non-propriétaire d'ajouter un produit", async function () {
    await expect(
      productTracking.connect(addr1).addProduct(2, "Produit B")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Devrait retourner les informations correctes d'un produit", async function () {
    await productTracking.addProduct(3, "Produit C");
    const product = await productTracking.getProduct(3);
    expect(product.name).to.equal("Produit C");
  });
});
