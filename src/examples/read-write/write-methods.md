# Write Methods Examples

This page demonstrates various write methods across different blockchain networks. Write methods modify blockchain state and require proper transaction handling, gas management, and security considerations.

## Ethereum/EVM Write Methods

### Simple ETH Transfer

```javascript
// Using ethers.js with wallet
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://rpc.dd.cloud/ethereum");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

async function sendEther(toAddress, amount) {
  try {
    // Estimate gas
    const gasEstimate = await wallet.estimateGas({
      to: toAddress,
      value: ethers.parseEther(amount),
    });

    // Get current gas price
    const gasPrice = await provider.getFeeData();

    const transaction = {
      to: toAddress,
      value: ethers.parseEther(amount),
      gasLimit: gasEstimate,
      maxFeePerGas: gasPrice.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
    };

    const tx = await wallet.sendTransaction(transaction);
    console.log("Transaction sent:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    return {
      hash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status,
    };
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
}

// Usage
const result = await sendEther(
  "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C",
  "0.1"
);
```

### ERC-20 Token Transfer

```javascript
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

async function transferToken(tokenAddress, toAddress, amount) {
  try {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

    // Get token decimals
    const decimals = await contract.decimals();
    const tokenAmount = ethers.parseUnits(amount, decimals);

    // Check balance
    const balance = await contract.balanceOf(wallet.address);
    if (balance < tokenAmount) {
      throw new Error("Insufficient token balance");
    }

    // Estimate gas
    const gasEstimate = await contract.transfer.estimateGas(
      toAddress,
      tokenAmount
    );

    // Send transaction
    const tx = await contract.transfer(toAddress, tokenAmount, {
      gasLimit: (gasEstimate * 120n) / 100n, // Add 20% buffer
    });

    console.log("Token transfer sent:", tx.hash);
    const receipt = await tx.wait();

    return {
      hash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status,
    };
  } catch (error) {
    console.error("Error transferring token:", error);
    throw error;
  }
}
```

### Smart Contract Deployment

```javascript
async function deployContract(bytecode, abi, constructorArgs = []) {
  try {
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Estimate deployment gas
    const deployTransaction = factory.getDeployTransaction(...constructorArgs);
    const gasEstimate = await wallet.estimateGas(deployTransaction);

    // Deploy contract
    const contract = await factory.deploy(...constructorArgs, {
      gasLimit: (gasEstimate * 120n) / 100n,
    });

    console.log(
      "Contract deployment sent:",
      contract.deploymentTransaction().hash
    );

    // Wait for deployment
    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log("Contract deployed at:", address);

    return {
      address,
      deploymentHash: contract.deploymentTransaction().hash,
      contract,
    };
  } catch (error) {
    console.error("Error deploying contract:", error);
    throw error;
  }
}
```

### Contract Function Call

```javascript
// Example: Calling a contract function that modifies state
const CONTRACT_ABI = [
  "function setValue(uint256 _value) returns (bool)",
  "function getValue() view returns (uint256)",
];

async function callContractFunction(contractAddress, newValue) {
  try {
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);

    // Estimate gas for the function call
    const gasEstimate = await contract.setValue.estimateGas(newValue);

    // Call the function
    const tx = await contract.setValue(newValue, {
      gasLimit: (gasEstimate * 120n) / 100n,
    });

    console.log("Function call sent:", tx.hash);
    const receipt = await tx.wait();

    // Verify the change
    const currentValue = await contract.getValue();
    console.log("New value set:", currentValue.toString());

    return {
      hash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      newValue: currentValue.toString(),
    };
  } catch (error) {
    console.error("Error calling contract function:", error);
    throw error;
  }
}
```

### Raw Transaction Submission

