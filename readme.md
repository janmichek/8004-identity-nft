# 8004 Identity NFT — Mint an ERC-8004 Agent Identity NFT on Mantle

> Simplified walkthrough of [Mint an AI Agent NFT in 15 Minutes (Free)](https://www.youtube.com/watch?v=tj4U2vEDQH4).

## What is ERC-8004?

[ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) (EIP-8004 by Ethereum Foundation / MetaMask / Google / Coinbase) gives AI agents a verifiable on-chain identity. Three registries:

| Registry | Purpose |
|---|---|
| **Identity Registry** | ERC-721 NFT = agent passport. `tokenURI` points to `agent.json` (name, description, image, endpoints). |
| **Reputation Registry** | On-chain feedback/reviews that follow the agent across chains. |
| **Validation Registry** | Cryptographic proof work was done (ZK-SNARKs, TEE attestations). |

Mantle deployed all three on mainnet (Feb). This repo mints on **Mantle Sepolia testnet (chain 5003)** — free, identical to mainnet.

Composes with **MCP** (tools), **x402** (payments), **A2A** (agent-to-agent messaging) → full "agentic internet" citizen.

---

## Prerequisites

- Node.js + npm
- Wallet with private key (e.g. Rabby)
- Mantle Sepolia added to wallet — easiest via [chainlist.org](https://chainlist.org) → search `5003`

## 1. Get Test Gas

1. **Ethereum Sepolia ETH** — mine/claim at Sepolia PoW Faucet (`sepolia-faucet` / PoW faucet shown in video) → sent to your dev wallet.
2. **Mantle Sepolia MNT** — [Mantle Sepolia Faucet](https://faucet.sepolia.mantle.xyz/) → you receive MNT on **Ethereum Sepolia**.
3. **Bridge → Mantle Sepolia** — use the Mantle bridge to `approve` + `bridge` MNT from Ethereum Sepolia to Mantle Sepolia. You'll see balance on Mantle Sepolia after.

> Contracts are already deployed — no deployment needed. Identity: `0x8004...` / Reputation: `0x8004B...` (see Mantle docs for current addresses).

## 2. Host Image + Metadata

Upload to decentralized storage (IPFS via [Pinata](https://pinata.cloud)):

1. Create Pinata account → **Add** → upload NFT image → copy `ipfs://` / gateway URL.
2. Paste that URL into `agent.json` → `image` field (see below).
3. Upload `agent.json` itself to Pinata → copy its gateway URL → use as `AGENT_URI` in `.env`.

## 3. Setup Project

This repo is ready to use — no scaffolding needed:

```bash
npm install
cp .env.example .env
# then edit .env (PK, RPC, AGENT_URI) and agent.json for your agent
```

> The `npm run setup` script from the video just scaffolds a `mint-8004/` demo folder from scratch. You can ignore it when cloning this standalone repo — everything is already configured at the root (`hardhat.config.js:1`, `agent.json:1`, `scripts/mint-agent.js:1`).

### `hardhat.config.js`

```js
import "@nomicfoundation/hardhat-ethers";
import "dotenv/config";
export default {
  solidity: "0.8.24",
  networks: {
    mantleSepolia: {
      type: "http",
      url: process.env.RPC,        // https://rpc.sepolia.mantle.xyz
      chainId: 5003,
      accounts: process.env.PK ? [process.env.PK] : [],
    },
  },
};
```

### `agent.json` — edit for your agent

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004 registration-v1",
  "name": "Goldwing",
  "description": "Your agent description",
  "image": "https://...mypinata.cloud/ipfs/<IMAGE_CID>",
  "services": [{ "name": "web", "endpoint": "https://example.com" }],
  "x402Support": false,
  "active": true,
  "registrations": [],
  "supportedTrust": ["reputation"]
}
```

### `.env`

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

See `.env.example:1` for required variables (`PK`, `RPC`, `AGENT_URI`).

## 4. Mint Script

`scripts/mint-agent.js` (ethers + hardhat) — calls `Identity Registry` `register(string tokenURI)`:

```js
import { ethers } from "hardhat";
// loads Identity Registry ABI + address, creates wallet from PK/RPC,
// calls register(AGENT_URI), logs MantleScan link + tokenId
```

Run:

```bash
npm run mint
# → Agent ID 45 — https://sepolia.mantlescan.xyz/token/0x...?a=45
```

Equivalent to `npx hardhat run scripts/mint-agent.js --network mantleSepolia` (see `package.json:6`).

Verify on [Mantle Sepolia Explorer](https://sepolia.mantlescan.xyz) — token shows 8004 metadata and image from Pinata.

---

## Links

- Video: https://www.youtube.com/watch?v=tj4U2vEDQH4
- ERC-8004: https://eips.ethereum.org/EIPS/eip-8004
- Mantle Sepolia RPC: `https://rpc.sepolia.mantle.xyz` (Chain ID 5003)
- Mantle Sepolia Faucet / Bridge: via Mantle docs
- Pinata: https://pinata.cloud
