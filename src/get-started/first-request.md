<div class="page-layout">
<div class="content-main">

# Set up your API key

API keys are the foundation of authentication with D_D Cloud RPC services. This guide will walk you through creating, configuring, and securing your API keys for optimal performance and security.

## What are API keys? {#what-are-api-keys}

API keys are unique identifiers that authenticate your requests to D_D Cloud RPC endpoints. They serve as both identification and authorization, ensuring that only authorized applications can access our blockchain infrastructure.

### Key benefits {#key-benefits}

- **Secure authentication** - Protect your applications with enterprise-grade security
- **Usage tracking** - Monitor requests, costs, and performance per key
- **Network control** - Specify which blockchain networks each key can access
- **Rate limiting** - Set custom limits to prevent abuse and control costs
- **Team collaboration** - Share keys across team members with different permissions

## Creating your first API key {#creating-first-api-key}

### Step 1: Access the dashboard {#access-dashboard}

1. Sign in to your [D_D Cloud Dashboard](https://dashboard.ddcloud.io)
2. Navigate to **API Keys** in the left sidebar
3. Click **Create New Key** to start the setup process

### Step 2: Configure key settings {#configure-key-settings}

Fill out the key configuration form:

**Basic Information:**
- **Key Name**: Choose a descriptive name (e.g., "Production Frontend", "Development Testing")
- **Description**: Optional description for team reference

**Network Access:**
- **All Networks**: Enable access to all supported networks
- **Specific Networks**: Select only the networks you need (recommended)

**Security Settings:**
- **IP Restrictions**: Limit access to specific IP addresses or ranges
- **Referrer Restrictions**: Restrict usage to specific domains (for frontend apps)
- **Expiration Date**: Set an optional expiration date for temporary keys

**Rate Limits:**
- **Requests per Second**: Set burst capacity (default: 100)
- **Requests per Hour**: Set sustained usage limit (default: 10,000)
- **Daily Request Limit**: Set maximum daily usage (optional)

### Step 3: Generate and secure your key {#generate-secure-key}

1. Click **Generate API Key**
2. **Important**: Copy your API key immediately - it will only be shown once
3. Store the key securely in your password manager or environment variables
4. Test the key with a simple request to verify it works

## API key types {#api-key-types}

D_D Cloud offers different types of API keys for various use cases:

### Development keys {#development-keys}

Perfect for testing and development environments:

- **Testnet access only** - Safe for experimentation
- **Lower rate limits** - Suitable for development workloads
- **Extended logging** - Detailed request/response logging for debugging
- **Free tier included** - No cost for reasonable usage

### Production keys {#production-keys}

Designed for live applications and services:

- **All network access** - Full access to mainnet and testnet networks
- **Higher rate limits** - Support for production traffic volumes
- **Priority support** - Faster response times and dedicated support
- **Advanced monitoring** - Detailed analytics and alerting

### Team keys {#team-keys}

Shared keys for collaborative development:

- **Multi-user access** - Share keys across team members
- **Role-based permissions** - Different access levels per team member
- **Audit logging** - Track usage by individual team members
- **Centralized billing** - Consolidated usage and billing management

## Using your API key {#using-api-key}

### Environment variables {#environment-variables}

The most secure way to use API keys is through environment variables:

```bash
# .env file
DD_CLOUD_API_KEY=your_api_key_here
DD_CLOUD_NETWORK=eth
DD_CLOUD_ENDPOINT=https://rpc.ddcloud.io
```

### JavaScript/Node.js {#javascript-nodejs}

```javascript
import { JsonRpcProvider } from "ethers";

// Load API key from environment
const apiKey = process.env.DD_CLOUD_API_KEY;
const network = process.env.DD_CLOUD_NETWORK || "eth";

const provider = new JsonRpcProvider(`https://rpc.ddcloud.io/${network}`, {
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});

// Make a request
const blockNumber = await provider.getBlockNumber();
console.log("Current block:", blockNumber);
```

### Python {#python}

```python
import os
import requests

