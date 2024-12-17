const { ethers, run, network } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractFactory = await ethers.getContractFactory("CryptoDevs");
  console.log("Deploying contract...");
  const contract = await contractFactory.deploy("0xa4efac5E32AEBfEe0471b14222aF63f66FfBb9c6");
  await contract.waitForDeployment();
  console.log("Contract deployed to:", contract.target);
  if (network.name === "sepolia" && process.env.ETHERSCAN_API_KEY) {
    await contract.deploymentTransaction().wait(6);
    await verify(contract.target, ["0xa4efac5E32AEBfEe0471b14222aF63f66FfBb9c6"]);
  }
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