```javascript
async function sendRawTransaction(toAddress, amount, nonce) {
  try {
    const transaction = {
      to: toAddress,
      value: ethers.parseEther(amount),
      gasLimit: 21000,
      gasPrice: ethers.parseUnits("20", "gwei"),
      nonce: nonce,
    };

    // Sign the transaction
    const signedTx = await wallet.signTransaction(transaction);

    // Send raw transaction
    const tx = await provider.broadcastTransaction(signedTx);
    console.log("Raw transaction sent:", tx.hash);

    const receipt = await tx.wait();
    return {
      hash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status,
    };
  } catch (error) {
    console.error("Error sending raw transaction:", error);
    throw error;
  }
}
```

## Solana Write Methods

### SOL Transfer

```javascript
import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const connection = new Connection("https://rpc.dd.cloud/solana");

async function transferSOL(fromKeypair, toAddress, amount) {
  try {
    const toPubkey = new PublicKey(toAddress);
    const lamports = amount * LAMPORTS_PER_SOL;

    // Create transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPubkey,
      lamports: lamports,
    });

    // Create transaction
    const transaction = new Transaction().add(transferInstruction);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromKeypair.publicKey;

    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      fromKeypair,
    ]);

    console.log("SOL transfer confirmed:", signature);
    return { signature };
  } catch (error) {
    console.error("Error transferring SOL:", error);
    throw error;
  }
}
```

### SPL Token Transfer

```javascript
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

async function transferSPLToken(
  fromKeypair,
  toAddress,
  mintAddress,
  amount,
  decimals
) {
  try {
    const toPubkey = new PublicKey(toAddress);
    const mintPubkey = new PublicKey(mintAddress);

    // Get or create associated token accounts
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      mintPubkey,
      fromKeypair.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      mintPubkey,
      toPubkey
    );

    // Transfer tokens
    const signature = await transfer(
      connection,
      fromKeypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromKeypair.publicKey,
      amount * Math.pow(10, decimals)
    );

    console.log("SPL token transfer confirmed:", signature);
    return { signature };
  } catch (error) {
    console.error("Error transferring SPL token:", error);
    throw error;
  }
}
```

### Program Interaction

```javascript
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

async function callProgram(userKeypair, programId, instructionData, accounts) {
  try {
    const programPubkey = new PublicKey(programId);

    // Create instruction
    const instruction = new TransactionInstruction({
      keys: accounts.map((account) => ({
        pubkey: new PublicKey(account.pubkey),
        isSigner: account.isSigner,
        isWritable: account.isWritable,
      })),
      programId: programPubkey,
      data: Buffer.from(instructionData),
    });

    // Create and send transaction
    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      userKeypair,
    ]);

    console.log("Program call confirmed:", signature);
    return { signature };
  } catch (error) {
    console.error("Error calling program:", error);
    throw error;
  }
}
```

## NEAR Protocol Write Methods

### NEAR Token Transfer

```javascript
import { connect, keyStores, utils } from "near-api-js";

const config = {
  networkId: "mainnet",
  keyStore: new keyStores.InMemoryKeyStore(),
  nodeUrl: "https://rpc.dd.cloud/near",
  walletUrl: "https://wallet.near.org",
  helperUrl: "https://helper.near.org",
};

async function transferNEAR(senderAccountId, receiverAccountId, amount) {
  try {
    const near = await connect(config);
    const account = await near.account(senderAccountId);

    // Convert NEAR to yoctoNEAR
    const amountInYocto = utils.format.parseNearAmount(amount);

    const result = await account.sendMoney(receiverAccountId, amountInYocto);

    console.log("NEAR transfer confirmed:", result.transaction.hash);
    return {
      transactionHash: result.transaction.hash,
      status: result.status,
    };
  } catch (error) {
    console.error("Error transferring NEAR:", error);
    throw error;
  }
}
```

### Function Call Transaction