# Load API key from environment
api_key = os.getenv('DD_CLOUD_API_KEY')
network = os.getenv('DD_CLOUD_NETWORK', 'eth')

# Make a request
response = requests.post(
    f'https://rpc.ddcloud.io/{network}',
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    },
    json={
        'jsonrpc': '2.0',
        'method': 'eth_blockNumber',
        'params': [],
        'id': 1
    }
)

result = response.json()
print(f"Current block: {result['result']}")
```

### cURL {#curl}

```bash
# Using environment variable
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DD_CLOUD_API_KEY" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://rpc.ddcloud.io/eth
```

## Security best practices {#security-best-practices}

### Never expose keys in client-side code {#never-expose-keys}

<div class="info-callout">
<p><strong>Critical Security Warning</strong><br>
Never include API keys in frontend JavaScript, mobile apps, or any client-side code. Keys should only be used in secure server environments.</p>
</div>

```javascript
// ❌ NEVER DO THIS - API key exposed to users
const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: {
    Authorization: "Bearer sk_live_1234567890abcdef", // Visible in browser!
  },
});

// ✅ DO THIS - Use a backend proxy instead
const response = await fetch("/api/blockchain", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    method: "eth_blockNumber",
    params: []
  }),
});
```

### Use IP restrictions {#use-ip-restrictions}

Limit API key usage to specific IP addresses:

```bash
# Update key to only allow requests from your server IPs
curl -X PATCH \
  -H "Authorization: Bearer YOUR_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "ipRestrictions": [
      "203.0.113.0/24",
      "198.51.100.42"
    ]
  }' \
  https://api.ddcloud.io/v1/keys/YOUR_KEY_ID
```

### Implement key rotation {#implement-key-rotation}

Regular key rotation is essential for security:

1. **Generate a new key** with identical permissions
2. **Update your applications** to use the new key
3. **Monitor both keys** during the transition period
4. **Revoke the old key** once migration is complete
5. **Schedule regular rotations** (recommended: every 90 days)

### Monitor key usage {#monitor-key-usage}

Set up monitoring and alerts for unusual activity:

```javascript
// Example: Check key usage programmatically
async function checkKeyUsage(keyId) {
  const response = await fetch(`https://api.ddcloud.io/v1/keys/${keyId}/usage`, {
    headers: {
      Authorization: `Bearer ${process.env.DD_CLOUD_MASTER_KEY}`,
    },
  });
  
  const usage = await response.json();
  
  // Alert if usage is unusually high
  if (usage.requestsLastHour > 5000) {
    console.warn("High API usage detected:", usage);
    // Send alert to monitoring system
  }
  
  return usage;
}
```

## Managing multiple keys {#managing-multiple-keys}

### Environment-based keys {#environment-based-keys}

Use different keys for different environments:

```javascript
const getApiKey = () => {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'production':
      return process.env.DD_CLOUD_PROD_KEY;
    case 'staging':
      return process.env.DD_CLOUD_STAGING_KEY;
    case 'development':
    default:
      return process.env.DD_CLOUD_DEV_KEY;
  }
};

const provider = new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
  headers: {
    Authorization: `Bearer ${getApiKey()}`,
  },
});
```

### Purpose-based keys {#purpose-based-keys}

Create keys for specific purposes:

```javascript
const keys = {
  // Read-only operations (safe for broader use)
  read: process.env.DD_CLOUD_READ_KEY,
  
  // Transaction broadcasting (restricted access)
  write: process.env.DD_CLOUD_WRITE_KEY,
  
  // Analytics and monitoring (separate billing)
  analytics: process.env.DD_CLOUD_ANALYTICS_KEY,
  
  // Background jobs and cron tasks
  background: process.env.DD_CLOUD_BACKGROUND_KEY,
};

