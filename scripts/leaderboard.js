import { createClient } from 'redis';
import { parseDbLogs } from '../build/getters.js';
import decode from "../build/decode.js"
// import pkg from '../build/getters.js';
// const { parseDbLogs} = pkg

const WORLD_ADDRESS = process.env.WORLD_ADDRESS

const client = createClient({
    url: process.env.REDIS_URL
})

export async function getLeaderboard() {
    await client.connect()

    let scanResult;
    const keys = new Set();

    scanResult = await client.scan(0,
        { MATCH: `${WORLD_ADDRESS}:506c61796572436f6e74726962757469:*` }
    );
    scanResult.keys.forEach(key => keys.add(key));

    while (scanResult.cursor != 0) {
        scanResult = await client.scan(scanResult.cursor, {
            MATCH: `${WORLD_ADDRESS}:506c61796572436f6e74726962757469:*`,
            COUNT: 100000000
        });
        scanResult.keys.forEach(key => keys.add(key));
    }

    let keysArray = Array.from(keys);
    const multi = client.multi();
    for (const key of keysArray) {
        multi.hGetAll(key, 'score');
    }
    const result = await multi.exec();
    keysArray = keysArray.map((key) => {
        return key.split(":").splice(1).join(":")
    });


    const updates = parseDbLogs(result, keysArray).map((update) => update.new)

    const players = {}
    updates.forEach((update) => {
        if (!players[update.player]) {
            players[update.player] = { contributions: [] }
        }
        players[update.player].contributions.push({
            warId: Number(update.warId),
            gold: BigInt(update.gold).toString(),
            unitsPlaced: update.unitsPlaced,
            unitsBought: update.unitsBought
        })
    })

    const addresses = Object.keys(players)
    const multi2 = client.multi();
    const keys2 = []
    for (let addr of addresses) {
        addr = '0x' + addr.slice(2).padStart(64, '0')
        const key = `${WORLD_ADDRESS}:506c6179657273000000000000000000:${addr}`
        multi2.hGetAll(key);
        keys2.push(key)
    }
    const addrToName = {}
    const response2 = await multi2.exec()
    response2.forEach((res, i) => {
        const key = keys2[i]
        const keys = key.split(':')
        const tableId = '0x' + keys[1].padStart(64, '0')
        const state = decode.decodeRecord(tableId, keys.slice(2), res)
        console.log(state)
        addrToName[state.data.player] = state.data.title
    })
    console.log(addrToName)

    client.disconnect();

    for (const addr of Object.keys(players)) {
        const contribs = players[addr].contributions
        const acc = { gold: BigInt(0), unitsPlaced: 0, unitsBought: 0 }
        const total = contribs.reduce((acc, curr) => {
            acc.gold += BigInt(curr.gold)
            acc.unitsPlaced += curr.unitsPlaced
            acc.unitsBought += curr.unitsBought
            return acc
        }, acc)
        players[addr] = {
            address: addr,
            title: addrToName[addr],
            ...players[addr],
            total: {
                ...total,
                gold: total.gold.toString()
            }
        }
    }

    const players_arr = Object.values(players)
    players_arr.sort((a, b) => {
        return Number(BigInt(b.total.gold) - BigInt(a.total.gold))
    })


    console.log("LOLOLOLOL")
    console.log(players_arr)
    return players_arr
}


getLeaderboard()