```javascript
async function callContractFunction(
  accountId,
  contractId,
  methodName,
  args,
  attachedDeposit = "0",
  gas = "30000000000000"
) {
  try {
    const near = await connect(config);
    const account = await near.account(accountId);

    const result = await account.functionCall({
      contractId: contractId,
      methodName: methodName,
      args: args,
      attachedDeposit: utils.format.parseNearAmount(attachedDeposit),
      gas: gas,
    });

    console.log("Function call confirmed:", result.transaction.hash);
    return {
      transactionHash: result.transaction.hash,
      status: result.status,
      result: result.status.SuccessValue
        ? JSON.parse(
            Buffer.from(result.status.SuccessValue, "base64").toString()
          )
        : null,
    };
  } catch (error) {
    console.error("Error calling contract function:", error);
    throw error;
  }
}

// Example: FT transfer
const result = await callContractFunction(
  "sender.near",
  "token.near",
  "ft_transfer",
  {
    receiver_id: "receiver.near",
    amount: "1000000000000000000000000", // 1 token with 24 decimals
  },
  "1" // 1 yoctoNEAR deposit required for storage
);
```

### Contract Deployment

```javascript
async function deployContract(accountId, wasmFilePath, initArgs = {}) {
  try {
    const near = await connect(config);
    const account = await near.account(accountId);

    // Read WASM file
    const fs = require("fs");
    const wasmCode = fs.readFileSync(wasmFilePath);

    // Deploy contract
    const result = await account.deployContract(wasmCode);

    console.log("Contract deployed:", result.transaction.hash);

    // Initialize contract if init args provided
    if (Object.keys(initArgs).length > 0) {
      const initResult = await account.functionCall({
        contractId: accountId,
        methodName: "new",
        args: initArgs,
        gas: "30000000000000",
      });

      console.log("Contract initialized:", initResult.transaction.hash);
    }

    return {
      deploymentHash: result.transaction.hash,
      initHash:
        Object.keys(initArgs).length > 0 ? initResult.transaction.hash : null,
    };
  } catch (error) {
    console.error("Error deploying contract:", error);
    throw error;
  }
}
```

## Sui Network Write Methods

### SUI Transfer

```javascript
import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

const client = new SuiClient({ url: "https://rpc.dd.cloud/sui" });

async function transferSUI(keypair, recipient, amount) {
  try {
    const txb = new TransactionBlock();

    // Create transfer transaction
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(amount)]);
    txb.transferObjects([coin], txb.pure(recipient));

    // Execute transaction
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    console.log("SUI transfer confirmed:", result.digest);
    return {
      digest: result.digest,
      effects: result.effects,
      objectChanges: result.objectChanges,
    };
  } catch (error) {
    console.error("Error transferring SUI:", error);
    throw error;
  }
}
```

### Move Function Call

```javascript
async function callMoveFunction(
  keypair,
  packageId,
  module,
  functionName,
  args = [],
  typeArgs = []
) {
  try {
    const txb = new TransactionBlock();

    // Call move function
    txb.moveCall({
      target: `${packageId}::${module}::${functionName}`,
      arguments: args.map((arg) => txb.pure(arg)),
      typeArguments: typeArgs,
    });

    // Execute transaction
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });

    console.log("Move function call confirmed:", result.digest);
    return {
      digest: result.digest,
      effects: result.effects,
      events: result.events,
    };
  } catch (error) {
    console.error("Error calling move function:", error);
    throw error;
  }
}
```

## Advanced Write Patterns

### Transaction Batching

```javascript
// Ethereum batch transactions
async function batchTransactions(transactions) {
  try {
    const promises = transactions.map(async (tx, index) => {
      // Add nonce to prevent conflicts
      const nonce = (await wallet.getNonce()) + index;
      return wallet.sendTransaction({ ...tx, nonce });
    });

    const results = await Promise.all(promises);

    // Wait for all confirmations
    const receipts = await Promise.all(results.map((tx) => tx.wait()));

    return receipts.map((receipt, index) => ({
      hash: results[index].hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status,
    }));
  } catch (error) {
    console.error("Error in batch transactions:", error);
    throw error;
  }
}
```

### Gas Optimization

