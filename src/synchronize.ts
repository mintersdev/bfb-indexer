import { decodeEventLog } from 'viem';
import { isStoreEvent, publicClient, setLockQueue} from "./listener";
import { Store_handleLog, storeKey } from './decode/store';
import { get_block, save_block } from './cache';
import { world_abi, ignoreTables, WORLD_ADDRESS } from './config/config';

export async function synchronize() {
    // const currentBlock = publicClient.getBlockNumber()
    let logCount = 0

    getWorldCreationBlock()
    const savedBlock = await get_block()
    const startBlock: bigint = savedBlock ? savedBlock : await getWorldCreationBlock()

    console.log("savedBlock: ", savedBlock, "startBlock: ", startBlock)

    const lastBlock = await publicClient.getBlockNumber()
    const fromBlock = startBlock
    const toBlock = lastBlock

    const batchSize = BigInt(1000)
    let curr_block = fromBlock
    let promise = Promise.resolve()
    console.time("sync")
    for (let i = fromBlock; i < lastBlock; i += batchSize) {
        console.log("Fetching logs from block: ", i)
        const logs = await publicClient.getContractEvents({
            address: WORLD_ADDRESS as `0x${string}`,
            abi: world_abi,
            fromBlock: BigInt(i),
            toBlock: BigInt(i) + batchSize - BigInt(1)
            // fromBlock: BigInt(87710),
            // toBlock: BigInt(87710)
        })
        await promise
        promise = new Promise(async (resolve, reject) => {
            for (const log of logs) {
                const decodedLog = decodeEventLog({
                    abi: world_abi,
                    data: log.data,
                    topics: log.topics
                }) as any
                const meta = {
                    __blockNumber: log.blockNumber?.toString(),
                    __logIndex: log.logIndex as number,
                }

                if (ignoreTables.includes(decodedLog.args.tableId)) {
                    continue
                }

                if (isStoreEvent(decodedLog)) {
                    const key = storeKey(decodedLog.args.tableId, decodedLog.args.keyTuple);
                    await Store_handleLog(decodedLog as Store_Event, meta, key)
                    logCount++
                    if (BigInt(meta.__blockNumber) > curr_block) {
                        curr_block = BigInt(log.blockNumber)
                        console.log("Saving block: ", log.blockNumber)
                        await save_block(log.blockNumber)
                    }
                }
            }
            resolve()
        })
    }
    await promise
    await save_block(lastBlock)
    console.timeEnd("sync")
    console.log("Synchronized to block: ", lastBlock)
    console.log("block delta", lastBlock - startBlock)
    console.log("log count", logCount)
    setLockQueue(false)
}

async function getWorldCreationBlock() {
    const logs = await publicClient.getContractEvents({
        address: WORLD_ADDRESS as `0x${string}`,
        abi: world_abi,
        eventName: "HelloStore",
        fromBlock: BigInt(0),
        toBlock: 'latest'
    })

    if (!logs.length) {
        throw new Error(`HelloStore event not found on address ${WORLD_ADDRESS}`)
    }

    return logs[0].blockNumber
}
