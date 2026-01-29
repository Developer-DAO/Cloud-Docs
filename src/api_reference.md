
# API Reference

This reference contains the supported API endpoints for the D_D Cloud RPC.


> [!NOTE]
> The *Chain ID* in the context of D_D Cloud RPC refers to the path of the RPC
> endpoint URL, not the ID defined by EIP-155.

## HTTP Endpoint

Makes a JSON-RPC request to network specified by `CHAIN_ID`.

```
https://api.cloud.developerdao.com/rpc/{CHAIN_ID}/{API_KEY}
```

You can find a list of supported RPC `CHAIN_ID` values
[in the docs](./supported_networks.md) and get your API key in
[the D_D Cloud Dashboard](https://cloud.developerdao.com/dashboard/api-keys).

### Example

```
https://api.cloud.developerdao.com/rpc/eth/abcdef123456
```

## WebSockets Endpoint

Initiates a WebSockets connection to network specified by `CHAIN_ID`.


```
wss://api.cloud.developerdao.com/ws/{CHAIN_ID}/{API_KEY}
```

You can find a list of supported RPC `CHAIN_ID` values
[in the docs](./supported_networks.md) and get your API key in
[the D_D Cloud Dashboard](https://cloud.developerdao.com/dashboard/api-keys).

### Example

```
wss://api.cloud.developerdao.com/ws/sol/abcdef123456
```