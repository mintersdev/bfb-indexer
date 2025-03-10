import { client } from "./cache";
import multiflex, { ercListener } from "./listener";
import { synchronize } from "./synchronize";
import './server/server'
// import { getChainStats } from "./stats";

async function main() {
    await client.connect()
    synchronize()
    multiflex()
    ercListener()
    // getChainStats();
}

async function tests() {
    // const map_group = await getMapGroup("0xd7ef7a894ce6dfe3587cff7b2d02742bd5f6d133")
    // console.log(map_group)
    // await printLogRemote("Players", ["0x000000000000000000000000d7ef7a894ce6dfe3587cff7b2d02742bd5f6d133"])
    // console.log(schemaParser["Players"])
    // getMapGroup({ playerAddress: "0x123" })
    // const battleUpdates = await getBattleGroup(41)
    // console.log(battleUpdates)
}

main()
