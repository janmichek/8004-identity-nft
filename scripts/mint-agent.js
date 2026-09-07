import { ethers } from "ethers";
import "dotenv/config";

const REG = (process.env.IDENTITY_REGISTRY).replace(/^Ox/i, "0x");

const ABI = [
  "function register(string) external returns (uint256)",
  "event Registered(uint256 indexed agentId, string agentURI, address indexed owner)"
];

async function main() {
  const agentURI = process.env.AGENT_URI;
  if (!agentURI) throw new Error("AGENT_URI not set in .env");

  const provider = new ethers.JsonRpcProvider(process.env.RPC);
  const wallet = new ethers.Wallet(process.env.PK, provider);
  const contract = new ethers.Contract(REG, ABI, wallet);

  console.log(`Registering agent...`);
  console.log(`Owner: ${wallet.address}`);

  const tx = await contract.register(agentURI);
  const receipt = await tx.wait();
  const topic = ethers.id("Registered(uint256,string,address)");
  const event = receipt.logs.find((l) => l.topics[0] === topic);
  let agentId;
  if (event) {
    agentId = BigInt(event.topics[1]).toString();
  }

  console.log(`✅ =========== SUCESS =========== ✅️`);
  console.log(`🆔 agentId: ${agentId}`);
  console.log(`🔀️ Tx: https://sepolia.mantlescan.xyz/tx/${tx.hash}`);
  if (agentId) {
    console.log(`🖼️  NFT: https://sepolia.mantlescan.xyz/nft/${REG}/${agentId}`);
    console.log(`🏷️  Token: https://sepolia.mantlescan.xyz/token/${REG}?a=${agentId}`);
    console.log(`🔍 8004scan: https://testnet.8004scan.io/agents/mantle-sepolia/${agentId}`);
  } else {
    console.log(`🔍 8004scan: https://testnet.8004scan.io/agents/mantle-sepolia — search registry ${REG} / tx ${tx.hash}`);
  }
}

main().catch(console.error);