function getProvider(purpose = 'read') {
  const apiKey = keys[purpose] || keys.read;
  
  return new JsonRpcProvider("https://rpc.ddcloud.io/eth", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
}

// Usage examples
const readProvider = getProvider('read');
const writeProvider = getProvider('write');
```

## Troubleshooting {#troubleshooting}

### Common issues {#common-issues}

**Invalid API Key Error:**
- Verify the key is copied correctly (no extra spaces)
- Check that the key hasn't expired
- Ensure you're using the correct key for the environment

**Network Access Denied:**
- Verify the key has access to the requested network
- Check network-specific restrictions in your key settings
- Ensure you're using the correct network endpoint

**Rate Limit Exceeded:**
- Check your current usage in the dashboard
- Consider upgrading your plan or optimizing requests
- Implement request queuing and retry logic

**IP Restriction Errors:**
- Verify your server's IP address
- Check if you're behind a proxy or load balancer
- Update IP restrictions to include all necessary addresses

### Getting help {#getting-help}

If you're still experiencing issues:

1. **Check the dashboard** - View real-time key status and usage
2. **Review logs** - Check request/response logs for error details
3. **Contact support** - Reach out via Discord or email with key ID
4. **Documentation** - Review our comprehensive API documentation

## Next steps {#next-steps}

Now that you have your API key set up:

- **[Make your first request](./first-request.md)** - Test your key with actual blockchain calls
- **[Understand rate limits](./rate-limits.md)** - Learn about usage limits and optimization
- **[Explore networks](../networks/overview.md)** - Discover all available blockchain networks
- **[View examples](../examples/javascript/overview.md)** - See practical implementation examples

</div>

<div class="content-toc">
<div class="toc-header">On this page</div>
<nav class="toc-nav">
<ul>
<li><a href="#what-are-api-keys" tabindex="0">What are API keys?</a>
  <ul>
    <li><a href="#key-benefits" tabindex="0">Key benefits</a></li>
  </ul>
</li>
<li><a href="#creating-first-api-key" tabindex="0">Creating your first API key</a>
  <ul>
    <li><a href="#access-dashboard" tabindex="0">Step 1: Access the dashboard</a></li>
    <li><a href="#configure-key-settings" tabindex="0">Step 2: Configure key settings</a></li>
    <li><a href="#generate-secure-key" tabindex="0">Step 3: Generate and secure your key</a></li>
  </ul>
</li>
<li><a href="#api-key-types" tabindex="0">API key types</a>
  <ul>
    <li><a href="#development-keys" tabindex="0">Development keys</a></li>
    <li><a href="#production-keys" tabindex="0">Production keys</a></li>
    <li><a href="#team-keys" tabindex="0">Team keys</a></li>
  </ul>
</li>
<li><a href="#using-api-key" tabindex="0">Using your API key</a>
  <ul>
    <li><a href="#environment-variables" tabindex="0">Environment variables</a></li>
    <li><a href="#javascript-nodejs" tabindex="0">JavaScript/Node.js</a></li>
    <li><a href="#python" tabindex="0">Python</a></li>
    <li><a href="#curl" tabindex="0">cURL</a></li>
  </ul>
</li>
<li><a href="#security-best-practices" tabindex="0">Security best practices</a>
  <ul>
    <li><a href="#never-expose-keys" tabindex="0">Never expose keys in client-side code</a></li>
    <li><a href="#use-ip-restrictions" tabindex="0">Use IP restrictions</a></li>
    <li><a href="#implement-key-rotation" tabindex="0">Implement key rotation</a></li>
    <li><a href="#monitor-key-usage" tabindex="0">Monitor key usage</a></li>
  </ul>
</li>
<li><a href="#managing-multiple-keys" tabindex="0">Managing multiple keys</a>
  <ul>
    <li><a href="#environment-based-keys" tabindex="0">Environment-based keys</a></li>
    <li><a href="#purpose-based-keys" tabindex="0">Purpose-based keys</a></li>
  </ul>
</li>
<li><a href="#troubleshooting" tabindex="0">Troubleshooting</a>
  <ul>
    <li><a href="#common-issues" tabindex="0">Common issues</a></li>
    <li><a href="#getting-help" tabindex="0">Getting help</a></li>
  </ul>
</li>
<li><a href="#next-steps" tabindex="0">Next steps</a></li>
</ul>
</nav>
</div>

</div>