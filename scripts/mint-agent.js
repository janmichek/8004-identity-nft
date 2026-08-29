import { ethers } from "ethers";
import "dotenv/config";

const REG = (process.env.IDENTITY_REGISTRY).replace(/^Ox/i, "0x");

const ABI = [
  "function register(string) external returns (uint256)",
  "event Registered(uint256 indexed agentId, string agentURI, address indexed owner)"
];

async function main() {
  const agentURI = process.env.AGENT_URI;

  const provider = new ethers.JsonRpcProvider(process.env.RPC);
  const wallet = new ethers.Wallet(process.env.PK, provider);
  const contract = new ethers.Contract(REG, ABI, wallet);

  console.log(`Registering from ${wallet.address}...`);

  const tx = await contract.register(agentURI);
  const receipt = await tx.wait();
  const topic = ethers.id("Registered(uint256,string,address)");
  const event = receipt.logs.find((l) => l.topics[0] === topic);
  if (event) console.log("agentId:", BigInt(event.topics[1]).toString());
  console.log(`✅️ tx: https://sepolia.mantlescan.xyz/tx/${tx.hash}`);
}

main().catch(console.error);
