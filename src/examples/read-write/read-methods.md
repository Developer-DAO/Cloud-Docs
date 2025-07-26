# Read Methods Examples

This page demonstrates various read methods across different blockchain networks. Read methods query blockchain state without modifying it.

## Ethereum/EVM Read Methods

### Account Balance Query

```javascript
// Using ethers.js
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://rpc.dd.cloud/ethereum");

async function getAccountBalance(address) {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
}

// Usage
const balance = await getAccountBalance(
  "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C"
);
console.log(`Balance: ${balance} ETH`);
```

```python
# Using web3.py
from web3 import Web3

w3 = Web3(Web3.HTTPProvider('https://rpc.dd.cloud/ethereum'))

def get_account_balance(address):
    try:
        balance_wei = w3.eth.get_balance(address)
        balance_eth = w3.from_wei(balance_wei, 'ether')
        return balance_eth
    except Exception as e:
        print(f"Error fetching balance: {e}")
        raise

# Usage
balance = get_account_balance('0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C')
print(f"Balance: {balance} ETH")
```

```bash
# Using cURL
curl -X POST https://rpc.dd.cloud/ethereum \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": ["0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C", "latest"],
    "id": 1
  }'
```

### Block Information Query

```javascript
// Get latest block
async function getLatestBlock() {
  try {
    const block = await provider.getBlock("latest");
    return {
      number: block.number,
      hash: block.hash,
      timestamp: block.timestamp,
      transactions: block.transactions.length,
      gasUsed: block.gasUsed.toString(),
      gasLimit: block.gasLimit.toString(),
    };
  } catch (error) {
    console.error("Error fetching block:", error);
    throw error;
  }
}

// Get specific block by number
async function getBlockByNumber(blockNumber) {
  try {
    const block = await provider.getBlock(blockNumber, true); // true for full transactions
    return block;
  } catch (error) {
    console.error("Error fetching block:", error);
    throw error;
  }
}
```

### Contract State Query

```javascript
// Query ERC-20 token balance
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

async function getTokenBalance(tokenAddress, walletAddress) {
  try {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const [balance, symbol, decimals] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.symbol(),
      contract.decimals(),
    ]);

    return {
      balance: ethers.formatUnits(balance, decimals),
      symbol,
      decimals,
    };
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw error;
  }
}
```

### Transaction History Query

```javascript
// Get transaction receipt
async function getTransactionReceipt(txHash) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    return {
      status: receipt.status,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
      logs: receipt.logs,
    };
  } catch (error) {
    console.error("Error fetching transaction receipt:", error);
    throw error;
  }
}

// Get transaction details
async function getTransaction(txHash) {
  try {
    const tx = await provider.getTransaction(txHash);
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: ethers.formatEther(tx.value),
      gasLimit: tx.gasLimit.toString(),
      gasPrice: tx.gasPrice?.toString(),
      nonce: tx.nonce,
    };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
}
```

## Solana Read Methods

### Account Information Query

```javascript
// Using @solana/web3.js
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://rpc.dd.cloud/solana");

async function getAccountInfo(address) {
  try {
    const publicKey = new PublicKey(address);
    const accountInfo = await connection.getAccountInfo(publicKey);

    if (!accountInfo) {
      return null;
    }

    return {
      lamports: accountInfo.lamports,
      owner: accountInfo.owner.toString(),
      executable: accountInfo.executable,
      rentEpoch: accountInfo.rentEpoch,
    };
  } catch (error) {
    console.error("Error fetching account info:", error);
    throw error;
  }
}
```

### Token Account Balance

```javascript
async function getTokenAccountBalance(tokenAccountAddress) {
  try {
    const publicKey = new PublicKey(tokenAccountAddress);
    const balance = await connection.getTokenAccountBalance(publicKey);

    return {
      amount: balance.value.amount,
      decimals: balance.value.decimals,
      uiAmount: balance.value.uiAmount,
    };
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw error;
  }
}
```

### Block Information

```javascript
async function getBlockInfo(slot) {
  try {
    const block = await connection.getBlock(slot);

    return {
      blockhash: block.blockhash,
      previousBlockhash: block.previousBlockhash,
      parentSlot: block.parentSlot,
      transactions: block.transactions.length,
      blockTime: block.blockTime,
    };
  } catch (error) {
    console.error("Error fetching block info:", error);
    throw error;
  }
}
```

## NEAR Protocol Read Methods

### Account State Query

```javascript
// Using near-api-js
import { connect, keyStores } from "near-api-js";

const config = {
  networkId: "mainnet",
  keyStore: new keyStores.InMemoryKeyStore(),
  nodeUrl: "https://rpc.dd.cloud/near",
  walletUrl: "https://wallet.near.org",
  helperUrl: "https://helper.near.org",
};

async function getAccountState(accountId) {
  try {
    const near = await connect(config);
    const account = await near.account(accountId);
    const state = await account.state();

    return {
      amount: state.amount,
      locked: state.locked,
      codeHash: state.code_hash,
      storageUsage: state.storage_usage,
    };
  } catch (error) {
    console.error("Error fetching account state:", error);
    throw error;
  }
}
```

### Contract View Call

```javascript
async function viewContractMethod(contractId, methodName, args = {}) {
  try {
    const near = await connect(config);
    const account = await near.account("dummy.near"); // Any account for view calls

    const result = await account.viewFunction(contractId, methodName, args);
    return result;
  } catch (error) {
    console.error("Error calling view method:", error);
    throw error;
  }
}

// Example: Get FT balance
const balance = await viewContractMethod("token.near", "ft_balance_of", {
  account_id: "user.near",
});
```

## Sui Network Read Methods

### Object Information Query

```javascript
// Using @mysten/sui.js
import { SuiClient } from "@mysten/sui.js/client";

const client = new SuiClient({ url: "https://rpc.dd.cloud/sui" });

async function getObjectInfo(objectId) {
  try {
    const object = await client.getObject({
      id: objectId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });

    return object.data;
  } catch (error) {
    console.error("Error fetching object info:", error);
    throw error;
  }
}
```

### Account Balance Query

```javascript
async function getSuiBalance(address) {
  try {
    const balance = await client.getBalance({
      owner: address,
    });

    return {
      coinType: balance.coinType,
      coinObjectCount: balance.coinObjectCount,
      totalBalance: balance.totalBalance,
      lockedBalance: balance.lockedBalance,
    };
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
}
```

## Performance Optimization Tips

### Batch Requests

```javascript
// Batch multiple read operations
async function batchAccountData(addresses) {
  try {
    const promises = addresses.map((address) => ({
      balance: provider.getBalance(address),
      nonce: provider.getTransactionCount(address),
      code: provider.getCode(address),
    }));

    const results = await Promise.all(
      promises.map(async (p) => ({
        balance: await p.balance,
        nonce: await p.nonce,
        code: await p.code,
      }))
    );

    return results;
  } catch (error) {
    console.error("Error in batch request:", error);
    throw error;
  }
}
```

### Caching Strategy

```javascript
class ReadMethodCache {
  constructor(ttl = 30000) {
    // 30 second TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  async get(key, fetchFunction) {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }
}

const cache = new ReadMethodCache();

// Usage
const balance = await cache.get(`balance_${address}`, () =>
  provider.getBalance(address)
);
```

## Error Handling Best Practices

```javascript
async function robustReadOperation(operation) {
  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (error.code === "INVALID_ARGUMENT") {
        throw error;
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  throw lastError;
}
```

These examples demonstrate the comprehensive read capabilities available through D_D Cloud RPC across multiple blockchain networks. Each method includes proper error handling and performance considerations for production use.
