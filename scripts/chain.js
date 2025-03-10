import { defineChain, createPublicClient, webSocket } from "viem";

export const WORLD_ADDRESS = process.env.WORLD_ADDRESS

export const chain = defineChain({
    id: Number(2906125577721809),
    name: "BFB",
    network: "BFB",
    nativeCurrency: {
        decimals: 18,
        name: 'BFB',
        symbol: 'BFB',
    },
    rpcUrls: {
        default: {
            http: ["https://json-rpc.culinaris.initia.tech"],
            webSocket: ["wss://json-rpc-websocket.culinaris.initia.tech"],
        },
    },
})

export const publicClient = createPublicClient({
    chain: chain,
    transport: webSocket(process.env.INDEXER_RPC_URL)
})
