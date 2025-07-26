# Authentication

D_D Cloud RPC uses API key-based authentication to secure access to our blockchain infrastructure. This guide covers everything you need to know about managing and using API keys effectively.

## API Key Overview

API keys are unique identifiers that authenticate your requests to D_D Cloud RPC endpoints. Each key can be configured with specific permissions, rate limits, and network access.

### Key Features

- **Network-specific access**: Control which blockchain networks each key can access
- **Rate limiting**: Set custom request limits per key
- **Usage analytics**: Track requests, errors, and performance per key
- **Easy rotation**: Generate new keys and deprecate old ones seamlessly
- **Team management**: Share keys across team members with different permission levels

## Creating API Keys

### Via Dashboard

1. Log in to your [D_D Cloud Dashboard](https://dashboard.ddcloud.io)
2. Navigate to **API Keys** in the sidebar
3. Click **Create New Key**
4. Configure your key:
   - **Name**: Descriptive name for easy identification
   - **Networks**: Select which blockchain networks to enable
   - **Rate Limits**: Set requests per second/minute/hour (optional)
   - **IP Restrictions**: Limit access to specific IP addresses (optional)
   - **Expiration**: Set an expiration date (optional)
5. Click **Generate Key**
6. **Important**: Copy your API key immediately - you won't see it again!

### Via API

You can also create API keys programmatically:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_MASTER_KEY" \
  -d '{
    "name": "Production API Key",
    "networks": ["eth", "poly", "arb-one"],
    "rateLimit": {
      "requestsPerSecond": 100,
      "requestsPerHour": 100000
    },
    "ipRestrictions": ["192.168.1.0/24"],
    "expiresAt": "2024-12-31T23:59:59Z"
  }' \
  https://api.ddcloud.io/v1/keys
```

## Using API Keys

### HTTP Header Authentication

The recommended method is to include your API key in the `Authorization` header:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://rpc.ddcloud.io/eth
```

### Query Parameter Authentication

Alternatively, you can pass the API key as a query parameter:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  "https://rpc.ddcloud.io/eth?apikey=YOUR_API_KEY"
```

> ⚠️ **Security Note**: Header authentication is preferred as query parameters may be logged by proxies and servers.

### JavaScript Examples

#### Using fetch with headers

```javascript
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
```

#### Using ethers.js

```javascript
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});
```

#### Using web3.js

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
```

## API Key Management

### Key Rotation

Regular key rotation is a security best practice:

1. **Generate a new key** with the same permissions
2. **Update your applications** to use the new key
3. **Monitor usage** to ensure the transition is complete
4. **Revoke the old key** once it's no longer in use

### Environment Variables

Store API keys securely using environment variables:

```bash
# .env file
DD_CLOUD_API_KEY=your_api_key_here
DD_CLOUD_ENDPOINT=https://rpc.ddcloud.io
```

```javascript
// Load from environment
const apiKey = process.env.DD_CLOUD_API_KEY;
const endpoint = process.env.DD_CLOUD_ENDPOINT;

const provider = new JsonRpcProvider(`${endpoint}/eth`, {
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});
```

### Multiple Keys Strategy

For production applications, consider using multiple keys:

```javascript
// Different keys for different purposes
const keys = {
  read: process.env.DD_CLOUD_READ_KEY, // Read-only operations
  write: process.env.DD_CLOUD_WRITE_KEY, // Transaction broadcasting
  analytics: process.env.DD_CLOUD_ANALYTICS_KEY, // Data analysis
};

function getProvider(operation) {
  const key = keys[operation] || keys.read;
  return new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });
}
```

## Security Best Practices

### 1. Never Expose Keys in Client-Side Code

```javascript
// ❌ DON'T DO THIS - API key exposed in browser
const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: {
    Authorization: "Bearer sk_live_abc123...", // Visible to users!
  },
});

// ✅ DO THIS - Use a backend proxy
const response = await fetch("/api/blockchain-proxy", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ method: "eth_blockNumber", params: [] }),
});
```

