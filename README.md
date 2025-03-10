## INFO

This indexer stores most recent data in raw MUD format.
If you need to query the data you need to make a custom indexes which would require reindexing the whole contract or use exising ones.
indexing happens in [index_db.ts](./src/index_db.ts)

Incoming events are stored, decoded, indexed and then distributed
to the clients via websocket.

Distribution is done in [dispatch.ts](./src/dispatch.ts) in dispatch function.
You can safely delete all the logic inside this funciton and replace it with your own if you dont rely on the subscribe/unsubscribe api. This function gets only incoming events and is not called during initial indexing.

To get table update schema, look at tables in contract.json 
Table and field names are the same as in this file.
Any field type that is bigger than 64 bits onchain is represended as hex string.


## Usage

first copy config file (contract.json) to root directory
this file contains:
- the world info including address and deploy block number
- ABI
- chain congifuration with rpc url
- MUD table configuration

if any of those values are missing the app will try to use default values (see [config.ts](./src/config/config.ts))


```bash
pnpm install
pnpm build
REDIS_URL="url" pnpm start
```

## WS API
### get
Made to get current state of the world. It returns the most recent data from the contract in MUD format. That's what the front uses at the entrance of the game


```json
"body": {
    "type": "get",
    "group": ["Map", "Default", "Battle", "Users", "War", "Battles"], // group names for grouping records (array of strings) listed all possible
    "address": "0x1234", // optional player address for User specific records (hex string) required in "Users" group
    "battleId": 1, // optional battle id for Battle specific records (number) required in "Battle" group
}
```

You can see which tables are indexed in each group in [index_db.ts](./src/index_db.ts)
If you need custom indexing thats the place to start.
Each group has it's own set in redis.

### subscribe
subscribes to the updates. You can subscribe to multiple groups at once. To see the tables in each group check groupToComponents mapping in [tables.ts](./src/config/tables.ts)  
they are slightly different from the ones in index_db.ts
request is basically the same as get

```json
"body": {
    "type": "subscribe",
    ...
}
```

### unsubscribe
Unsubscribes from the updates. You can unsubscribe from multiple groups at once.

```json
"body": {
    "type": "unsubscribe",
    ...
}
```

### setaddress

Sets the address of the player for subscribe and get requests. If you set it at the beginning of the session you don't have to set address field in future requests.


## Scripts

there is a handy script that allows you to fetch and decode table data from db.
No filters unfortunately, but you can always use jq to filter the data.
You have to build the project first since it relies on MUD table config from contract.json to properly decode data. Eg:

```bash
REDIS_URL="url" WORLD_ADDRESS="0xabcd" pnpm getLogs --table QuestlineRewards -o rewards.json
```
