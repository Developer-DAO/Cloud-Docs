# Network Overview

D_D Cloud RPC provides access to 60+ blockchain networks across multiple ecosystems. This page gives you a comprehensive overview of all supported networks, their capabilities, and how to connect to them.

## Network Categories

### EVM Compatible Chains

These networks are compatible with the Ethereum Virtual Machine and support standard `eth_*` JSON-RPC methods.

#### Ethereum & Layer 2s

| Network          | Endpoint                                      | Chain ID | Type      | Status    |
| ---------------- | --------------------------------------------- | -------- | --------- | --------- |
| Ethereum Mainnet | `https://rpc.ddcloud.io/eth`                  | 1        | Layer 1   | ✅ Active |
| Ethereum Sepolia | `https://rpc.ddcloud.io/eth-sepolia-testnet`  | 11155111 | Testnet   | ✅ Active |
| Ethereum Holesky | `https://rpc.ddcloud.io/eth-holesky-testnet`  | 17000    | Testnet   | ✅ Active |
| Arbitrum One     | `https://rpc.ddcloud.io/arb-one`              | 42161    | Layer 2   | ✅ Active |
| Arbitrum Sepolia | `https://rpc.ddcloud.io/arb-sepolia-testnet`  | 421614   | Testnet   | ✅ Active |
| Optimism         | `https://rpc.ddcloud.io/op`                   | 10       | Layer 2   | ✅ Active |
| OP Sepolia       | `https://rpc.ddcloud.io/op-sepolia-testnet`   | 11155420 | Testnet   | ✅ Active |
| Base             | `https://rpc.ddcloud.io/base`                 | 8453     | Layer 2   | ✅ Active |
| Base Sepolia     | `https://rpc.ddcloud.io/base-sepolia-testnet` | 84532    | Testnet   | ✅ Active |
| Polygon          | `https://rpc.ddcloud.io/poly`                 | 137      | Sidechain | ✅ Active |
| Polygon Amoy     | `https://rpc.ddcloud.io/poly-amoy-testnet`    | 80002    | Testnet   | ✅ Active |
| Polygon zkEVM    | `https://rpc.ddcloud.io/poly-zkevm`           | 1101     | Layer 2   | ✅ Active |

#### Alternative Layer 1s

| Network           | Endpoint                           | Chain ID   | Consensus | Status    |
| ----------------- | ---------------------------------- | ---------- | --------- | --------- |
| BSC               | `https://rpc.ddcloud.io/bsc`       | 56         | PoSA      | ✅ Active |
| Avalanche C-Chain | `https://rpc.ddcloud.io/avax`      | 43114      | Avalanche | ✅ Active |
| Avalanche DFK     | `https://rpc.ddcloud.io/avax-dfk`  | 53935      | Subnet    | ✅ Active |
| Fantom            | `https://rpc.ddcloud.io/fantom`    | 250        | Lachesis  | ✅ Active |
| Celo              | `https://rpc.ddcloud.io/celo`      | 42220      | BFT       | ✅ Active |
| Harmony           | `https://rpc.ddcloud.io/harmony`   | 1666600000 | FBFT      | ✅ Active |
| Moonbeam          | `https://rpc.ddcloud.io/moonbeam`  | 1284       | PoS       | ✅ Active |
| Moonriver         | `https://rpc.ddcloud.io/moonriver` | 1285       | PoS       | ✅ Active |

#### Emerging Networks

