# Ethers.js Integration

This guide shows how to integrate D_D Cloud RPC with ethers.js, one of the most popular Ethereum JavaScript libraries.

## Installation

```bash
npm install ethers
# or
yarn add ethers
```

## Basic Setup

### Single Network Connection

```javascript
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});

// Test the connection
const blockNumber = await provider.getBlockNumber();
console.log("Current block:", blockNumber);
```

### Multi-Network Setup

```javascript
import { JsonRpcProvider } from "ethers";

class MultiChainProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.providers = new Map();

    // Initialize providers for different networks
    this.networks = {
      ethereum: { url: "https://rpc.ddcloud.io/eth", chainId: 1 },
      polygon: { url: "https://rpc.ddcloud.io/poly", chainId: 137 },
      arbitrum: { url: "https://rpc.ddcloud.io/arb-one", chainId: 42161 },
      base: { url: "https://rpc.ddcloud.io/base", chainId: 8453 },
      optimism: { url: "https://rpc.ddcloud.io/op", chainId: 10 },
    };

    // Create providers
    for (const [name, config] of Object.entries(this.networks)) {
      this.providers.set(
        name,
        new JsonRpcProvider(config.url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
      );
    }
  }

  getProvider(network) {
    const provider = this.providers.get(network);
    if (!provider) {
      throw new Error(`Unsupported network: ${network}`);
    }
    return provider;
  }

  async getBlockNumber(network) {
    return await this.getProvider(network).getBlockNumber();
  }

  async getBalance(network, address) {
    return await this.getProvider(network).getBalance(address);
  }
}

// Usage
const multiProvider = new MultiChainProvider("YOUR_API_KEY");

// Get latest blocks from multiple chains
const networks = ["ethereum", "polygon", "arbitrum"];
for (const network of networks) {
  const blockNumber = await multiProvider.getBlockNumber(network);
  console.log(`${network}: Block ${blockNumber}`);
}
```

## Account Operations

### Getting Account Balance

```javascript
import { JsonRpcProvider, formatEther } from "ethers";

const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: { Authorization: "Bearer YOUR_API_KEY" },
});

async function getAccountInfo(address) {
  try {
    // Get balance
    const balance = await provider.getBalance(address);
    const balanceEth = formatEther(balance);

    // Get transaction count (nonce)
    const transactionCount = await provider.getTransactionCount(address);

    // Get code (to check if it's a contract)
    const code = await provider.getCode(address);
    const isContract = code !== "0x";

    return {
      address,
      balance: balanceEth,
      transactionCount,
      isContract,
    };
  } catch (error) {
    console.error("Error getting account info:", error);
    throw error;
  }
}

// Usage
const accountInfo = await getAccountInfo(
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45"
);
console.log(accountInfo);
```

### Historical Balance Queries

```javascript
async function getBalanceHistory(address, blocks) {
  const balanceHistory = [];

  for (const blockNumber of blocks) {
    try {
      const balance = await provider.getBalance(address, blockNumber);
      const block = await provider.getBlock(blockNumber);

      balanceHistory.push({
        blockNumber,
        timestamp: block.timestamp,
        balance: formatEther(balance),
        balanceWei: balance.toString(),
      });
    } catch (error) {
      console.error(`Error getting balance at block ${blockNumber}:`, error);
    }
  }

  return balanceHistory;
}

// Get balance at specific blocks
const blocks = [18000000, 18500000, 19000000];
const history = await getBalanceHistory(
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
  blocks
);
console.log(history);
```

## Transaction Operations

### Sending Transactions

```javascript
import { JsonRpcProvider, Wallet, parseEther } from "ethers";

const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: { Authorization: "Bearer YOUR_API_KEY" },
});

// Create wallet instance
const wallet = new Wallet("YOUR_PRIVATE_KEY", provider);

async function sendTransaction(to, amount) {
  try {
    // Get current gas price
    const gasPrice = await provider.getGasPrice();

    // Prepare transaction
    const tx = {
      to,
      value: parseEther(amount),
      gasPrice,
      gasLimit: 21000,
    };

    // Send transaction
    const txResponse = await wallet.sendTransaction(tx);
    console.log("Transaction sent:", txResponse.hash);

    // Wait for confirmation
    const receipt = await txResponse.wait();
    console.log("Transaction confirmed:", receipt.hash);

    return receipt;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
}

// Usage (on testnet)
// await sendTransaction('0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45', '0.01');
```

### EIP-1559 Transactions

