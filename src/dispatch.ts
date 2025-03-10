import { client } from "./cache";
import { sendToGroup, sendToPlayerUpdate } from "./server/clients";
import { WORLD_ADDRESS } from "./config/config";
// import { updateLogStats } from "./stats";
import {
    battle_table_idendifiers,
    componentToGroup,
    playerBasedTables,
} from "./config/tables";

const UnitToBattle: { [key: string]: number } = {};
async function getBattleIdByUnitId(unitId: number): Promise<number> {
    if (UnitToBattle[unitId]) {
        return UnitToBattle[unitId];
    } else {
        const battleId = await client.get(`${WORLD_ADDRESS}:index:UnitsBattle:${unitId}`)
        UnitToBattle[unitId] = battleId ? Number(battleId) : 0;
        return battleId ? Number(battleId) : 0;
    }
}

export async function dispatch(
    update: Update,
    previusUpdateSend: Promise<void | void[]> | null,
    topics: string[]
): Promise<void | void[]> {
    if (previusUpdateSend) {
        await previusUpdateSend;
    }

    const group = componentToGroup[update.table];
    if (!group) {
        return;
    }
    if (update.new === null && update.old === null) {
        return
    }

    let subsciptionGroup: null | SubGroup[] = null;

    switch (group) {
        case "Battle":
            subsciptionGroup = await handleBattleUpdate(update);
            break;
        case "Default":
            subsciptionGroup = ["Default"]
            break;
        case "Map":
            subsciptionGroup = handleMapUpdate(update);
            break;
        default:
            return;
    }
    if (!subsciptionGroup) return;

    const promises = []
    for (const sg of subsciptionGroup) {
        if (playerBasedTables.includes(update.table)) {
            const send = sendToPlayerUpdate(update)
            promises.push(send)
        } else {
            const send = sendToGroup(sg as SubGroup, update);
            promises.push(send)
        }
    }
    return Promise.all(promises) //.then(() => { updateLogStats(topics, update.__blockNumber, update.__logIndex) });
}

function handleMapUpdate(update: Update): SubGroup[] {
    if (update.table === "Battles") {

        const battleId = update.new?.id | update.old?.id;
        return [`Battle:${BigInt(battleId).toString()}`, `Map`];
    }
    return [`Map`];
}

async function handleBattleUpdate(update: Update): Promise<SubGroup[]> {
    let battleId: number
    let unitId: number

    if (update.table === "Units") {
        battleId = Number(update.new?.battleId || update.old?.battleId);
        unitId = Number(update.new?.id || update.old?.id);

        if (update.new?.battleId) {
            UnitToBattle[unitId] = battleId;
        } else {
            if (update.old?.battleId) {
                delete UnitToBattle[unitId];
            }
        }
        return [`Battle:${battleId}`];
    }

    const tbUnitId = battle_table_idendifiers[update.table];
    if (tbUnitId) {
        unitId = Number(update.new?.[tbUnitId] || update.old?.[tbUnitId]);
    }
    else {
        return []
    }

    battleId = await getBattleIdByUnitId(unitId);
    return battleId ? [`Battle:${battleId}`] : [];
}

