const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigner();
    const ether_cc = await hre.ethers.getContractFacory("InsecureEtherValut");
    const ether = await ether_cc.deploy();
    await ether.deployed();
    console.log("InsecureEtherValut addr => ",ether.address);

    const attack_cc = await hre.ethers.getContractFacory("Attack");
    const attack = await attack_cc.deploy(ether.address);
    await attack.deployed();
    console.log("Attack #1 deployed to => ",attack.address);

    const attack_cc2 = await hre.ethers.getContractFacory("Attack");
    const attack2 = await attack_cc2.deploy(ether.address);
    await attack2.deployed();
    console.log("Attack #2 deployed to => ",attack2.address);

    const transaction1 = await owner.sendTransaction({to:ether.address,value:ethers.utils.parseEther("4")});
    const transaction2 = await owner.sendTransaction({to:attack.address,value:ethers.utils.parseEther("1")});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