```javascript
async function sendEIP1559Transaction(to, amount) {
  try {
    // Get fee data
    const feeData = await provider.getFeeData();

    const tx = {
      to,
      value: parseEther(amount),
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      gasLimit: 21000,
      type: 2, // EIP-1559 transaction
    };

    const txResponse = await wallet.sendTransaction(tx);
    console.log("EIP-1559 transaction sent:", txResponse.hash);

    const receipt = await txResponse.wait();
    return receipt;
  } catch (error) {
    console.error("EIP-1559 transaction failed:", error);
    throw error;
  }
}
```

### Transaction Monitoring

```javascript
async function monitorTransaction(txHash) {
  console.log(`Monitoring transaction: ${txHash}`);

  try {
    // Get initial transaction
    let tx = await provider.getTransaction(txHash);
    console.log("Transaction found:", tx);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Get detailed receipt information
    const detailedReceipt = await provider.getTransactionReceipt(txHash);

    return {
      hash: txHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
      status: receipt.status === 1 ? "success" : "failed",
      logs: detailedReceipt.logs,
    };
  } catch (error) {
    console.error("Error monitoring transaction:", error);
    throw error;
  }
}

// Usage
// const result = await monitorTransaction('0x...');
```

## Smart Contract Interaction

### Reading Contract Data

```javascript
import { JsonRpcProvider, Contract } from "ethers";

const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: { Authorization: "Bearer YOUR_API_KEY" },
});

// ERC-20 Token ABI (simplified)
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

async function getTokenInfo(tokenAddress) {
  const contract = new Contract(tokenAddress, ERC20_ABI, provider);

  try {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      totalSupply: totalSupply.toString(),
    };
  } catch (error) {
    console.error("Error getting token info:", error);
    throw error;
  }
}

// Usage - USDC on Ethereum
const usdcInfo = await getTokenInfo(
  "0xA0b86a33E6441b8e8C7C7b0b8e8e8e8e8e8e8e8e"
);
console.log(usdcInfo);
```

### Writing to Contracts

```javascript
const wallet = new Wallet("YOUR_PRIVATE_KEY", provider);

// ERC-20 Transfer ABI
const ERC20_TRANSFER_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

async function transferToken(tokenAddress, to, amount) {
  const contract = new Contract(tokenAddress, ERC20_TRANSFER_ABI, wallet);

  try {
    // Estimate gas
    const gasEstimate = await contract.transfer.estimateGas(to, amount);

    // Send transaction with 20% gas buffer
    const tx = await contract.transfer(to, amount, {
      gasLimit: (gasEstimate * 120n) / 100n,
    });

    console.log("Transfer transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transfer confirmed:", receipt.hash);

    return receipt;
  } catch (error) {
    console.error("Transfer failed:", error);
    throw error;
  }
}
```

## Event Monitoring

### Filtering Events

```javascript
async function getTransferEvents(tokenAddress, fromBlock, toBlock) {
  const contract = new Contract(
    tokenAddress,
    ["event Transfer(address indexed from, address indexed to, uint256 value)"],
    provider
  );

  try {
    const filter = contract.filters.Transfer();
    const events = await contract.queryFilter(filter, fromBlock, toBlock);

    return events.map((event) => ({
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      from: event.args.from,
      to: event.args.to,
      value: event.args.value.toString(),
    }));
  } catch (error) {
    console.error("Error getting events:", error);
    throw error;
  }
}

// Get USDC transfers from last 1000 blocks
const currentBlock = await provider.getBlockNumber();
const transfers = await getTransferEvents(
  "0xA0b86a33E6441b8e8C7C7b0b8e8e8e8e8e8e8e8e",
  currentBlock - 1000,
  currentBlock
);
console.log(`Found ${transfers.length} transfers`);
```

### Real-time Event Listening

```javascript
async function listenToEvents(tokenAddress) {
  const contract = new Contract(
    tokenAddress,
    ["event Transfer(address indexed from, address indexed to, uint256 value)"],
    provider
  );

  // Listen to Transfer events
  contract.on("Transfer", (from, to, value, event) => {
    console.log("New transfer:", {
      from,
      to,
      value: value.toString(),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
    });
  });

  console.log("Listening for Transfer events...");
}

// Start listening (requires WebSocket support - coming soon)
// await listenToEvents('0xA0b86a33E6441b8e8C7C7b0b8e8e8e8e8e8e8e8e');
```

## Advanced Features

### Batch Operations

