import { client } from "./cache"
import { WORLD_ADDRESS } from "./config/config"
import { parseAddress } from "./decode/parse";
import { assert } from "console";

export async function createIndex(update: UpdateCore, log: Store_Event, meta: Meta, key: string) {
    switch (update.table) {
        case "Units": {
            const unitId = update.new?.id || update.old?.id
            const battleId = BigInt(update.new?.battleId || update.old?.battleId).toString()
            if (update.new?.battleId) {
                await client.set(`${WORLD_ADDRESS}:index:UnitsBattle:${unitId}`, battleId)
                await client.sAdd(`${WORLD_ADDRESS}:Battle:${battleId}`, key)
            } else if (update.old?.battleId) {
                client.del(`${WORLD_ADDRESS}:index:UnitsBattle:${unitId}`)
                client.sRem(`${WORLD_ADDRESS}:Battle:${battleId}`, key)
            }

            break;
        }
        case "UnitsCombat":
        case "PomegranatePulverizer":
        case "PoisonedUnits":
            await addToBattleSet(update, key, "id")
            break;
        case "HealerTarget":
            addToBattleSet(update, key, "healer")
            break;
        case "Battles": {
            const battleId = BigInt(update.new?.id || update.old?.id).toString()
            if (update.new && update.new.battleState !== 3) {
                await client.sAdd(`${WORLD_ADDRESS}:Battle:${battleId}`, key)
                await client.sAdd(`${WORLD_ADDRESS}:Battles`, key)
            } else if (update.old) {
                client.sRem(`${WORLD_ADDRESS}:Battle:${battleId}`, key)
                client.sRem(`${WORLD_ADDRESS}:Battles`, key)
            }
            break;
        }
        case 'ReforgerUsed':
        case 'TeamLeft':
        case 'TeamRight':
        case 'Buildings':
        case 'Locations':
        case 'Siege':
        case 'QuestRequirements':
            await addToSet(update, key, "Map");
            break;
        case 'War':
        case 'WarConfig':
        case 'PlayerDonated':
            await addToSet(update, key, "Default");
            break;
        case 'Players':
        case 'Rewards':
        case 'PlayerQuestProgress':
        case 'DailyQuests':
        case 'RepeatingQuests':
        case 'FinalQuest':
        case 'DiscordNickname':
        case 'Quests': {
            // all these tables have player address as key
            const userAddress: string = update.new?.player || update.old?.player
            await addToUserSet(update, key, userAddress)
            break;
        }
        case 'QuestlineRewards': {
            const userAddress: string = update.new?.player || update.old?.player
            await addToUserSet(update, key, userAddress)
            break;
        }
        case 'CallToArms': {
            const userAddress: string = update.new?.captain || update.old?.captain
            await addToUserSet(update, key, userAddress)
            break;
        }
        case 'Army': { // captains[]
            const userAddresses: string[] = update.new?.captains || update.old?.captains
            const promises = []
            for (const userAddress of userAddresses) {
                promises.push(addToUserSet(update, key, userAddress))
            }
            await Promise.all(promises)
            break;
        }
        case 'WarStats':
            if (update.new) {
                await client.sAdd(`${WORLD_ADDRESS}:War`, key)
            } else {
                client.sRem(`${WORLD_ADDRESS}:War`, key)
            }
            break;
    }
}

async function addToBattleSet(update: UpdateCore, key: string, unitIdFiledName: string): Promise<void> {
    const newUnitId: string | undefined = update.new?.[unitIdFiledName]
    const oldUnitId: string | undefined = update.old?.[unitIdFiledName]

    const unitId = newUnitId || oldUnitId
    assert(unitId, "null update occured")

    const battleId = await client.get(`${WORLD_ADDRESS}:index:UnitsBattle:${unitId}`)
    if (!battleId) {
        // TODO: Probably can delete whole record here since unit is not in db
        // so chances are that it's not in battle
        return
    }

    if (!oldUnitId) {
        await client.sAdd(`${WORLD_ADDRESS}:Battle:${battleId}`, key)
    }
    if (!newUnitId) {
        client.sRem(`${WORLD_ADDRESS}:Battle:${battleId}`, key)
    }
}

async function addToSet(update: UpdateCore, key: string, set: RedisSet): Promise<void> {
    const redis_key = `${WORLD_ADDRESS}:${set}`
    if (update.new) {
        await client.sAdd(redis_key, key)
    } else {
        client.sRem(redis_key, key)
    }
}

async function addToUserSet(update: UpdateCore, key: string, userAddress: string): Promise<void> {
    const address = parseAddress(userAddress)
    if (update.new) {
        await client.sAdd(`${WORLD_ADDRESS}:Users:${address}`, key)
    } else {
        client.sRem(`${WORLD_ADDRESS}:Users:${address}`, key)
    }
}
