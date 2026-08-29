// hardhat.config.js - kept simple, no hardhat-ethers needed for standalone mint script
import "dotenv/config";
export default {
  solidity: "0.8.24",
  networks: {
    mantleSepolia: {
      type: "http",
      url: process.env.RPC,
      chainId: 5003,
      accounts: process.env.PK ? [process.env.PK] : [],
    },
  },
};
