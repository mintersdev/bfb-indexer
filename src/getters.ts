import { decodeKey } from "./cache";
import { decodeRecord } from "./decode/decode";
import { WORLD_ADDRESS } from "./config/config";
import { parseAddress } from "./decode/parse";
import { encodeTableName } from "./decode/store";
import { createClient } from "redis";

export function isStoreRecord(record: any): record is Store_Record & Meta {
    return record && typeof record === 'object' && '__blockNumber' in record && '__logIndex' in record;
}

const dailyQuestsTable = encodeTableName('DailyQuests')

const client = createClient({
    url: process.env.REDIS_URL || undefined,
})
client.connect()

client.on('error', (err) => {
    console.error('[redis]', err)
})

export async function getMapGroup(playerAddress: string): Promise<Update[]> {
    const address = parseAddress(playerAddress)
    if (!address) {
        console.error("Invalid address")
        return []
    }
    const mapgroup = await client.sMembers(`${WORLD_ADDRESS}:Map`)

    const multi = client.multi()

    for (const key of mapgroup) {
        multi.hGetAll(`${WORLD_ADDRESS}:${key}`)
    }
    multi.hGetAll(`${WORLD_ADDRESS}:${dailyQuestsTable}:${address}`)

    const result = await multi.exec() as (Store_Record & Meta | {})[]

    return parseDbLogs(result,
        mapgroup.concat([`${dailyQuestsTable}:${address}`]))
}

export async function getBattleGroup(battleId: number | bigint): Promise<Update[]> {
    const battleIdStr = BigInt(battleId).toString()
    const battleGroup = await client.sMembers(`${WORLD_ADDRESS}:Battle:${battleIdStr}`)


    const multi = client.multi()
    for (const key of battleGroup) {
        multi.hGetAll(`${WORLD_ADDRESS}:${key}`)
    }
    const result = await multi.exec() as (Store_Record & Meta | {})[]

    return parseDbLogs(result, battleGroup)
}

async function getSet(set: RedisSet, addKey?: string): Promise<Update[]> {
    let memberKey = `${WORLD_ADDRESS}:${set}`
    if (addKey) {
        memberKey = `${memberKey}:${addKey}`
    }

    const members = await client.sMembers(memberKey)

    const multi = client.multi()
    for (const key of members) {
        multi.hGetAll(`${WORLD_ADDRESS}:${key}`)
    }
    const result = await multi.exec() as (Store_Record & Meta | {})[]

    return parseDbLogs(result, members).filter((update) => update.new.battleState !== 3)
}

type QueryArgs = { playerAddress?: string | null, battleId?: number | bigint | string }

export async function getSets(sets: RedisSet[], args: QueryArgs):
    Promise<{ updates: Update[], errors: string[] }> {
    let updates: Update[] = []
    const errors: string[] = []

    for (const set of sets) {
        switch (set) {
            case "Map":
                if (!args.playerAddress) {
                    errors.push("Skipped Map. Missing player address for Map set")
                    continue
                }
                updates = updates.concat(await getMapGroup(args.playerAddress))
                break;
            case "Default": {
                const defaultUpdates = await getSet("Default")
                updates = updates.concat(defaultUpdates)
                break;
            }
            case "Battle":
                if (!args.battleId) {
                    errors.push("Skipped Battle. Missing battle id for Battle set")
                    continue
                }
                try {
                    const parsedBattleId = BigInt(args.battleId)
                    updates = updates.concat(await getBattleGroup(parsedBattleId))
                } catch (e) {
                    errors.push("Skipped Battle. Invalid battle id")
                    continue
                }
                break;
            case "Users": {
                if (!args.playerAddress) {
                    errors.push("Skipped Users. Missing player address for Users set")
                    continue
                }
                const address = parseAddress(args.playerAddress)
                if (!address) {
                    errors.push("Skipped Users. Invalid player address")
                    continue
                }
                const userUpdates = await getSet("Users", address)
                updates = updates.concat(userUpdates)
                break;
            }
            case "War": {
                const warUpdates = await getSet("War")
                updates = updates.concat(warUpdates)
                break;
            }
            case "Battles": {
                const battleUpdates = (await getSet("Battles")).filter(
                    (update) => update.new?.battleState !== 3)
                updates = updates.concat(battleUpdates)
                break;
            }
        }
    }
    return { updates, errors }
}

export function parseDbLogs(result: (Store_Record & Meta | {})[], keys: string[]) {
    const updates = result.map((record, i) => {
        if (!isStoreRecord(record)) {
            return null
        }
        const { table, keyTuple } = decodeKey(keys[i])
        const state = decodeRecord(table, keyTuple, record as any)
        return {
            table: state.tableName,
            new: state.data,
            old: null,
            __blockNumber: record.__blockNumber as string,
            __logIndex: Number(record.__logIndex)
        }
    })
    return updates.filter((item) => item !== null)
}