### 2. Use IP Restrictions

Limit API key usage to specific IP addresses:

```bash
# Only allow requests from your server IPs
curl -X PATCH \
  -H "Authorization: Bearer YOUR_MASTER_KEY" \
  -d '{"ipRestrictions": ["203.0.113.0/24", "198.51.100.42"]}' \
  https://api.ddcloud.io/v1/keys/YOUR_KEY_ID
```

### 3. Set Appropriate Rate Limits

Configure rate limits based on your application's needs:

```javascript
// Example rate limit configuration
{
  "requestsPerSecond": 50,     // Burst capacity
  "requestsPerMinute": 1000,   // Sustained rate
  "requestsPerHour": 50000,    // Daily usage
  "requestsPerDay": 1000000    // Monthly cap
}
```

### 4. Monitor Key Usage

Regularly review your API key usage:

```bash
# Get usage statistics
curl -H "Authorization: Bearer YOUR_MASTER_KEY" \
  https://api.ddcloud.io/v1/keys/YOUR_KEY_ID/usage
```

### 5. Use Key Expiration

Set expiration dates for temporary or development keys:

```javascript
{
  "name": "Development Key",
  "expiresAt": "2024-03-31T23:59:59Z",
  "networks": ["eth-sepolia-testnet", "poly-amoy-testnet"]
}
```

## Error Handling

### Authentication Errors

Common authentication error responses:

```json
// Missing API key
{
  "error": {
    "code": 401,
    "message": "Authentication required. Please provide a valid API key."
  }
}

// Invalid API key
{
  "error": {
    "code": 401,
    "message": "Invalid API key. Please check your credentials."
  }
}

// Expired API key
{
  "error": {
    "code": 401,
    "message": "API key has expired. Please generate a new key."
  }
}

// Network access denied
{
  "error": {
    "code": 403,
    "message": "Access denied. This API key is not authorized for the requested network."
  }
}

// Rate limit exceeded
{
  "error": {
    "code": 429,
    "message": "Rate limit exceeded. Please reduce request frequency.",
    "retryAfter": 60
  }
}
```

### Handling Authentication Errors

```javascript
async function makeAuthenticatedRequest(method, params) {
  try {
    const response = await fetch("https://rpc.ddcloud.io/eth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DD_CLOUD_API_KEY}`,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method,
        params,
        id: 1,
      }),
    });

    if (response.status === 401) {
      throw new Error("Authentication failed. Check your API key.");
    }

    if (response.status === 403) {
      throw new Error("Access denied. Check network permissions.");
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      throw new Error(
        `Rate limit exceeded. Retry after ${retryAfter} seconds.`
      );
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}
```

## Team Management

### Shared Keys

For team environments, create shared keys with appropriate permissions:

```javascript
// Team key configuration
{
  "name": "Frontend Team - Production",
  "networks": ["eth", "poly", "base"],
  "rateLimit": {
    "requestsPerSecond": 200,
    "requestsPerHour": 500000
  },
  "permissions": ["read"],
  "team": "frontend"
}
```

### Role-Based Access

Implement role-based access using different keys:

```javascript
const keysByRole = {
  developer: process.env.DD_CLOUD_DEV_KEY, // Testnet access only
  staging: process.env.DD_CLOUD_STAGING_KEY, // Limited mainnet access
  production: process.env.DD_CLOUD_PROD_KEY, // Full access
};

function getApiKey() {
  const environment = process.env.NODE_ENV;
  return keysByRole[environment] || keysByRole.developer;
}
```

## Next Steps

- **[Rate Limits & Pricing](./rate-limits.md)** - Understand usage limits and costs
- **[Error Handling](./error-handling.md)** - Learn about comprehensive error handling
- **[Network Overview](../networks/overview.md)** - Explore supported blockchain networks
- **[Security Best Practices](../advanced/security.md)** - Advanced security configurations
