# Quick Start Guide

Get up and running with D_D Cloud RPC in minutes. This guide will walk you through creating an account, generating API keys, and making your first blockchain request.

## Step 1: Create Your Account

1. Visit [D_D Cloud Dashboard](https://dashboard.ddcloud.io)
2. Sign up with your email or GitHub account
3. Verify your email address
4. Complete your profile setup

## Step 2: Generate API Keys

Once logged in to your dashboard:

1. Navigate to **API Keys** in the sidebar
2. Click **Create New Key**
3. Give your key a descriptive name (e.g., "My DApp Development")
4. Select the networks you need access to
5. Set rate limits (optional)
6. Click **Generate Key**

> ⚠️ **Important**: Copy your API key immediately. For security reasons, you won't be able to see it again.

## Step 3: Choose Your Network

D_D Cloud supports 60+ blockchain networks. Here are the most popular endpoints:

| Network          | Endpoint                                     | Chain ID |
| ---------------- | -------------------------------------------- | -------- |
| Ethereum Mainnet | `https://rpc.ddcloud.io/eth`                 | 1        |
| Ethereum Sepolia | `https://rpc.ddcloud.io/eth-sepolia-testnet` | 11155111 |
| Polygon          | `https://rpc.ddcloud.io/poly`                | 137      |
| Arbitrum One     | `https://rpc.ddcloud.io/arb-one`             | 42161    |
| Base             | `https://rpc.ddcloud.io/base`                | 8453     |
| Solana Mainnet   | `https://rpc.ddcloud.io/solana`              | -        |
| NEAR Mainnet     | `https://rpc.ddcloud.io/near`                | -        |

[View all supported networks →](../networks/overview.md)

## Step 4: Make Your First Request

### Using cURL

```bash
# Get the latest Ethereum block number
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_blockNumber",
    "params": [],
    "id": 1
  }' \
  https://rpc.ddcloud.io/eth
```

### Using JavaScript (Node.js)

```javascript
// Using fetch API
const response = await fetch("https://rpc.ddcloud.io/eth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_API_KEY",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
});

const data = await response.json();
console.log("Latest block:", parseInt(data.result, 16));
```

### Using ethers.js

```javascript
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});

// Get latest block number
const blockNumber = await provider.getBlockNumber();
console.log("Latest block:", blockNumber);

// Get account balance
const balance = await provider.getBalance(
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45"
);
console.log("Balance:", ethers.formatEther(balance), "ETH");
```

### Using web3.js

```javascript
import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.HttpProvider("https://rpc.ddcloud.io/eth", {
    headers: [
      {
        name: "Authorization",
        value: "Bearer YOUR_API_KEY",
      },
    ],
  })
);

// Get latest block number
const blockNumber = await web3.eth.getBlockNumber();
console.log("Latest block:", blockNumber);

// Get account balance
const balance = await web3.eth.getBalance(
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45"
);
console.log("Balance:", web3.utils.fromWei(balance, "ether"), "ETH");
```

## Step 5: Explore Non-EVM Chains

### Solana Example

```javascript
// Using @solana/web3.js
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("https://rpc.ddcloud.io/solana", {
  httpHeaders: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});

// Get account balance
const publicKey = new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");
const balance = await connection.getBalance(publicKey);
console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");

// Get latest slot
const slot = await connection.getSlot();
console.log("Latest slot:", slot);
```

### NEAR Example

```bash
# Get account information
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": "dontcare",
    "method": "query",
    "params": {
      "request_type": "view_account",
      "finality": "final",
      "account_id": "example.near"
    }
  }' \
  https://rpc.ddcloud.io/near
```

## Common Patterns

### Batch Requests

Save on API calls by batching multiple requests:

```javascript
const batchRequest = [
  {
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  },
  {
    jsonrpc: "2.0",
    method: "eth_gasPrice",
    params: [],
    id: 2,
  },
  {
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45", "latest"],
    id: 3,
  },
];

const response = await fetch("https://rpc.ddcloud.io/eth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_API_KEY",
  },
  body: JSON.stringify(batchRequest),
});

const results = await response.json();
console.log("Batch results:", results);
```

### Error Handling

Always implement proper error handling:

```javascript
async function makeRPCCall(method, params) {
  try {
    const response = await fetch("https://rpc.ddcloud.io/eth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method,
        params,
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }

    return data.result;
  } catch (error) {
    console.error("RPC call failed:", error);
    throw error;
  }
}
```

## Next Steps

Now that you've made your first request, explore more advanced features:

- **[Authentication Details](./authentication.md)** - Learn about API key management and security
- **[Rate Limits](./rate-limits.md)** - Understand usage limits and optimization
- **[Network-Specific Guides](../networks/overview.md)** - Deep dive into specific blockchain networks
- **[Method Reference](../methods/overview.md)** - Explore all available RPC methods
- **[Code Examples](../examples/javascript/README.md)** - See real-world implementation examples

## Need Help?

- 📧 **Email**: support@ddcloud.io
- 💬 **Discord**: [Join our community](https://discord.gg/ddcloud)
- 📖 **Documentation**: Browse our comprehensive guides
- 🐛 **Issues**: [Report bugs on GitHub](https://github.com/ddcloud/rpc-docs/issues)
