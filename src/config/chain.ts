const http: string = process.env.RPC_HTTP_URL || 'https://json-rpc.culinaris.initia.tech'
const ws: string = process.env.RPC_WS_URL || 'https://json-rpc.culinaris.initia.tech'
const chainId: number | string = process.env.CHAIN_ID || 2906125577721809
const blockExplorerUrl: string = process.env.BLOCK_EXPLORER_URL || 'https://scan.testnet.initia.xyz/culinaris-2'
const blockExplorerName: string = process.env.BLOCK_EXPLORER_NAME || 'minterscan'
const chainName: string = process.env.CHAIN_NAME || 'Culinaris'

export const defaultChainConfig = {
    id: Number(chainId),
    name: chainName,
    network: chainName,
    blockExplorers: {
        default: {
            name: blockExplorerName,
            url: blockExplorerUrl,
            apiUrl: blockExplorerUrl + '/api',
        },
    },
    nativeCurrency: {
        decimals: 18,
        name: 'BFB',
        symbol: 'BFB',
    },
    rpcUrls: {
        default: {
            http: [http],
            webSocket: [ws],
        },
    },
}
