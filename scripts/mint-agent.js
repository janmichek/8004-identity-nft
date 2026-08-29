import { ethers } from "hardhat";
import "dotenv/config";
import fs from "fs";

// todo reuse from.env
const REG = "0x8004A818BFB912233c491871b8d84a89A494BD9e";

const ABI = [
  "function register(string) external returns (uint256)",
  "event Registered(uint256 indexed agentId, string agentURI, address indexed owner)"
];

async function main() {
  const json = fs.readFileSync("./agent.json", "utf8");
  const agentURI =
    "data:application/json;base64," + Buffer.from(json).toString("base64");

  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(REG, ABI, signer);

  console.log(`Registering agent from ${signer.address}...`);
  const tx = await contract.register(agentURI);
  console.log(`tx: https://sepolia.mantlescan.xyz/tx/${tx.hash}`);

  const receipt = await tx.wait();
  const event = receipt.logs.find(
    (l) => l.topics[0] === ethers.id("Registered(uint256,string,address)")
  );

  if (event) {
    console.log("agentId:", BigInt(event.topics[1]).toString());
  }
  console.log(`https://sepolia.mantlescan.xyz/tx/${tx.hash}`);
}

main().catch(console.error);
