# eth_getBalance

Returns the balance of an account at a given block.

## Parameters

1. **address** (string, required): The address to check for balance
2. **block** (string, required): Block parameter - can be:
   - `"latest"` - The most recent block
   - `"earliest"` - The genesis block
   - `"pending"` - Pending state changes
   - `"safe"` - The most recent safe head block
   - `"finalized"` - The most recent finalized block
   - Block number as hex string (e.g., `"0x1b4"`)
   - Block hash as hex string

## Returns

**string** - The current balance in wei as a hexadecimal string

## Example Request

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": [
      "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
      "latest"
    ],
    "id": 1
  }' \
  https://rpc.ddcloud.io/eth
```

## Example Response

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1bc16d674ec80000"
}
```

## Code Examples

### JavaScript (ethers.js)

```javascript
import { JsonRpcProvider, formatEther } from "ethers";

const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: { Authorization: "Bearer YOUR_API_KEY" },
});

async function getBalance() {
  const address = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45";

  // Get balance in wei
  const balanceWei = await provider.getBalance(address);

  // Convert to ETH
  const balanceEth = formatEther(balanceWei);

  console.log(`Balance: ${balanceEth} ETH`);
  console.log(`Balance (wei): ${balanceWei.toString()}`);
}

getBalance();
```

### JavaScript (web3.js)

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

async function getBalance() {
  const address = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45";

  // Get balance in wei
  const balanceWei = await web3.eth.getBalance(address);

  // Convert to ETH
  const balanceEth = web3.utils.fromWei(balanceWei, "ether");

  console.log(`Balance: ${balanceEth} ETH`);
  console.log(`Balance (wei): ${balanceWei}`);
}

getBalance();
```

### JavaScript (Raw JSON-RPC)

```javascript
async function getBalance(address, block = "latest") {
  const response = await fetch("https://rpc.ddcloud.io/eth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_KEY",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [address, block],
      id: 1,
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`RPC Error: ${data.error.message}`);
  }

  // Convert hex to decimal
  const balanceWei = BigInt(data.result);
  const balanceEth = Number(balanceWei) / 1e18;

  return {
    wei: balanceWei.toString(),
    eth: balanceEth.toString(),
  };
}

// Usage
const balance = await getBalance("0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45");
console.log(`Balance: ${balance.eth} ETH`);
```

### Python

```python
import requests
import json

def get_balance(address, block='latest'):
    url = 'https://rpc.ddcloud.io/eth'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    }

    payload = {
        'jsonrpc': '2.0',
        'method': 'eth_getBalance',
        'params': [address, block],
        'id': 1
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()

    if 'error' in data:
        raise Exception(f"RPC Error: {data['error']['message']}")

    # Convert hex to decimal
    balance_wei = int(data['result'], 16)
    balance_eth = balance_wei / 1e18

    return {
        'wei': str(balance_wei),
        'eth': str(balance_eth)
    }

# Usage
balance = get_balance('0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45')
print(f"Balance: {balance['eth']} ETH")
```

### Python (web3.py)

```python
from web3 import Web3

# Connect to D_D Cloud RPC
w3 = Web3(Web3.HTTPProvider(
    'https://rpc.ddcloud.io/eth',
    request_kwargs={'headers': {'Authorization': 'Bearer YOUR_API_KEY'}}
))

def get_balance(address):
    # Get balance in wei
    balance_wei = w3.eth.get_balance(address)

    # Convert to ETH
    balance_eth = w3.from_wei(balance_wei, 'ether')

    return {
        'wei': balance_wei,
        'eth': float(balance_eth)
    }

# Usage
address = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45'
balance = get_balance(address)
print(f"Balance: {balance['eth']} ETH")
```

## Historical Balance Queries

You can query balance at any historical block:

```javascript
// Get balance at specific block number
const balanceAtBlock = await provider.getBalance(
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
  1000000 // Block number
);

// Get balance at specific block hash
const balanceAtHash = await fetch("https://rpc.ddcloud.io/eth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_API_KEY",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [
      "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
      "0x1d4f07f8c8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8",
    ],
    id: 1,
  }),
});
```

## Batch Balance Queries

Query multiple balances in a single request:

```javascript
async function getBatchBalances(addresses) {
  const batchRequest = addresses.map((address, index) => ({
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [address, "latest"],
    id: index + 1,
  }));

  const response = await fetch("https://rpc.ddcloud.io/eth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_KEY",
    },
    body: JSON.stringify(batchRequest),
  });

  const results = await response.json();

  return results.map((result, index) => ({
    address: addresses[index],
    balance: BigInt(result.result).toString(),
    balanceEth: (Number(BigInt(result.result)) / 1e18).toString(),
  }));
}

// Usage
const addresses = [
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "0x8ba1f109551bD432803012645Hac136c",
];

const balances = await getBatchBalances(addresses);
console.log(balances);
```

## Error Handling

Common errors and how to handle them:

```javascript
async function getBalanceWithErrorHandling(address, block = "latest") {
  try {
    const response = await fetch("https://rpc.ddcloud.io/eth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, block],
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      switch (data.error.code) {
        case -32602:
          throw new Error(
            "Invalid parameters. Check address format and block parameter."
          );
        case -32000:
          throw new Error("Block not found or not available.");
        default:
          throw new Error(`RPC Error: ${data.error.message}`);
      }
    }

    return BigInt(data.result);
  } catch (error) {
    console.error("Failed to get balance:", error);
    throw error;
  }
}
```

## Network-Specific Considerations

### Ethereum Mainnet

- Archive data available from genesis block
- Safe and finalized block tags supported (post-merge)

### Layer 2 Networks

- Some L2s may have different finality semantics
- Check network-specific documentation for block tag support

### Testnets

- May have periodic resets
- Historical data availability varies

## Related Methods

- [`eth_getTransactionCount`](../eth_getTransactionCount.md) - Get account nonce
- [`eth_getCode`](../eth_getCode.md) - Get contract code
- [`eth_getStorageAt`](../../contracts/eth_getStorageAt.md) - Get contract storage

## Best Practices

1. **Use appropriate block parameters**: `latest` for current state, `finalized` for confirmed state
2. **Handle large numbers**: Use BigInt in JavaScript for wei values
3. **Batch requests**: Query multiple balances efficiently
4. **Cache results**: Balance queries are expensive, cache when possible
5. **Error handling**: Always handle network and RPC errors gracefully
