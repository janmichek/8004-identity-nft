// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

interface IIdentityRegistry {
    function register(string calldata agentURI) external returns (uint256);
    event Registered(uint256 indexed agentId, string agentURI, address indexed owner);
}

contract MintAgent is Script {
    function run() external {
        string memory agentURI = vm.envString("AGENT_URI");
        address registry = vm.envAddress("IDENTITY_REGISTRY");

        uint256 pk = vm.envUint("PK");
        console2.log("Sender:", vm.addr(pk));

        vm.startBroadcast(pk);
        uint256 agentId = IIdentityRegistry(registry).register(agentURI);
        vm.stopBroadcast();

        // Mimic original scripts/mint-agent.js verbose output
        console2.log(unicode"✅ =========== SUCCESS =========== ✅");
        console2.log(string.concat(unicode"🆔 agentId: ", vm.toString(agentId)));
        console2.log(string.concat(unicode"👤 Owner: ", vm.toString(vm.addr(pk))));
        console2.log(string.concat("Registry: ", vm.toString(registry)));
        // Tx hash is printed by forge in broadcast logs; also saved to broadcast/MintAgent.s.sol/5003/run-latest.json
        console2.log(unicode"🔀 Tx: https://sepolia.mantlescan.xyz/tx/<see broadcast output>");
        console2.log(string.concat(unicode"🖼️  NFT: https://sepolia.mantlescan.xyz/nft/", vm.toString(registry), "/", vm.toString(agentId)));
        console2.log(string.concat(unicode"🏷️  Token: https://sepolia.mantlescan.xyz/token/", vm.toString(registry), "?a=", vm.toString(agentId)));
        console2.log(string.concat(unicode"🔍 8004scan: https://testnet.8004scan.io/agents/mantle-sepolia/", vm.toString(agentId)));
    }
}