| Network          | Endpoint                                     | Chain ID | Type      | Status    |
| ---------------- | -------------------------------------------- | -------- | --------- | --------- |
| zkSync Era       | `https://rpc.ddcloud.io/zksync-era`          | 324      | zkRollup  | ✅ Active |
| Mantle           | `https://rpc.ddcloud.io/mantle`              | 5000     | Layer 2   | ✅ Active |
| Linea            | `https://rpc.ddcloud.io/linea`               | 59144    | zkRollup  | ✅ Active |
| Scroll           | `https://rpc.ddcloud.io/scroll`              | 534352   | zkRollup  | ✅ Active |
| Blast            | `https://rpc.ddcloud.io/blast`               | 81457    | Layer 2   | ✅ Active |
| Taiko            | `https://rpc.ddcloud.io/taiko`               | 167000   | zkRollup  | ✅ Active |
| Taiko Hekla      | `https://rpc.ddcloud.io/taiko-hekla-testnet` | 167009   | Testnet   | ✅ Active |
| Fraxtal          | `https://rpc.ddcloud.io/fraxtal`             | 252      | Layer 2   | ✅ Active |
| Metis            | `https://rpc.ddcloud.io/metis`               | 1088     | Layer 2   | ✅ Active |
| Boba             | `https://rpc.ddcloud.io/boba`                | 288      | Layer 2   | ✅ Active |
| Gnosis           | `https://rpc.ddcloud.io/gnosis`              | 100      | PoS       | ✅ Active |
| Fuse             | `https://rpc.ddcloud.io/fuse`                | 122      | PoS       | ✅ Active |
| Oasys            | `https://rpc.ddcloud.io/oasys`               | 248      | PoS       | ✅ Active |
| OpBNB            | `https://rpc.ddcloud.io/opbnb`               | 204      | Layer 2   | ✅ Active |
| Ink              | `https://rpc.ddcloud.io/ink`                 | 57073    | Layer 2   | ✅ Active |
| Sonic            | `https://rpc.ddcloud.io/sonic`               | 146      | Layer 1   | ✅ Active |
| zkLink Nova      | `https://rpc.ddcloud.io/zklink-nova`         | 810180   | zkRollup  | ✅ Active |
| XRPL EVM         | `https://rpc.ddcloud.io/xrplevm`             | 1440002  | Sidechain | ✅ Active |
| XRPL EVM Testnet | `https://rpc.ddcloud.io/xrplevm-testnet`     | 1440001  | Testnet   | ✅ Active |

### Non-EVM Chains

These networks use different virtual machines and have their own RPC specifications.

#### Major Layer 1s

| Network        | Endpoint                        | Consensus           | VM           | Status    |
| -------------- | ------------------------------- | ------------------- | ------------ | --------- |
| Solana         | `https://rpc.ddcloud.io/solana` | PoH + PoS           | SVM          | ✅ Active |
| NEAR Protocol  | `https://rpc.ddcloud.io/near`   | Nightshade          | NEAR VM      | ✅ Active |
| Sui            | `https://rpc.ddcloud.io/sui`    | Narwhal & Bullshark | Move VM      | ✅ Active |
| Tron           | `https://rpc.ddcloud.io/tron`   | DPoS                | TVM          | ✅ Active |
| Radix          | `https://rpc.ddcloud.io/radix`  | Cerberus            | Radix Engine | ✅ Active |
| IoTeX          | `https://rpc.ddcloud.io/iotex`  | Roll-DPoS           | IOTX VM      | ✅ Active |
| Pocket Network | `https://rpc.ddcloud.io/pocket` | Tendermint          | Pocket VM    | ✅ Active |

#### Cosmos Ecosystem

| Network | Endpoint                         | SDK Version | Status    |
| ------- | -------------------------------- | ----------- | --------- |
| Osmosis | `https://rpc.ddcloud.io/osmosis` | v0.47.x     | ✅ Active |
| Evmos   | `https://rpc.ddcloud.io/evmos`   | v0.46.x     | ✅ Active |
| Kaia    | `https://rpc.ddcloud.io/kaia`    | v0.47.x     | ✅ Active |
| Kava    | `https://rpc.ddcloud.io/kava`    | v0.46.x     | ✅ Active |
| Sei     | `https://rpc.ddcloud.io/sei`     | v0.47.x     | ✅ Active |

## Network Features

### Archive Node Support

Most networks provide access to historical data:

| Feature        | EVM Chains | Solana | NEAR | Sui | Cosmos |
| -------------- | ---------- | ------ | ---- | --- | ------ |
| Full History   | ✅         | ✅     | ✅   | ✅  | ✅     |
| State at Block | ✅         | ❌     | ✅   | ✅  | ✅     |
| Event Logs     | ✅         | ✅     | ✅   | ✅  | ✅     |
| Trace Methods  | ✅         | ❌     | ❌   | ❌  | ❌     |

### WebSocket Support

Real-time data streaming (coming soon):

