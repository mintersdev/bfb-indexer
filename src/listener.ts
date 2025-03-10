import { createPublicClient, decodeEventLog, webSocket, Log, PublicClient, Address } from "viem"
import erc20ABI from './config/ERC20.abi.json'
import { chain, WORLD_ADDRESS } from "./config/config"
import { Store_handleLog, storeKey } from "./decode/store"
import { save_block } from "./cache"
import { ignoreTables } from "./config/config"
import { dispatch } from "./dispatch"
import { sendToPlayerUpdate } from "./server/clients"
// import { addLogStats } from "./stats"
import { world_abi } from "./config/config"

export const erc20Address = process.env.ERC20_ADDRESS

console.log("contract address: ", WORLD_ADDRESS)
export const publicClient: PublicClient = createPublicClient({
    chain,
    // transport: http(process.env.INDEXER_RPC_URL)
    transport: webSocket(process.env.INDEXER_RPC_URL, {
        reconnect: {
            delay: 1000,
            attempts: 60,
        },
        retryCount: 60,
    })
})

export function isStoreEvent(log: Required<{ eventName: string }>): boolean {
    return log.eventName === "Store_SetRecord" ||
        log.eventName === "Store_DeleteRecord" ||
        log.eventName === "Store_SpliceStaticData" ||
        log.eventName === "Store_SpliceDynamicData";
}

const logsQueue: Log[] = []
let blockSync = BigInt(0)
export function setLockQueue(_lock: boolean) {
    console.log("lock: ", _lock)
    lock = _lock
}
let lock = true

export default async function multiflex() {
    publicClient.watchContractEvent({
        address: WORLD_ADDRESS as `0x${string}`,
        abi: world_abi,
        onLogs: (logs: Log[]) => {
            for (const log of logs) {
                logsQueue.push(log)
                // addLogStats(log)
                handleLog()
            }
        }
    })
    console.log("Listening to contract...")
}

let previusUpdateSend: Promise<void | void[]> | null = null

async function handleLog() {
    if (lock) {
        return
    }
    if (logsQueue.length === 0) {
        return
    }
    console.log("starting handeling logs")
    lock = true
    const logsQueueCopy = logsQueue.splice(0, logsQueue.length)
    const batch_len = logsQueueCopy.length
    const start_batch = performance.now()
    for (const log of logsQueueCopy) {
        const decodedLog = decodeEventLog({
            abi: world_abi,
            data: log.data,
            topics: log.topics
        }) as any
        const meta: Meta = {
            __blockNumber: log.blockNumber?.toString() as string,
            __logIndex: log.logIndex as number,
        }

        if (isStoreEvent(decodedLog)) {
            if (ignoreTables.includes(decodedLog.args.tableId.slice(-32))) {
                continue
            }
            const key = storeKey(decodedLog.args.tableId, decodedLog.args.keyTuple);
            // console.time(`store_handle_log ${decodedLog.args.keyTuple}`)
            const start = performance.now()
            const result = await Store_handleLog(decodedLog as Store_Event, meta, key)
            // console.timeEnd(`store_handle_log ${decodedLog.args.keyTuple}`)
            if (result) {
                const { recordStored, indexCreated, update } = result
                recordStored.then(() => {
                    const end = performance.now()
                    const diff = end - start
                    if (diff > 1) {
                        console.log(`Record stored in ${diff}ms ${update.table}`)
                    }
                })
                indexCreated.then(() => {
                    const end = performance.now()
                    const diff = end - start
                    if (diff > 1) {
                        console.log(`Index created in ${diff}ms ${update.table}`)
                    }
                })
                // console.time(`dispatch ${decodedLog.eventName}`)
                await Promise.all([recordStored, indexCreated])
                // console.timeEnd(`dispatch ${decodedLog.eventName}`)
                const updateSend = dispatch(update, previusUpdateSend, log.topics)
                updateSend.then(() => {
                    const end = performance.now()
                    const diff = end - start
                    if (diff > 1) {
                        console.log(`Dispatched in    ${diff}ms ${update.table}`)
                    }
                })
                previusUpdateSend = updateSend
            }
        }
        if (log.blockNumber && log.blockNumber > blockSync) {
            save_block(log.blockNumber)
            console.log("Saved block: ", log.blockNumber)
            blockSync = log.blockNumber
        }
    }
    const end_batch = performance.now()
    console.log(`Batch of ${batch_len} took: ${end_batch - start_batch}ms`)
    lock = false
    handleLog()
}

export async function ercListener() {
    if (!erc20Address) {
        console.error("[ERC20] ERROR: ERC20_ADDRESS not set")
        console.error("[ERC20] ERROR: NO ERC20 LISTENING")
        return
    }
    console.log("[ERC20] Listening to ERC20 at", erc20Address)
    publicClient.watchContractEvent({
        address: erc20Address as `0x${string}`,
        abi: erc20ABI,
        onLogs: (logs) => {
            for (const log of logs) {
                const decodedLog = decodeEventLog({
                    abi: erc20ABI,
                    data: log.data,
                    topics: log.topics
                }) as any
                const meta: Meta = {
                    __blockNumber: log.blockNumber?.toString() as string,
                    __logIndex: log.logIndex as number,
                }
                try {
                    if (decodedLog.eventName === "Transfer") {
                        if (!decodedLog.args) { continue }
                        const args = decodedLog.args as { _from: bigint, _to: Address, _value: Address }
                        const from = "0x" + BigInt(args._from).toString(16).padStart(40, '0')
                        const to = "0x" + BigInt(args._to).toString(16).padStart(40, '0')
                        const value = "0x" + BigInt(args._value).toString(16).padStart(64, '0')
                        const erc20Event: Update = {
                            table: "ERC20Transfer",
                            new: { from, to, value },
                            old: null,
                            ...meta
                        }
                        sendToPlayerUpdate(erc20Event, "from")
                        sendToPlayerUpdate(erc20Event, "to")
                    }
                }
                catch (e) {
                    console.error("[ERC20]", e)
                }

            }
        }
    })
    console.log(`Listening to ERC20 at ${erc20Address}`)
}

