# Batch Operations Examples

Batch operations allow you to perform multiple blockchain operations efficiently in a single request or transaction bundle. This reduces network overhead, improves performance, and can save on transaction fees.

## JSON-RPC Batch Requests

### Ethereum Batch Queries

```javascript
// Using raw JSON-RPC batch requests
async function batchEthereumQueries(addresses) {
  const batchRequests = addresses
    .map((address, index) => [
      {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: index * 3 + 1,
      },
      {
        jsonrpc: "2.0",
        method: "eth_getTransactionCount",
        params: [address, "latest"],
        id: index * 3 + 2,
      },
      {
        jsonrpc: "2.0",
        method: "eth_getCode",
        params: [address, "latest"],
        id: index * 3 + 3,
      },
    ])
    .flat();

  try {
    const response = await fetch("https://rpc.dd.cloud/ethereum", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchRequests),
    });

    const results = await response.json();

    // Process results
    const processedResults = {};
    addresses.forEach((address, index) => {
      const baseId = index * 3;
      processedResults[address] = {
        balance: results.find((r) => r.id === baseId + 1)?.result,
        nonce: results.find((r) => r.id === baseId + 2)?.result,
        code: results.find((r) => r.id === baseId + 3)?.result,
      };
    });

    return processedResults;
  } catch (error) {
    console.error("Batch request failed:", error);
    throw error;
  }
}

// Usage
const addresses = [
  "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C",
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "0x8ba1f109551bD432803012645Hac136c",
];

const results = await batchEthereumQueries(addresses);
console.log("Batch results:", results);
```

### Using ethers.js Provider Batch

```javascript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://rpc.dd.cloud/ethereum");

async function batchAccountInfo(addresses) {
  try {
    // Create batch of promises
    const batchPromises = addresses.map(async (address) => {
      const [balance, nonce, code] = await Promise.all([
        provider.getBalance(address),
        provider.getTransactionCount(address),
        provider.getCode(address),
      ]);

      return {
        address,
        balance: ethers.formatEther(balance),
        nonce,
        isContract: code !== "0x",
      };
    });

    // Execute all batches concurrently
    const results = await Promise.all(batchPromises);
    return results;
  } catch (error) {
    console.error("Batch account info failed:", error);
    throw error;
  }
}
```

### Multi-Chain Batch Queries

```javascript
class MultiChainBatcher {
  constructor(endpoints) {
    this.endpoints = endpoints;
  }

  async batchMultiChain(queries) {
    const chainPromises = Object.entries(queries).map(
      async ([chain, chainQueries]) => {
        const endpoint = this.endpoints[chain];
        if (!endpoint) {
          throw new Error(`No endpoint configured for chain: ${chain}`);
        }

        const batchRequests = chainQueries.map((query, index) => ({
          jsonrpc: "2.0",
          method: query.method,
          params: query.params,
          id: index + 1,
        }));

        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(batchRequests),
          });

          const results = await response.json();
          return { chain, results };
        } catch (error) {
          console.error(`Batch failed for ${chain}:`, error);
          return { chain, error: error.message };
        }
      }
    );

    const allResults = await Promise.all(chainPromises);

    // Organize results by chain
    const organizedResults = {};
    allResults.forEach(({ chain, results, error }) => {
      organizedResults[chain] = error ? { error } : { results };
    });

    return organizedResults;
  }
}

// Usage
const batcher = new MultiChainBatcher({
  ethereum: "https://rpc.dd.cloud/ethereum",
  polygon: "https://rpc.dd.cloud/polygon",
  arbitrum: "https://rpc.dd.cloud/arbitrum",
});

const multiChainQueries = {
  ethereum: [
    { method: "eth_blockNumber", params: [] },
    { method: "eth_gasPrice", params: [] },
  ],
  polygon: [
    { method: "eth_blockNumber", params: [] },
    { method: "eth_gasPrice", params: [] },
  ],
  arbitrum: [
    { method: "eth_blockNumber", params: [] },
    { method: "eth_gasPrice", params: [] },
  ],
};

const results = await batcher.batchMultiChain(multiChainQueries);
```

