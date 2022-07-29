const hre = require("hardhat");

async function main() {
    //1. deploy InsecureAirdrop contract
    const airdrop_c = await hre.ethers.getContractFactory("InsecureAirdrop");
    const airdrop = await airdrop_c.deploy(10);
    await airdrop.deployed();
    console.log("InsecureAirdrop contract addr =>",airdrop.address);

    //2. deploy Attack contract
    const attack_c = await hre.ethers.getContractFactory("Attack");
    const attack = await attack_c.deploy(airdrop.address);
    await attack.deployed();
    console.log("Attacker contract addr =>",attack.address);

    console.log("Before attacker balance => ",await attack.getBalance());
    await attack.attack(2);
    console.log("After attacker balance => ",await attack.getBalance());
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
