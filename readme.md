# 8004 Customized NFT — Mint an ERC-8004 Agent Identity on Mantle

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

## Clean Transcript

<details>
<summary>Full transcript (auto-generated, deduplicated)</summary>

So, I've been making AI agents for months now. I've been making marketing agents and trading bots, all of that good stuff. If you want to build them too, they're on my channel. But, all of my agents are missing one crucial piece, which is their identity. Okay, they can't prove who they are, they can't prove what they can do, they can't prove what they have done. They can't build that like four-star, five-star reputation that you'd see on Amazon when you're buying some sort of product. They can't be found or seen by other agents. They can't be hired by other agents. But, thankfully, the Ethereum Foundation, they have saved us again. They have built EIP 8004. Okay, and today I'm going to show you how to mint your own 8004 NFT. I'm going to do this on Mantle Network. And this is going to give your agents real verifiable on-chain identities. The Ethereum Foundation created ERC 8004. It's authored by people from MetaMask, from Ethereum, from Google, from Coinbase. And it introduces three really simple registries. The first is the identity registry. Each agent gets a unique ERC-721 NFT. That NFT is your agent's passport. It points to things like the JSON file with the agent's name, the description, the image, how to talk to it. All right, the second one is the reputation registry. Once your agent does the work, people can leave feedback. That feedback follows your agent across platforms. So, an agent that does well can show up on one chain and every other chain on the agent knows that it's able to do its job. And third is a validation registry. This is for cryptographic proof work, things like ZK-SNARKs, TEE attestations. So, you can mathematically prove your agent actually claims to do what it did. Mantle deployed all three of these registries on mainnet in February. They're positioning themselves as like the internet of agents, especially for real-world assets and DeFi. So, today I'm going to mint on their Sepolia testnet so that we don't need to spend real money. But, the process is identical to the mainnet minting. And here's the part I love, is that the 8004 it plays nice with everything else I've been building on this channel. So it plays well with MPC for agent tools, X402 for agent payments, A2A for agents talking to each other. So you drop the ERC 8004 on top and now your agent has all the tools, identity tools, payments, communication, a full citizen of the agentic internet. All right, enough talk. Let's actually mint one. I'm going to show you how to do it step-by-step. It's going to take about 15 minutes start to finish. No contracts to deploy because the registries are already live. Here we go. Okay, so this is my plan, mint a customized ERC 8004 agent NFT. The first step would be to put mantle into your wallet that you're using. I'm using Rabby Wallet. I've already added this in, okay? But if you want to do that, you can go to chainlist.org and go to 5003, which is the mantle Sepolia. The next thing you're going to need to do is you're going to need to get some gas. You're going to need to get some mantle and you're going to bridge. Okay, so if you want to get some gas, here is a good resource, the Sepolia proof of work faucet. So I'm going to stop mining and claim those tokens, claim rewards. So this is going to send Ethereum Sepolia to my developer wallet. The other thing you're going to want to do is go to the mantle faucet and get some mantle to your wallet. But the problem is this mantle is actually on Ethereum Sepolia. We want to move it to mantle Sepolia. So to do that, you have a bridge. You can see here is my 999. I also have some gas in here from this faucet here and I'm going to click approve and bridge. Great. So we now have some mantle on our mantle Sepolia wallet. Going back to the plan, so this is all done. Just to note, here are the two contracts. The 8004 is the identity registry and the 8004B is the reputation registry. The next step is you're going to need to put your NFT image onto the decentralized internet, okay? So you can do this in many different ways. You can do IPFS, you can do Imgur, which is not decentralized. And I'm using Pinata today. So this is Pinata. You can see I already have my image here. It looks like this. Okay, so this is already pinned Pinata. To do that, just make an account, click add, and then you can easily add it in. Okay, cool. So, we have that. I'm actually going to copy this. Going back to the plan, the next step I have broken this down and made it as simple as possible. So, the first step is to initialize the project. I have this giant chunk of text here. I've copied that and pasted it in here. I'm not going to break down every single thing, but essentially what it does is it goes to the desktop, it makes a new folder, it goes into that folder, it initializes node package manager, and then it installs some dependencies. Everything else here is just kind of pre-editing some files, and then it opens VS Code. So, when I click run, it should install all the stuff, create a new folder, and then open it in VS Code. Okay, so we have VS Code here. I can see it's made all these things. It's made it's set up NPM. It has an empty agent file. It has an empty mint and has an empty ENV. Good. Okay, so next step is we're going to edit the hardhat config. So, I'm just going to copy this. I will talk about this in VS Code when I show it to you. Right here. So, the hardhat config, you can see right now it's empty. I'm just going to paste that in like that. Okay, so we have import hardhats, we have import the ENV, we have Mantle Sepolia, and we have it looking at the ENV the private key. The next step setting up the project files. So, this agent.json, this is actually really important for the ERC-8004. So, I'm just going to copy this. And in here, click on agent.json and just paste that in. Okay, so this is the stuff that you're going to want to edit for your own agent. Okay, for me, I have it's called Goldwing, it has this whatever. So, you're going to be changing this stuff to your own. This right here is really important, the image. Okay, so this is where your Pinata URL goes. So, this is my URL right here. So, I'm going to copy that. Paste this in. Right here. Okay, so that is the image so that registries know what image to use for my NFT. The other thing to here, these are services. So, this is just some of my information. You can see extra support is off. Registrations, you can add more stuff in here. Okay, so whatever you want to do, you're adding into this file. This is the main important 8004 file. I'm going to save that. I'm also going to save the hardhat. The next thing is you're going to want to set up your ENV. Okay, so your private key for the wallet that has the mantle in it. The RPC, you can just use the main one, rpc.sepolia.mantle.xyz. And then your agent URI. Okay, so that is important. That is this file that we just made. Okay, so in order to get that onto Pinata, you have to do the same thing. So, go to Pinata. You're going to upload the file that you just created. Okay, and then you're going to open this and get the URL just like the other one. And then I'm going to put that into the ENV, okay, as well. So, once you have set up ENV, it should look something like this. Here. Okay, so private key, RPC, and the agent URI. Okay, and the final step is to create this minting script. So, what this is going to do is it's going to mint your NFT. It's going to actually create this thing on chain. And it's going to create it through the 8004 contract. So, to do this, you're going to put it into scripts and mint agent. So, I'm going to go here. Mint agent. Just paste this in. This has all the information it needs in order to mint. It has the address for the registry. Has the ABI for the functions. It has all of the ethers commands like RPC, wallet. Also, at the end it's going to console log MantleScan. So, save that. And if you followed my step-by-step, that's all you're going to have to do. You can then run this command in that folder. Just paste it in there, click enter. It's going to be using the private key that I entered from my ENV in order to mint this. There we go, and it is done. So, agent ID 45, I can click this link and it will show me on the testnet chain. It looks like this. Okay, so gold wing, I see double that, I can fix it. But, it is in the 8004 contract address and you can see it has the 8004 metadata. So, now this is an official 8004 agent that can start to rack up some identity. All right, so if you found this useful, please hit subscribe. I cover AI automation and crypto stuff every single week. I build all this stuff just so you can build it yourselves as well. Thank you for watching and I'll see you in the next video. Goodbye.

</details>