## Transaction Batching

### Ethereum Transaction Batching

```javascript
class EthereumTransactionBatcher {
  constructor(wallet) {
    this.wallet = wallet;
    this.pendingBatch = [];
  }

  addTransaction(transaction) {
    this.pendingBatch.push(transaction);
  }

  async executeBatch(options = {}) {
    const { gasBuffer = 1.1, maxConcurrent = 5, confirmations = 1 } = options;

    try {
      // Get starting nonce
      let currentNonce = await this.wallet.getNonce();

      // Prepare transactions with sequential nonces
      const preparedTxs = await Promise.all(
        this.pendingBatch.map(async (tx, index) => {
          const gasEstimate = await this.wallet.estimateGas(tx);

          return {
            ...tx,
            nonce: currentNonce + index,
            gasLimit: Math.floor(Number(gasEstimate) * gasBuffer),
          };
        })
      );

      // Execute transactions in batches to avoid overwhelming the network
      const results = [];
      for (let i = 0; i < preparedTxs.length; i += maxConcurrent) {
        const batch = preparedTxs.slice(i, i + maxConcurrent);

        const batchPromises = batch.map(async (tx) => {
          try {
            const sentTx = await this.wallet.sendTransaction(tx);
            console.log(`Transaction sent: ${sentTx.hash}`);

            // Wait for confirmation if required
            if (confirmations > 0) {
              const receipt = await sentTx.wait(confirmations);
              return {
                hash: sentTx.hash,
                status: receipt.status,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString(),
              };
            }

            return { hash: sentTx.hash, status: "pending" };
          } catch (error) {
            console.error(`Transaction failed:`, error);
            return { error: error.message };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Small delay between batches to avoid rate limiting
        if (i + maxConcurrent < preparedTxs.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      // Clear the batch
      this.pendingBatch = [];

      return results;
    } catch (error) {
      console.error("Batch execution failed:", error);
      throw error;
    }
  }
}

// Usage
const batcher = new EthereumTransactionBatcher(wallet);

// Add multiple transactions
batcher.addTransaction({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C",
  value: ethers.parseEther("0.1"),
});

batcher.addTransaction({
  to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  value: ethers.parseEther("0.2"),
});

// Execute all transactions
const results = await batcher.executeBatch({
  gasBuffer: 1.2,
  maxConcurrent: 3,
  confirmations: 2,
});
```

### Solana Transaction Batching

```javascript
import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

class SolanaTransactionBatcher {
  constructor(connection, payer) {
    this.connection = connection;
    this.payer = payer;
    this.instructions = [];
  }

  addInstruction(instruction) {
    this.instructions.push(instruction);
  }

  addTransfer(to, amount) {
    const instruction = SystemProgram.transfer({
      fromPubkey: this.payer.publicKey,
      toPubkey: to,
      lamports: amount,
    });
    this.addInstruction(instruction);
  }

  async executeBatch(options = {}) {
    const { maxInstructionsPerTx = 10 } = options;

    try {
      const results = [];

      // Split instructions into multiple transactions if needed
      for (let i = 0; i < this.instructions.length; i += maxInstructionsPerTx) {
        const batch = this.instructions.slice(i, i + maxInstructionsPerTx);

        // Create transaction with batch of instructions
        const transaction = new Transaction();
        batch.forEach((instruction) => transaction.add(instruction));

        // Get recent blockhash
        const { blockhash } = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = this.payer.publicKey;

        // Send and confirm transaction
        const signature = await sendAndConfirmTransaction(
          this.connection,
          transaction,
          [this.payer]
        );

        console.log(`Batch transaction confirmed: ${signature}`);
        results.push({
          signature,
          instructionCount: batch.length,
          status: "confirmed",
        });
      }

      // Clear instructions
      this.instructions = [];

      return results;
    } catch (error) {
      console.error("Solana batch execution failed:", error);
      throw error;
    }
  }
}

// Usage
const batcher = new SolanaTransactionBatcher(connection, payerKeypair);

// Add multiple transfers
batcher.addTransfer(recipient1PublicKey, 1000000); // 0.001 SOL
batcher.addTransfer(recipient2PublicKey, 2000000); // 0.002 SOL
batcher.addTransfer(recipient3PublicKey, 3000000); // 0.003 SOL

// Execute batch
const results = await batcher.executeBatch({ maxInstructionsPerTx: 5 });
```

