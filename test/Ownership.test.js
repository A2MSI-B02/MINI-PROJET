const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ownership Contract", function () {
  let Ownership;
  let ownership;
  let owner;
  let addr1;

  beforeEach(async function () {
    // Récupérer les comptes disponibles
    [owner, addr1] = await ethers.getSigners();

    // Déployer le contrat Ownership
    const OwnershipFactory = await ethers.getContractFactory("Ownership");
    ownership = await OwnershipFactory.deploy();
    await ownership.deployed();
  });

  it("Devrait assigner le déployeur comme propriétaire initial", async function () {
    expect(await ownership.owner()).to.equal(owner.address);
  });

  it("Devrait transférer la propriété à une nouvelle adresse", async function () {
    await ownership.transferOwnership(addr1.address);
    expect(await ownership.owner()).to.equal(addr1.address);
  });

  it("Devrait émettre un événement lors du transfert de propriété", async function () {
    await expect(ownership.transferOwnership(addr1.address))
      .to.emit(ownership, "OwnershipTransferred")
      .withArgs(owner.address, addr1.address);
  });

  it("Devrait empêcher un non-propriétaire de transférer la propriété", async function () {
    await expect(
      ownership.connect(addr1).transferOwnership(addr1.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Devrait empêcher le transfert de propriété à l'adresse zéro", async function () {
    await expect(
      ownership.transferOwnership(ethers.constants.AddressZero)
    ).to.be.revertedWith("Ownable: new owner is the zero address");
  });
});