```javascript
async function batchOperations() {
  const addresses = [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "0x8ba1f109551bD432803012645Hac136c",
  ];

  // Batch balance queries
  const balancePromises = addresses.map((address) =>
    provider.getBalance(address)
  );

  const balances = await Promise.all(balancePromises);

  return addresses.map((address, index) => ({
    address,
    balance: formatEther(balances[index]),
  }));
}

const batchResults = await batchOperations();
console.log(batchResults);
```

### Custom Provider with Retry Logic

```javascript
class RetryProvider extends JsonRpcProvider {
  constructor(url, options = {}) {
    super(url, options);
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  async send(method, params) {
    let lastError;

    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await super.send(method, params);
      } catch (error) {
        lastError = error;

        // Don't retry on certain errors
        if (error.code === -32602 || error.code === -32600) {
          throw error;
        }

        if (i < this.maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryDelay * (i + 1))
          );
        }
      }
    }

    throw lastError;
  }
}

// Usage
const retryProvider = new RetryProvider("https://rpc.ddcloud.io/eth", {
  headers: { Authorization: "Bearer YOUR_API_KEY" },
  maxRetries: 3,
  retryDelay: 1000,
});
```

## Error Handling

### Comprehensive Error Handling

```javascript
class EthersErrorHandler {
  static handle(error) {
    if (error.code === "NETWORK_ERROR") {
      console.error("Network error - check your connection");
      return "NETWORK_ERROR";
    }

    if (error.code === "TIMEOUT") {
      console.error("Request timeout - try again");
      return "TIMEOUT";
    }

    if (error.code === "INSUFFICIENT_FUNDS") {
      console.error("Insufficient funds for transaction");
      return "INSUFFICIENT_FUNDS";
    }

    if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
      console.error("Cannot estimate gas - transaction may fail");
      return "GAS_ESTIMATION_FAILED";
    }

    if (error.reason) {
      console.error("Transaction reverted:", error.reason);
      return "TRANSACTION_REVERTED";
    }

    console.error("Unknown error:", error);
    return "UNKNOWN_ERROR";
  }
}

// Usage in async functions
try {
  const balance = await provider.getBalance(address);
  console.log("Balance:", formatEther(balance));
} catch (error) {
  const errorType = EthersErrorHandler.handle(error);
  // Handle different error types appropriately
}
```

## Best Practices

### 1. Connection Management

```javascript
class ConnectionManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.providers = new Map();
  }

  getProvider(network) {
    if (!this.providers.has(network)) {
      const config = this.getNetworkConfig(network);
      const provider = new JsonRpcProvider(config.url, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });

      this.providers.set(network, provider);
    }

    return this.providers.get(network);
  }

  getNetworkConfig(network) {
    const configs = {
      ethereum: { url: "https://rpc.ddcloud.io/eth" },
      polygon: { url: "https://rpc.ddcloud.io/poly" },
      // ... other networks
    };

    if (!configs[network]) {
      throw new Error(`Unsupported network: ${network}`);
    }

    return configs[network];
  }
}
```

### 2. Gas Optimization

```javascript
async function optimizeGas(transaction) {
  try {
    // Get current network conditions
    const feeData = await provider.getFeeData();
    const gasPrice = await provider.getGasPrice();

    // Estimate gas limit
    const gasEstimate = await provider.estimateGas(transaction);

    // Add 20% buffer to gas limit
    const gasLimit = (gasEstimate * 120n) / 100n;

    return {
      ...transaction,
      gasLimit,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    };
  } catch (error) {
    console.error("Gas optimization failed:", error);
    throw error;
  }
}
```

### 3. Rate Limiting

```javascript
class RateLimitedProvider {
  constructor(provider, requestsPerSecond = 10) {
    this.provider = provider;
    this.requestQueue = [];
    this.isProcessing = false;
    this.interval = 1000 / requestsPerSecond;
  }

  async request(method, params) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ method, params, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const { method, params, resolve, reject } = this.requestQueue.shift();

      try {
        const result = await this.provider.send(method, params);
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Wait before next request
      if (this.requestQueue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.interval));
      }
    }

    this.isProcessing = false;
  }
}
```

## Next Steps

- **[Web3.js Integration](./web3js.md)** - Alternative JavaScript library
- **[Viem Integration](./viem.md)** - Modern TypeScript-first library
- **[Solana Web3.js](./solana-web3js.md)** - Solana JavaScript integration
- **[Python Examples](../python/README.md)** - Python implementations