## Smart Contract Batch Operations

### Multicall Pattern

```javascript
// Multicall contract ABI (simplified)
const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) returns (uint256 blockNumber, bytes[] returnData)"
];

class MulticallBatcher {
  constructor(provider, multicallAddress) {
    this.provider = provider;
    this.multicall = new ethers.Contract(multicallAddress, MULTICALL_ABI, provider);
    this.calls = [];
  }

  addCall(target, callData) {
    this.calls.push({ target, callData });
  }

  addContractCall(contract, functionName, params = []) {
    const callData = contract.interface.encodeFunctionData(functionName, params);
    this.addCall(await contract.getAddress(), callData);
  }

  async execute() {
    try {
      if (this.calls.length === 0) {
        throw new Error('No calls to execute');
      }

      const result = await this.multicall.aggregate(this.calls);

      // Clear calls after execution
      const executedCalls = [...this.calls];
      this.calls = [];

      return {
        blockNumber: result.blockNumber,
        returnData: result.returnData,
        callCount: executedCalls.length
      };
    } catch (error) {
      console.error('Multicall execution failed:', error);
      throw error;
    }
  }
}

// Usage example
const multicaller = new MulticallBatcher(provider, MULTICALL_ADDRESS);

// Add multiple contract calls
const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);

multicaller.addContractCall(tokenContract, 'balanceOf', [address1]);
multicaller.addContractCall(tokenContract, 'balanceOf', [address2]);
multicaller.addContractCall(tokenContract, 'balanceOf', [address3]);

const results = await multicaller.execute();
```

### Batch Token Operations

```javascript
class TokenBatchOperations {
  constructor(tokenContract, wallet) {
    this.token = tokenContract;
    this.wallet = wallet;
  }

  async batchTransfer(recipients, amounts) {
    try {
      if (recipients.length !== amounts.length) {
        throw new Error("Recipients and amounts arrays must have same length");
      }

      // Check total amount needed
      const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);
      const balance = await this.token.balanceOf(this.wallet.address);

      if (balance < totalAmount) {
        throw new Error("Insufficient token balance for batch transfer");
      }

      // Execute transfers sequentially to avoid nonce conflicts
      const results = [];
      for (let i = 0; i < recipients.length; i++) {
        try {
          const tx = await this.token.transfer(recipients[i], amounts[i]);
          console.log(
            `Transfer ${i + 1}/${recipients.length} sent: ${tx.hash}`
          );

          const receipt = await tx.wait();
          results.push({
            recipient: recipients[i],
            amount: amounts[i].toString(),
            hash: tx.hash,
            status: receipt.status,
            gasUsed: receipt.gasUsed.toString(),
          });
        } catch (error) {
          console.error(`Transfer to ${recipients[i]} failed:`, error);
          results.push({
            recipient: recipients[i],
            amount: amounts[i].toString(),
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error("Batch transfer failed:", error);
      throw error;
    }
  }

  async batchApprove(spenders, amounts) {
    try {
      const results = [];

      for (let i = 0; i < spenders.length; i++) {
        try {
          const tx = await this.token.approve(spenders[i], amounts[i]);
          console.log(`Approval ${i + 1}/${spenders.length} sent: ${tx.hash}`);

          const receipt = await tx.wait();
          results.push({
            spender: spenders[i],
            amount: amounts[i].toString(),
            hash: tx.hash,
            status: receipt.status,
          });
        } catch (error) {
          console.error(`Approval for ${spenders[i]} failed:`, error);
          results.push({
            spender: spenders[i],
            amount: amounts[i].toString(),
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error("Batch approve failed:", error);
      throw error;
    }
  }
}
```