| Network Type | Subscriptions                                | Status         |
| ------------ | -------------------------------------------- | -------------- |
| EVM Chains   | `newHeads`, `logs`, `newPendingTransactions` | 🚧 Coming Soon |
| Solana       | `account`, `logs`, `signature`, `slot`       | 🚧 Coming Soon |
| NEAR         | `block`, `transaction`                       | 🚧 Coming Soon |
| Sui          | `event`, `transaction`                       | 🚧 Coming Soon |

## Quick Connection Examples

### EVM Chains (Ethereum-compatible)

```javascript
// Using ethers.js
import { JsonRpcProvider } from "ethers";

const providers = {
  ethereum: new JsonRpcProvider("https://rpc.ddcloud.io/eth"),
  polygon: new JsonRpcProvider("https://rpc.ddcloud.io/poly"),
  arbitrum: new JsonRpcProvider("https://rpc.ddcloud.io/arb-one"),
  base: new JsonRpcProvider("https://rpc.ddcloud.io/base"),
};

// Get latest block from multiple chains
for (const [name, provider] of Object.entries(providers)) {
  const blockNumber = await provider.getBlockNumber();
  console.log(`${name}: Block ${blockNumber}`);
}
```

### Solana

```javascript
import { Connection } from "@solana/web3.js";

const connection = new Connection("https://rpc.ddcloud.io/solana", {
  httpHeaders: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});

const slot = await connection.getSlot();
console.log("Current slot:", slot);
```

### NEAR Protocol

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": "dontcare",
    "method": "status",
    "params": []
  }' \
  https://rpc.ddcloud.io/near
```

### Sui

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "sui_getLatestCheckpointSequenceNumber",
    "params": []
  }' \
  https://rpc.ddcloud.io/sui
```

## Network Selection Guide

### For DeFi Applications

**Recommended networks:**

- **Ethereum**: Largest DeFi ecosystem, highest liquidity
- **Polygon**: Low fees, fast transactions
- **Arbitrum**: Lower fees than Ethereum, high compatibility
- **Base**: Coinbase-backed, growing ecosystem

### For NFT Projects

**Recommended networks:**

- **Ethereum**: Largest NFT marketplace support
- **Polygon**: Low minting costs
- **Solana**: Fast, cheap transactions
- **Base**: Growing creator economy

### For Gaming

**Recommended networks:**

- **Polygon**: Gaming-focused features
- **Avalanche Subnets**: Custom game chains
- **Harmony**: Low latency
- **NEAR**: Sharding for scalability

### For Enterprise

**Recommended networks:**

- **Ethereum**: Battle-tested, institutional adoption
- **Polygon**: Enterprise partnerships
- **Celo**: Mobile-first approach
- **NEAR**: Developer-friendly

## Rate Limits by Network

Different networks have different default rate limits:

| Network Type     | Requests/Second | Requests/Hour | Burst Limit |
| ---------------- | --------------- | ------------- | ----------- |
| Ethereum Mainnet | 100             | 100,000       | 200         |
| Layer 2s         | 200             | 200,000       | 400         |
| Testnets         | 50              | 50,000        | 100         |
| Solana           | 100             | 100,000       | 200         |
| NEAR             | 100             | 100,000       | 200         |
| Cosmos           | 50              | 50,000        | 100         |

> 💡 **Tip**: Contact support for higher rate limits on production applications.

## Network Status

Check real-time network status:

- **Status Page**: [status.ddcloud.io](https://status.ddcloud.io)
- **API Endpoint**: `GET https://api.ddcloud.io/v1/status`
- **Discord Alerts**: [Join our Discord](https://discord.gg/ddcloud)

## Adding New Networks

We regularly add support for new blockchain networks. To request a new network:

1. **Community Vote**: Propose on our [Discord](https://discord.gg/ddcloud)
2. **GitHub Issue**: Create a feature request
3. **Enterprise Request**: Contact our sales team

### Upcoming Networks

Networks we're currently evaluating:

- **Berachain** (Testnet available)
- **Monad** (Coming Q2 2024)
- **Movement** (Coming Q3 2024)
- **Fuel** (Coming Q3 2024)

## Next Steps

- **[EVM Networks](./evm/README.md)** - Detailed EVM chain documentation
- **[Solana Guide](./alt-l1/solana.md)** - Solana-specific methods and examples
- **[NEAR Guide](./alt-l1/near.md)** - NEAR Protocol integration
- **[Testnet Directory](./testnets/README.md)** - Development and testing networks
