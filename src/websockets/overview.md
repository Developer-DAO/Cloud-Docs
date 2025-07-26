# WebSocket Support Overview

> 🚧 **Coming Soon**: WebSocket support is currently in development and will be available in Q2 2024.

D_D Cloud RPC will provide real-time blockchain data streaming through WebSocket connections, enabling your applications to receive live updates for blocks, transactions, events, and more.

## What are WebSockets?

WebSockets provide a persistent, full-duplex communication channel between your application and our RPC nodes. Unlike traditional HTTP requests, WebSockets allow:

- **Real-time updates**: Receive data as soon as it's available
- **Persistent connections**: No need to repeatedly establish connections
- **Lower latency**: Reduced overhead compared to polling
- **Bidirectional communication**: Send and receive data simultaneously

## Supported Networks

WebSocket support will be available for:

### EVM Compatible Chains

- Ethereum Mainnet and Testnets
- Layer 2 networks (Arbitrum, Optimism, Base, Polygon)
- Alternative L1s (BSC, Avalanche, Fantom, etc.)

### Non-EVM Chains

- Solana (account, logs, signature, slot subscriptions)
- NEAR Protocol (block, transaction subscriptions)
- Sui (event, transaction subscriptions)

## Connection Endpoints

WebSocket endpoints will follow this pattern:

```
wss://ws.ddcloud.io/{network}?apikey=YOUR_API_KEY
```

Examples:

- Ethereum: `wss://ws.ddcloud.io/eth?apikey=YOUR_API_KEY`
- Polygon: `wss://ws.ddcloud.io/poly?apikey=YOUR_API_KEY`
- Solana: `wss://ws.ddcloud.io/solana?apikey=YOUR_API_KEY`

## Subscription Types

### EVM Chains

#### newHeads

Receive notifications for new blocks:

```javascript
// Subscribe to new blocks
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": ["newHeads"]
}

// Response format
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0x...",
    "result": {
      "number": "0x1b4",
      "hash": "0x...",
      "parentHash": "0x...",
      "timestamp": "0x...",
      // ... other block fields
    }
  }
}
```

#### logs

Subscribe to contract event logs:

```javascript
// Subscribe to logs with filter
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": [
    "logs",
    {
      "address": "0x...",
      "topics": ["0x..."]
    }
  ]
}
```

#### newPendingTransactions

Get notified of new pending transactions:

```javascript
// Subscribe to pending transactions
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": ["newPendingTransactions"]
}
```

### Solana

#### accountSubscribe

Monitor account changes:

```javascript
// Subscribe to account changes
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "accountSubscribe",
  "params": [
    "ACCOUNT_PUBKEY",
    {
      "encoding": "base64",
      "commitment": "finalized"
    }
  ]
}
```

#### logsSubscribe

Subscribe to program logs:

```javascript
// Subscribe to program logs
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "logsSubscribe",
  "params": [
    {
      "mentions": ["PROGRAM_ID"]
    },
    {
      "commitment": "finalized"
    }
  ]
}
```

## Connection Management

### Authentication

WebSocket connections will use API key authentication:

```javascript
// URL parameter (recommended)
const ws = new WebSocket("wss://ws.ddcloud.io/eth?apikey=YOUR_API_KEY");

// Or via headers (if supported by client)
const ws = new WebSocket("wss://ws.ddcloud.io/eth", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});
```

### Connection Lifecycle

```javascript
class DDCloudWebSocket {
  constructor(network, apiKey) {
    this.network = network;
    this.apiKey = apiKey;
    this.ws = null;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    const url = `wss://ws.ddcloud.io/${this.network}?apikey=${this.apiKey}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
      this.resubscribe();
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;

      setTimeout(() => {
        console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.connect();
      }, delay);
    }
  }

  subscribe(method, params, callback) {
    const id = Date.now();
    const subscription = { method, params, callback };
    this.subscriptions.set(id, subscription);

    this.send({
      jsonrpc: "2.0",
      id,
      method,
      params,
    });

    return id;
  }

  unsubscribe(subscriptionId) {
    this.subscriptions.delete(subscriptionId);

    this.send({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "eth_unsubscribe",
      params: [subscriptionId],
    });
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  handleMessage(message) {
    if (message.method === "eth_subscription") {
      // Handle subscription notification
      const subscription = this.subscriptions.get(message.params.subscription);
      if (subscription && subscription.callback) {
        subscription.callback(message.params.result);
      }
    } else if (message.id) {
      // Handle subscription response
      console.log("Subscription response:", message);
    }
  }

  resubscribe() {
    // Resubscribe to all active subscriptions after reconnection
    for (const [id, subscription] of this.subscriptions) {
      this.send({
        jsonrpc: "2.0",
        id,
        method: subscription.method,
        params: subscription.params,
      });
    }
  }
}
```

## Usage Examples

### Monitoring New Blocks

```javascript
const ws = new DDCloudWebSocket("eth", "YOUR_API_KEY");
ws.connect();

