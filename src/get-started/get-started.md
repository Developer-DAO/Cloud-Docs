<div class="page-layout">
<div class="content-main">

# Get started with D_D Cloud

D_D Cloud is a comprehensive blockchain infrastructure service that offers reliable access to 60+ networks. This guide will help you get started with our RPC API services.

## Sign up to D_D Cloud {#sign-up}

D_D Cloud provides enterprise-grade blockchain infrastructure services to facilitate dapp development across multiple networks. Sign up for an account on the [D_D Cloud dashboard](https://dashboard.ddcloud.io/signup).

To activate your account, verify your email address by clicking the link sent to your inbox.

### API key restrictions

Based on your plan, D_D Cloud allows for the following number of API keys:

- **Free plan** - Allows up to 3 API keys
- **Developer plan** - Allows up to 10 API keys
- **Team plans and higher** - No limit on the number of API keys

For more information, refer to the [D_D Cloud pricing information](https://ddcloud.io/pricing).

## View your API key {#view-api-key}

After verification, you'll be directed to the D_D Cloud dashboard where you can view or configure your API key. D_D Cloud automatically generates a default API key for your first project.

Select your project or the **Configure** link to view your API key settings.

In the **Endpoints** tab that displays, all network endpoints are enabled by default, and you can view your API key and endpoint URLs.

## Send requests {#send-requests}

Use the API key when sending requests. The following examples interact with the Ethereum network by sending requests using HTTP.

<div class="info-callout">
<p><strong>Info</strong><br>
All requests are POST requests.<br>
Replace <code>&lt;YOUR-API-KEY&gt;</code> with your own unique API key.<br>
We recommend using Postman if you're a Windows user.</p>
</div>

Use a tool such as cURL or Postman to make requests.

### Get the current block number {#get-block-number}

Retrieve the current block number from the Ethereum network.

```bash
curl https://rpc.ddcloud.io/eth \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR-API-KEY>" \
  --data '{"jsonrpc": "2.0", "id": 1, "method": "eth_blockNumber", "params": []}'
```

You'll receive a response similar to:

```json
{ "jsonrpc": "2.0", "id": 1, "result": "0x1234567" }
```

The data returned is in hexadecimal, prefixed with `0x`. If you convert `1234567` to decimal, you get the current block number at the time the query was made.

### View the Ether balance of an address {#get-balance}

Check the balance of an Ethereum address or smart contract.

The example code checks the latest balance of the Ethereum Proof of Stake (PoS) contract.

```bash
curl https://rpc.ddcloud.io/eth \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR-API-KEY>" \
  -d '{"jsonrpc": "2.0", "method": "eth_getBalance", "params": ["0x00000000219ab540356cBB839Cbe05303d7705Fa", "latest"], "id": 1}'
```

You'll receive a result similar to:

```json
{ "jsonrpc": "2.0", "id": 1, "result": "0x96c8e932f1e499c855045" }
```

This result is the hexadecimal value of the balance in wei (the smallest denomination of Ether).

### Get transaction details {#get-transaction}

Retrieve details about a specific transaction using its hash.

```bash
curl https://rpc.ddcloud.io/eth \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR-API-KEY>" \
  -d '{"jsonrpc": "2.0", "method": "eth_getTransactionByHash", "params": ["0x1234567890abcdef..."], "id": 1}'
```

## Secure your API key {#secure-api-key}

Configure security settings in the **Settings** tab of your project dashboard. This step is optional but recommended for production applications.

Security options include:

- **IP allowlisting** - Restrict API access to specific IP addresses
- **Domain restrictions** - Limit usage to specific domains
- **Rate limiting** - Set custom rate limits for your API key
- **Usage alerts** - Get notified when approaching limits

## Monitor your usage {#monitor-usage}

The dashboard displays an overview of your daily request health and usage statistics. Select **Analytics** from the left navigation to monitor your project stats.

### Request statistics

From the Analytics page, view real-time statistics about your API usage:

- **Request volume** - Total requests per day/hour
- **Response times** - Average response latency
- **Error rates** - Failed request percentages
- **Network distribution** - Usage across different blockchain networks

### Credit usage

Monitor your credit consumption and optimize your application:

- **Daily usage** - Credits consumed per day
- **Method breakdown** - Most used RPC methods
- **Network costs** - Cost per network
- **Billing projections** - Estimated monthly costs

## Manage your account {#manage-account}

Find additional settings in the **Account** menu to manage your D_D Cloud account:

### Account settings

- **Profile information** - Update your account details
- **Notification preferences** - Set alerts for usage limits
- **Security settings** - Enable two-factor authentication

### Billing management

- **Payment methods** - Add or update payment information
- **Billing history** - View past invoices and payments
- **Plan management** - Upgrade or downgrade your plan

### Team collaboration

- **Team members** - Invite team members to your organization
- **API key sharing** - Share keys with specific permissions
- **Role management** - Assign different access levels

## Next steps {#next-steps}

Now that you have D_D Cloud set up, explore these resources:

- [**Make your first request**](./first-request.md) - Detailed examples for different networks
- [**Understand rate limits**](./rate-limits.md) - Learn about usage limits and optimization
- [**Explore supported networks**](../networks/overview.md) - See all available blockchain networks
- [**View API reference**](../reference/json-rpc.md) - Complete method documentation

</div>

<div class="content-toc">
<div class="toc-header">On this page</div>
<nav class="toc-nav">
<ul>
<li><a href="#sign-up" tabindex="0">Sign up to D_D Cloud</a></li>
<li><a href="#view-api-key" tabindex="0">View your API key</a></li>
<li><a href="#send-requests" tabindex="0">Send requests</a>
  <ul>
    <li><a href="#get-block-number" tabindex="0">Get the current block number</a></li>
    <li><a href="#get-balance" tabindex="0">View the Ether balance of an address</a></li>
    <li><a href="#get-transaction" tabindex="0">Get transaction details</a></li>
  </ul>
</li>
<li><a href="#secure-api-key" tabindex="0">Secure your API key</a></li>
<li><a href="#monitor-usage" tabindex="0">Monitor your usage</a></li>
<li><a href="#manage-account" tabindex="0">Manage your account</a></li>
<li><a href="#next-steps" tabindex="0">Next steps</a></li>
</ul>
</nav>
</div>

</div>


