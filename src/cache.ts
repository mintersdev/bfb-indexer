import { createClient } from 'redis';
import { WORLD_ADDRESS } from './config/config';
import { isStoreRecord } from './getters';
// import { updateRedisReadStats, updateRedisWriteStats } from './stats';

export const client = createClient({
    url: process.env.REDIS_URL || undefined,
})

client.on('error', (err) => {
    console.error('[redis]', err)
})

export async function getStoreRecord(_key: string): Promise<Store_Record | null> {
    const key = `${WORLD_ADDRESS}:${_key}`
    // const startTime = performance.now();
    const record = await client.hGetAll(key)
    // const endTime = performance.now();
    // const readTimeMs = endTime - startTime;
    // updateRedisReadStats(readTimeMs);
    if (!isStoreRecord(record)) {
        return null
    }
    return record as Store_Record
}

export async function setStoreRecord(_key: string, record: Store_Record, meta: Meta): Promise<void> {
    const key = `${WORLD_ADDRESS}:${_key}`
    // const startTime = performance.now();
    await client.hSet(key, {
        ...record,
        ...meta
    })
    // const endTime = performance.now();
    // const writeTimeMs = endTime - startTime;
    // updateRedisWriteStats(writeTimeMs);
}

export async function deleteStoreRecord(_key: string): Promise<void> {
    const key = `${WORLD_ADDRESS}:${_key}`
    await client.del(key)
}

// save last synchronized block
export async function save_block(block: number | bigint) {
    await client.set(`${WORLD_ADDRESS}:config:block_number`, block.toString())
}

// get last synchronized block
export async function get_block(): Promise<bigint> {
    const block = await client.get(`${WORLD_ADDRESS}:config:block_number`)
    return block ? BigInt(block) : BigInt(0)
}

export const decodeKey = (key: string) => {
    const firstColon = key.indexOf(":")
    return {
        table: "0x" + "0".repeat(32) + key.slice(0, firstColon) as Hex,
        keyTuple: key.slice(firstColon + 1).split(":") as Hex[]
    }
}