## Performance Optimization

### Intelligent Batching

```javascript
class IntelligentBatcher {
  constructor(provider, options = {}) {
    this.provider = provider;
    this.maxBatchSize = options.maxBatchSize || 100;
    this.batchTimeout = options.batchTimeout || 1000;
    this.pendingRequests = [];
    this.batchTimer = null;
  }

  async request(method, params) {
    return new Promise((resolve, reject) => {
      this.pendingRequests.push({
        method,
        params,
        resolve,
        reject,
        timestamp: Date.now(),
      });

      // Auto-execute if batch is full
      if (this.pendingRequests.length >= this.maxBatchSize) {
        this.executeBatch();
      } else if (!this.batchTimer) {
        // Set timer for automatic execution
        this.batchTimer = setTimeout(() => {
          this.executeBatch();
        }, this.batchTimeout);
      }
    });
  }

  async executeBatch() {
    if (this.pendingRequests.length === 0) return;

    // Clear timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    // Create batch request
    const batchRequest = requests.map((req, index) => ({
      jsonrpc: "2.0",
      method: req.method,
      params: req.params,
      id: index,
    }));

    try {
      const response = await fetch(this.provider, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchRequest),
      });

      const results = await response.json();

      // Resolve individual promises
      results.forEach((result, index) => {
        const request = requests[index];
        if (result.error) {
          request.reject(new Error(result.error.message));
        } else {
          request.resolve(result.result);
        }
      });
    } catch (error) {
      // Reject all pending requests
      requests.forEach((req) => req.reject(error));
    }
  }

  async getBalance(address) {
    return this.request("eth_getBalance", [address, "latest"]);
  }

  async getTransactionCount(address) {
    return this.request("eth_getTransactionCount", [address, "latest"]);
  }

  async getBlockNumber() {
    return this.request("eth_blockNumber", []);
  }
}

// Usage
const batcher = new IntelligentBatcher("https://rpc.dd.cloud/ethereum", {
  maxBatchSize: 50,
  batchTimeout: 500,
});

// These will be automatically batched
const [balance1, balance2, balance3, blockNumber] = await Promise.all([
  batcher.getBalance("0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C"),
  batcher.getBalance("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"),
  batcher.getBalance("0x8ba1f109551bD432803012645Hac136c"),
  batcher.getBlockNumber(),
]);
```

### Rate-Limited Batching

```javascript
class RateLimitedBatcher {
  constructor(provider, rateLimit = 10) {
    // 10 requests per second
    this.provider = provider;
    this.rateLimit = rateLimit;
    this.requestQueue = [];
    this.processing = false;
    this.lastRequestTime = 0;
  }

  async addRequest(request) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ request, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.requestQueue.length === 0) return;

    this.processing = true;

    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const minInterval = 1000 / this.rateLimit;

      if (timeSinceLastRequest < minInterval) {
        await new Promise((resolve) =>
          setTimeout(resolve, minInterval - timeSinceLastRequest)
        );
      }

      // Process batch
      const batchSize = Math.min(this.requestQueue.length, this.rateLimit);
      const batch = this.requestQueue.splice(0, batchSize);

      try {
        const batchRequest = batch.map((item, index) => ({
          ...item.request,
          id: index,
        }));

        const response = await fetch(this.provider, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batchRequest),
        });

        const results = await response.json();

        // Resolve promises
        batch.forEach((item, index) => {
          const result = results[index];
          if (result.error) {
            item.reject(new Error(result.error.message));
          } else {
            item.resolve(result.result);
          }
        });

        this.lastRequestTime = Date.now();
      } catch (error) {
        batch.forEach((item) => item.reject(error));
      }
    }

    this.processing = false;
  }
}
```

These batch operation examples demonstrate how to efficiently handle multiple blockchain operations, reducing network overhead and improving application performance while maintaining proper error handling and rate limiting.
