# Get Started with D_D Cloud RPC

Welcome to D_D Cloud RPC! This guide will get you up and running in under 5 minutes. Follow along to make your first blockchain request and start building amazing dApps.

# Making Your First Request

## Prerequisites {#prerequisites}

Before you begin, make sure you have:

- A [D_D Cloud account](https://cloud.developerdao.com/login) (free signup)
- Basic knowledge of your preferred programming language
- Internet connection for API requests

## Step 1: Get Your API Key {#get-api-key}

If you already created an API key, you should find it [here](https://cloud.developerdao.com/dashboard/api-keys). Otherwise, proceed to the sub-section below.

### Create Your API Key {#create-api-key}

1. Sign in to your [D_D Cloud Account](https://cloud.developerdao.com/login)
2. Navigate to **Manage API Keys** in the center of the dashboard page
3. Click **Generate New Key** 
4. Copy and securely store your API key

<div class="warning">
  <p><strong>Caution</strong></p>
     <a href="https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/5">Take the pledge by Patrick Collins</a>
    <ul>   
        <li> do not hardcode secrets into your code </li>
        <li> do not store secrets in plaintext </li>
    </ul>
  </div>

## Step 2: Install Dependencies {#install-dependencies}

Choose your preferred language and install the required packages:

{{#tabs}}
{{#tab name="Javascript"}}
```bash
npm install ethers
```
{{#endtab}}

{{#tab name="Python"}}
```bash
pip install web3
```
{{#endtab}}

{{#tab name="Rust"}}
```bash
cargo add alloy tokio --features alloy/full,tokio/full
```
{{#endtab}}
{{#endtabs}}

## Step 3: Make Your First Request {#make-first-request}

Now let's fetch the latest finalized block from Ethereum. Replace `YOUR_API_KEY_GOES_HERE` with your actual API key:

{{#tabs}}
{{#tab name="Javascript"}}
```javascript
import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider(
    `https://api.cloud.developerdao.com/rpc/eth/YOUR_API_KEY_GOES_HERE`
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
{{#endtab}}
{{#tab name="Python"}}
### Python

```python
from web3 import Web3
from datetime import datetime

def main():
    # Initialize Web3 with D_D Cloud RPC endpoint
    provider_url = "https://api.cloud.developerdao.com/rpc/eth/YOUR_API_KEY_GOES_HERE"
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
{{#endtab}}
{{#tab name="Rust"}}
```rust
use alloy::{
    eips::BlockId,
    providers::{Provider, ProviderBuilder},
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let provider = ProviderBuilder::new()
        .on_http("https://api.cloud.developerdao.com/rpc/eth/YOUR_API_KEY_GOES_HERE"
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
{{#endtab}}
{{#tab name="Bash"}}
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
  https://api.cloud.developerdao.com/rpc/eth/YOUR_API_KEY_GOES_HERE
```
{{#endtab}}
{{#endtabs}}

## What's Next? {#whats-next}

- **Deploy Your First dApp**: Learn to build and deploy a complete decentralized application using D_D Cloud RPC. [Start Building →](../tutorials/first-dapp.md)
- **Explore All Networks**: Discover 50+ supported blockchain networks including Ethereum, Polygon, Arbitrum, and more. [View Networks →](../networks/overview.md)
- **Advanced Features**: WebSockets, batch requests, archive data, and performance optimization techniques. [Learn More →](../advanced/websockets.md)
- **API Reference**: Complete documentation of all available RPC methods and parameters. [View Docs →](../api-reference/ethereum.md)
- **Join Community**: Connect with other developers, get help, and share your projects with the D_D community. [Join Discord →](https://discord.gg/developerdao)
- **Monitor Usage**: Track your API usage, set up alerts, and optimize your applications for better performance. [View Dashboard →](https://dashboard.ddcloud.io/analytics)

</div>
