# Getting Started

Welcome! This guide will get you up and running with the D_D Cloud RPC in under
five minutes.

Follow along to make your first RPC request and start building
amazing DApps.

## Prerequisites

Before you begin, make sure you have:

* A D_D Cloud account ([sign up is free!](https://cloud.developerdao.com/register))
* Basic knowledge of a programming language like JavaScript, TypeScript, Python,
  Rust, or Bash Script.
* Internet connection for API requests.

## Getting an API key

If you already created an API key, you can find it in
[your D_D Cloud Dashboard](https://cloud.developerdao.com/dashboard/api-keys);
otherwise, you must create a new one.

1. Open
   [your D_D Cloud Dashboard](https://cloud.developerdao.com/dashboard/api-keys).
2. Click the **Generate New API Key** button. 
3. Copy the new API key and store it in a secure location.

### Take The .env Pledge

[The .env Pledge](https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/5)
outlines best practices for handling crypto keys. Taking it is a fun way to
remind yourself about safe key management.

## Installing Dependencies

Choose your preferred language and install the required packages.

{{#tabs global="languages" }}

{{#tab name="JavaScript" }}
```bash
npm install ethers
```
{{#endtab }}

{{#tab name="Python" }}
```bash
pip install web3
```
{{#endtab }}

{{#tab name="Rust" }}
```bash
cargo add alloy tokio --features alloy/full,tokio/full
```
{{#endtab }}

{{#endtabs }}

## Sending the first request

Now that you set everything up, let's fetch the latest finalized block from
Ethereum. 

Replace `YOUR_API_KEY` with your actual API key.


{{#tabs global="languages" }}

{{#tab name="JavaScript" }}
```javascript
import { ethers } from "ethers"

async function main() {
  const rpcClient = new ethers.JsonRpcProvider(
    "https://api.cloud.developerdao.com/rpc/eth/YOUR_API_KEY"
  )

  try {
    // Get the most recent finalized block
    const block = await rpcClient.getBlock("finalized")


    // Log the block details
    console.log("✅ Most recent, finalized block:", {
      number: block.number,
      hash: block.hash,
      timestamp: new Date(block.timestamp * 1000).toISOString(),
      transactions: block.transactions.length
    })
  } catch (error) {
    console.error("❌ Failed to fetch block:", error.message)
  }
}

main()
```
{{#endtab }}

{{#tab name="Python" }}
```python
from web3 import Web3
from datetime import datetime

def main():
    rpcClient = Web3(Web3.HTTPProvider(
        "https://api.cloud.developerdao.com/rpc/eth/YOUR_API_KEY"
    ))


    try:
        # Check connection
        if not rpcClient.is_connected():
            raise Exception("❌ Failed to connect to D_D Cloud RPC")


        # Get the most recent finalized block
        block = rpcClient.eth.get_block('finalized')


        # Log the block details
        print("✅ Most recent, finalized block:", {
            "number": block.number,
            "hash": block.hash.hex(),
            "timestamp": datetime.fromtimestamp(block.timestamp).isoformat(),
            "transactions": len(block.transactions)
        })
    except Exception as error:
        print(f"❌ Failed to fetch block: {error}")

if __name__ == "__main__":
    main()
```
{{#endtab }}

{{#tab name="Rust" }}
```rust
use alloy::{
    eips::BlockId,
    providers::{Provider, ProviderBuilder},
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let provider = ProviderBuilder::new().on_http(
        "https://api.cloud.developerdao.com/rpc/eth/YOUR_API_KEY".parse()?
    );


    match provider.get_block(BlockId::finalized()).await {
        Ok(Some(block)) => {
            println!("✅ Most recent, finalized block:");
            println!("  Number: {:?}", block.header.number);
            println!("  Hash: {:?}", block.header.hash);
            println!("  Timestamp: {:?}", block.header.timestamp);
            println!("  Transactions: {}", block.transactions.len());
        }
        Ok(None) => println!("❌ Failed to fetch block: block not found"),
        Err(e) => println!("❌ Failed to fetch block: {}", e),
    }


    Ok(())
}
```
{{#endtab }}


{{#tab name="Curl" }}
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBlockByNumber",
    "params": ["finalized", true],
    "id": 1
  }' \
  https://api.cloud.developerdao.com/rpc/eth/YOUR_API_KEY
```
{{#endtab }}

{{#endtabs }}

## Next Steps

After getting your first connection up and running, check out what D_D Cloud has
to offer.

* Discover [supported networks](./supported_networks.md), including
  Ethereum, Base, Solana, and more.
* Check out [the API reference](./api_reference.md) of all available RPC methods
  and parameters.