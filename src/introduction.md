# D_D Cloud RPC Documentation

Welcome to the comprehensive documentation for D_D Cloud's multi-chain RPC service. Our infrastructure provides reliable, high-performance access to over 60 blockchain networks through standardized JSON-RPC interfaces.

## What is D_D Cloud RPC?

D_D Cloud RPC is a managed blockchain infrastructure service that provides:

- **Multi-chain Support**: Access to 60+ blockchain networks including Ethereum, Solana, NEAR, Sui, and many more
- **High Availability**: Enterprise-grade uptime with automatic failover and load balancing
- **Scalable Infrastructure**: From development to production, our service scales with your needs
- **WebSocket Support**: Real-time blockchain data streaming (coming soon)
- **Developer-Friendly**: Simple authentication, comprehensive documentation, and extensive code examples

## Supported Networks

Our service supports a wide range of blockchain networks:

### EVM Compatible Chains

- **Ethereum** and testnets (Sepolia, Holesky)
- **Layer 2 Solutions**: Arbitrum, Optimism, Base, Polygon, zkSync Era
- **Alternative L1s**: BSC, Avalanche, Fantom, Celo, Harmony
- **Emerging Networks**: Blast, Linea, Scroll, Taiko, Mantle

### Non-EVM Chains

- **Solana**: High-performance blockchain with sub-second finality
- **NEAR Protocol**: Sharded, developer-friendly blockchain
- **Sui**: Move-based blockchain with parallel execution
- **Cosmos Ecosystem**: Osmosis, Evmos, Kaia, Kava, Sei
- **Others**: Tron, Radix, IoTeX, Pocket Network

## Key Features

### 🚀 **High Performance**

- Sub-100ms response times globally
- Automatic request routing to nearest data centers
- Intelligent caching for frequently accessed data

### 🔒 **Enterprise Security**

- API key authentication
- Rate limiting and DDoS protection
- SOC 2 compliant infrastructure

### 📊 **Comprehensive Analytics**

- Real-time usage monitoring
- Detailed request analytics
- Performance metrics and alerts

### 🛠 **Developer Experience**

- RESTful JSON-RPC APIs
- Extensive code examples in multiple languages
- Interactive API explorer
- Comprehensive error handling

## Getting Started

Ready to start building? Here's what you need to do:

1. **[Sign up](./getting-started/quick-start.md)** for a D_D Cloud account
2. **[Generate API keys](./getting-started/authentication.md)** for your projects
3. **[Choose your network](./networks/overview.md)** from our supported chains
4. **[Make your first request](./getting-started/quick-start.md#making-your-first-request)** using our RPC endpoints

## Quick Example

Here's a simple example of fetching the latest Ethereum block:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://rpc.ddcloud.io/eth
```

```javascript
// Using ethers.js
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});

const blockNumber = await provider.getBlockNumber();
console.log("Latest block:", blockNumber);
```

## What's Next?

- **New to blockchain development?** Start with our [Quick Start Guide](./getting-started/quick-start.md)
- **Migrating from another provider?** Check our [Migration Guides](./troubleshooting/migration.md)
- **Need specific network info?** Browse our [Network Documentation](./networks/overview.md)
- **Looking for code examples?** Explore our [Code Examples](./examples/javascript/README.md)

## Support

Need help? We're here for you:

- 📧 **Email**: support@ddcloud.io
- 💬 **Discord**: [Join our community](https://discord.gg/ddcloud)
- 📖 **Documentation**: You're reading it!
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ddcloud/rpc-docs/issues)

---

_Last updated: {{ date }}_