```javascript
async function optimizedTransaction(transaction) {
  try {
    // Get current network conditions
    const feeData = await provider.getFeeData();
    const gasEstimate = await wallet.estimateGas(transaction);

    // Optimize gas settings based on network conditions
    const optimizedTx = {
      ...transaction,
      gasLimit: (gasEstimate * 110n) / 100n, // 10% buffer
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: (feeData.maxPriorityFeePerGas * 90n) / 100n, // Slightly lower priority fee
    };

    const tx = await wallet.sendTransaction(optimizedTx);
    return await tx.wait();
  } catch (error) {
    console.error("Error in optimized transaction:", error);
    throw error;
  }
}
```

### Transaction Monitoring

```javascript
class TransactionMonitor {
  constructor(provider) {
    this.provider = provider;
    this.pendingTxs = new Map();
  }

  async submitAndMonitor(transaction, options = {}) {
    const { timeout = 300000, confirmations = 1 } = options;

    try {
      const tx = await this.provider.sendTransaction(transaction);
      console.log(`Transaction submitted: ${tx.hash}`);

      this.pendingTxs.set(tx.hash, {
        transaction: tx,
        timestamp: Date.now(),
        confirmations: 0,
      });

      // Set timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Transaction timeout")), timeout)
      );

      // Wait for confirmations
      const confirmationPromise = this.waitForConfirmations(
        tx.hash,
        confirmations
      );

      const result = await Promise.race([confirmationPromise, timeoutPromise]);
      this.pendingTxs.delete(tx.hash);

      return result;
    } catch (error) {
      console.error("Transaction monitoring error:", error);
      throw error;
    }
  }

  async waitForConfirmations(txHash, requiredConfirmations) {
    return new Promise((resolve, reject) => {
      const checkConfirmations = async () => {
        try {
          const receipt = await this.provider.getTransactionReceipt(txHash);

          if (receipt) {
            const currentBlock = await this.provider.getBlockNumber();
            const confirmations = currentBlock - receipt.blockNumber + 1;

            if (confirmations >= requiredConfirmations) {
              resolve({
                receipt,
                confirmations,
                hash: txHash,
              });
            } else {
              setTimeout(checkConfirmations, 5000); // Check every 5 seconds
            }
          } else {
            setTimeout(checkConfirmations, 5000);
          }
        } catch (error) {
          reject(error);
        }
      };

      checkConfirmations();
    });
  }
}

// Usage
const monitor = new TransactionMonitor(provider);
const result = await monitor.submitAndMonitor(transaction, {
  timeout: 600000, // 10 minutes
  confirmations: 3,
});
```

## Security Best Practices

### Safe Transaction Handling

```javascript
class SecureTransactionHandler {
  constructor(wallet, provider) {
    this.wallet = wallet;
    this.provider = provider;
  }

  async secureTransfer(to, amount, options = {}) {
    try {
      // Validate inputs
      if (!ethers.isAddress(to)) {
        throw new Error("Invalid recipient address");
      }

      if (amount <= 0) {
        throw new Error("Amount must be positive");
      }

      // Check balance
      const balance = await this.wallet.provider.getBalance(
        this.wallet.address
      );
      const amountWei = ethers.parseEther(amount.toString());

      if (balance < amountWei) {
        throw new Error("Insufficient balance");
      }

      // Estimate gas and check if we have enough for gas
      const gasEstimate = await this.wallet.estimateGas({
        to,
        value: amountWei,
      });

      const feeData = await this.provider.getFeeData();
      const maxGasCost = gasEstimate * feeData.maxFeePerGas;

      if (balance < amountWei + maxGasCost) {
        throw new Error("Insufficient balance for transaction and gas");
      }

      // Create transaction with safety checks
      const transaction = {
        to,
        value: amountWei,
        gasLimit: (gasEstimate * 120n) / 100n, // 20% buffer
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      };

      // Send transaction
      const tx = await this.wallet.sendTransaction(transaction);
      console.log("Secure transaction sent:", tx.hash);

      return await tx.wait();
    } catch (error) {
      console.error("Secure transaction failed:", error);
      throw error;
    }
  }
}
```

These examples demonstrate comprehensive write method implementations across multiple blockchain networks, including proper error handling, gas optimization, and security considerations for production use.
