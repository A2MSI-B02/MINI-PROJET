const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Whitelist Contract", function () {
  let Whitelist;
  let whitelist;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const WhitelistFactory = await ethers.getContractFactory("Whitelist");
    whitelist = await WhitelistFactory.deploy();
    await whitelist.deployed();
  });

  it("Devrait permettre au propriétaire d'ajouter une adresse à la liste blanche", async function () {
    await whitelist.addToWhitelist(addr1.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.be.true;
  });

  it("Devrait empêcher un non-propriétaire d'ajouter une adresse à la liste blanche", async function () {
    await expect(
      whitelist.connect(addr1).addToWhitelist(addr2.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Devrait permettre au propriétaire de retirer une adresse de la liste blanche", async function () {
    await whitelist.addToWhitelist(addr1.address);
    await whitelist.removeFromWhitelist(addr1.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.be.false;
  });

  it("Devrait vérifier correctement si une adresse est sur la liste blanche", async function () {
    await whitelist.addToWhitelist(addr1.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.be.true;
    expect(await whitelist.isWhitelisted(addr2.address)).to.be.false;
  });
});