// Subscribe to new blocks
ws.subscribe("eth_subscribe", ["newHeads"], (block) => {
  console.log("New block:", {
    number: parseInt(block.number, 16),
    hash: block.hash,
    timestamp: new Date(parseInt(block.timestamp, 16) * 1000),
  });
});
```

### Tracking Token Transfers

```javascript
// Monitor USDC transfers
const usdcAddress = "0xA0b86a33E6441b8e8C7C7b0b8e8e8e8e8e8e8e8e";
const transferTopic =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

ws.subscribe(
  "eth_subscribe",
  [
    "logs",
    {
      address: usdcAddress,
      topics: [transferTopic],
    },
  ],
  (log) => {
    console.log("USDC Transfer:", {
      from: "0x" + log.topics[1].slice(26),
      to: "0x" + log.topics[2].slice(26),
      value: parseInt(log.data, 16),
      txHash: log.transactionHash,
    });
  }
);
```

### Solana Account Monitoring

```javascript
const solanaWs = new DDCloudWebSocket("solana", "YOUR_API_KEY");
solanaWs.connect();

// Monitor account changes
solanaWs.subscribe(
  "accountSubscribe",
  ["ACCOUNT_PUBKEY_HERE", { encoding: "base64", commitment: "finalized" }],
  (accountInfo) => {
    console.log("Account updated:", {
      lamports: accountInfo.lamports,
      owner: accountInfo.owner,
      executable: accountInfo.executable,
    });
  }
);
```

## Rate Limits

WebSocket connections will have the following limits:

| Limit Type                   | Default  | Enterprise |
| ---------------------------- | -------- | ---------- |
| Concurrent Connections       | 10       | 100        |
| Subscriptions per Connection | 100      | 1000       |
| Messages per Second          | 1000     | 10000      |
| Connection Duration          | 24 hours | Unlimited  |

## Error Handling

### Common Error Codes

```javascript
// Subscription errors
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid subscription parameters"
  }
}

// Rate limit errors
{
  "jsonrpc": "2.0",
  "error": {
    "code": 429,
    "message": "Too many subscriptions"
  }
}

// Authentication errors
{
  "jsonrpc": "2.0",
  "error": {
    "code": 401,
    "message": "Invalid API key"
  }
}
```

### Error Handling Implementation

```javascript
ws.onerror = (error) => {
  console.error("WebSocket error:", error);

  // Implement exponential backoff
  const backoffDelay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
  setTimeout(() => reconnect(), backoffDelay);
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.error) {
    switch (message.error.code) {
      case 401:
        console.error("Authentication failed");
        // Don't reconnect on auth errors
        break;
      case 429:
        console.error("Rate limit exceeded");
        // Implement backoff
        break;
      default:
        console.error("RPC error:", message.error);
    }
  }
};
```

## Best Practices

### 1. Connection Management

- Implement automatic reconnection with exponential backoff
- Handle network interruptions gracefully
- Monitor connection health with ping/pong

### 2. Subscription Management

- Keep track of active subscriptions
- Resubscribe after reconnection
- Clean up unused subscriptions

### 3. Error Handling

- Handle all error types appropriately
- Implement retry logic for transient errors
- Log errors for debugging

### 4. Performance

- Batch subscription requests when possible
- Use appropriate filters to reduce data volume
- Implement client-side rate limiting

## Migration from Polling

### Before (HTTP Polling)

```javascript
// Inefficient polling approach
setInterval(async () => {
  const blockNumber = await provider.getBlockNumber();
  if (blockNumber > lastBlockNumber) {
    const block = await provider.getBlock(blockNumber);
    processNewBlock(block);
    lastBlockNumber = blockNumber;
  }
}, 1000);
```

### After (WebSocket Subscription)

```javascript
// Efficient WebSocket approach
ws.subscribe("eth_subscribe", ["newHeads"], (block) => {
  processNewBlock(block);
});
```

## Roadmap

### Phase 1 (Q2 2024)

- EVM chain support (newHeads, logs, newPendingTransactions)
- Basic connection management
- Authentication and rate limiting

### Phase 2 (Q3 2024)

- Solana support (account, logs, signature, slot subscriptions)
- NEAR Protocol support
- Advanced filtering options

### Phase 3 (Q4 2024)

- Sui support
- Custom subscription types
- Enhanced monitoring and analytics

## Getting Notified

Stay updated on WebSocket availability:

- **Discord**: [Join our community](https://discord.gg/ddcloud)
- **Email**: Subscribe to updates in your dashboard
- **Documentation**: This page will be updated with release information

## Next Steps

- **[EVM Subscriptions](./evm/README.md)** - Detailed EVM WebSocket documentation
- **[Solana Subscriptions](./solana/README.md)** - Solana WebSocket integration
- **[Connection Management](./connection.md)** - Advanced connection handling
