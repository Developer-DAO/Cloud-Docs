<div class="page-layout">
<div class="content-main">

# Get Started with D_D Cloud RPC

Welcome to D_D Cloud RPC! This guide will get you up and running in under 5 minutes. Follow along to make your first blockchain request and start building amazing dApps.

# Making Your First Request

## Prerequisites {#prerequisites}

Before you begin, make sure you have:

- A [D_D Cloud account](https://dashboard.ddcloud.io) (free signup)
- Basic knowledge of your preferred programming language
- Internet connection for API requests

**Estimated time**: ~5 minutes ⏱️

## Step 1: Get Your API Key {#get-api-key}

API keys authenticate your requests to D_D Cloud RPC services and track your usage.

### Create Your API Key {#create-api-key}

1. Sign in to your [D_D Cloud Dashboard](https://dashboard.ddcloud.io)
2. Navigate to **API Keys** in the left sidebar
3. Click **Create New Key** 
4. Choose a descriptive name (e.g., "My First dApp")
5. Copy and securely store your API key

<div class="info-callout">
  <p><strong>💡 Pro Tip</strong><br>
  Store your API key in environment variables, never hardcode it in your source code!</p>
</div>

## Step 2: Install Dependencies {#install-dependencies}

Choose your preferred language and install the required packages:

```javascript
// JavaScript/Node.js
npm install ethers
```

```python
# Python
pip install web3
```

```rust
// Rust
cargo add alloy tokio --features alloy/full,tokio/full
```

```bash
# cURL is pre-installed on most systems
curl --version
```

## Step 3: Make Your First Request {#make-first-request}

Now let's fetch the latest finalized block from Ethereum. Replace `YOUR_API_KEY_GOES_HERE` with your actual API key:

### JavaScript/Node.js

```javascript
import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider(
    `https://cloud.developerdao.com/rpc/ethereum/YOUR_API_KEY_GOES_HERE`
  );

  try {
    // Get the most recent finalized block
    const block = await provider.getBlock("finalized");
    
    // Log the block details
    console.log("✅ Most recent, finalized block:", {
      number: block.number,
      hash: block.hash,
      timestamp: new Date(block.timestamp * 1000).toISOString(),
      transactions: block.transactions.length
    });
  } catch (error) {
    console.error("❌ Error fetching block:", error.message);
  }
}

main();
```


### Python

```python
from web3 import Web3
from datetime import datetime

def main():
    # Initialize Web3 with D_D Cloud RPC endpoint
    provider_url = "https://cloud.developerdao.com/rpc/ethereum/YOUR_API_KEY_GOES_HERE"
    web3 = Web3(Web3.HTTPProvider(provider_url))
    
    try:
        # Check connection
        if not web3.is_connected():
            raise Exception("Failed to connect to D_D Cloud RPC")
            
        # Get the most recent finalized block
        block = web3.eth.get_block('finalized')
        
        # Log the block details
        print("✅ Most recent, finalized block:", {
            "number": block.number,
            "hash": block.hash.hex(),
            "timestamp": datetime.fromtimestamp(block.timestamp).isoformat(),
            "transactions": len(block.transactions)
        })
    except Exception as error:
        print(f"❌ Error fetching block: {error}")

if __name__ == "__main__":
    main()
```



### Rust

```rust
use alloy::{
    eips::BlockId,
    providers::{Provider, ProviderBuilder},
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let provider = ProviderBuilder::new()
        .on_http("https://cloud.developerdao.com/rpc/ethereum/YOUR_API_KEY_GOES_HERE"
            .parse()?);
    
    match provider.get_block(BlockId::finalized()).await {
        Ok(Some(block)) => {
            println!("✅ Most recent, finalized block:");
            println!("  Number: {:?}", block.header.number);
            println!("  Hash: {:?}", block.header.hash);
            println!("  Timestamp: {:?}", block.header.timestamp);
            println!("  Transactions: {}", block.transactions.len());
        }
        Ok(None) => println!("❌ Block not found"),
        Err(e) => println!("❌ Error fetching block: {}", e),
    }
    
    Ok(())
}
```

Cargo.toml:
```toml
[package]
name = "dd_cloud_demo"
version = "0.1.0"
edition = "2021"

[dependencies]
alloy = { version = "0.13.0", features = ["full"] }
tokio = { version = "1.44.1", features = ["full"] }
```



### cURL

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBlockByNumber",
    "params": ["finalized", true],
    "id": 1
  }' \
  https://cloud.developerdao.com/rpc/ethereum/YOUR_API_KEY_GOES_HERE
```


## What's Next? {#whats-next}

- **Deploy Your First dApp**: Learn to build and deploy a complete decentralized application using D_D Cloud RPC. [Start Building →](../tutorials/first-dapp.md)
- **Explore All Networks**: Discover 50+ supported blockchain networks including Ethereum, Polygon, Arbitrum, and more. [View Networks →](../networks/overview.md)
- **Advanced Features**: WebSockets, batch requests, archive data, and performance optimization techniques. [Learn More →](../advanced/websockets.md)
- **API Reference**: Complete documentation of all available RPC methods and parameters. [View Docs →](../api-reference/ethereum.md)
- **Join Community**: Connect with other developers, get help, and share your projects with the D_D community. [Join Discord →](https://discord.gg/developerdao)
- **Monitor Usage**: Track your API usage, set up alerts, and optimize your applications for better performance. [View Dashboard →](https://dashboard.ddcloud.io/analytics)

</div>

<div class="content-toc">
    <div class="toc-header">On This Page</div>
    <nav class="toc-nav">
    <ul>
    <li><a href="#prerequisites" tabindex="0">Prerequisites</a></li>
    <li><a href="#get-api-key" tabindex="0">Step 1: Get API Key</a>
      <ul>
        <li><a href="#create-api-key" tabindex="0">Create Your API Key</a></li>
      </ul>
    </li>
    <li><a href="#install-dependencies" tabindex="0">Step 2: Install Dependencies</a></li>
    <li><a href="#make-first-request" tabindex="0">Step 3: Make First Request</a></li>
    <li><a href="#whats-next" tabindex="0">What's Next?</a></li>
    </ul>
    </nav>
    </div>

</div>
