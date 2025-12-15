# Cloud RPC API 

## Prerequisites

Before continuing, an account is required for access. If you already have an API key, however, you may skip this step. 

First, please register or log in at [https://cloud.developerdao.com](https://cloud.developerdao.com). 
Next, In the center of the [dashboard](https://cloud.developerdao.com/dashboard) page, click the gray button that says ["manage API keys"](https://cloud.developerdao.com/dashboard/api-keys). 
Lastly, click the white button that says "Generate New API Key" and copy the newly generated key from the table below.

## JSON-RPC 

Sends a JSON-RPC call to the CHAIN_ID.


```
https://api.cloud.developerdao.com/rpc/{CHAIN_ID}/{API_KEY}
```

## Websockets
Initiates a websocket connection to CHAIN_ID

```
wss://api.cloud.developerdao.com/ws/{CHAIN_ID}/{API_KEY}
```

### Parameters 

There are two parameters required on each path of the RPC service: a chain id and an api key. 

| Parameter | Description | Type | Optional | 
| :-------: | :---------: | :--: | :------: |
| CHAIN_ID  | Routes your request to the chain you want to use | Path | False | 
| API_KEY | The user's API key obtained from the dashboard. Used for auth and tracking resource consumption. | Path | False |


### Supported Chain IDS 

| ID | WS Support |
| :----: | :-----: |
| eth  | false |
| base | true |
| arb-one | false |
| solana | false |
| sui | false | 
| bsc| true |
| poly | false | 
| op | false |


  <!---->
  <!-- - base -->
  <!-- - eth -->
  <!-- - arb-one -->
  <!-- - solana -->
  <!-- - sui -->
  <!-- - bsc -->
  <!-- - poly -->
  <!-- - op -->
