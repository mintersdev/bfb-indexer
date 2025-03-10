import { createClient } from "redis";
import { publicClient, WORLD_ADDRESS } from './chain.js'
import minimist from 'minimist'
import { abi } from './IWorldAbi.js'
import decode from "../build/decode/decode.js"
import { writeFileSync } from "node:fs";
import { decodeEventLog } from "viem";

const argv = minimist(process.argv.slice(2))

if (argv.help || argv.h || Object.keys(argv).length === 1) {
    console.log(`
Usage: node getLogs.js [options]
Usage: pnpm getLogs [options]

Options:
--blockNumber, -b <blockNumber>  Get logs for a specific block number
    --decode                     Decode logs
    --raw                        Output raw logs
--key <key>                      Get record from redis by key
--table <tableName>              Get records from redis by table name
--output, -o <output>            Output to file
--world, -w <worldAddress>       World contract address
--redis, -r <redisUrl>           Redis url
--env <envName>                  Environment variable name (initia, upgrade, prod)
`)
    process.exit(0)
}

let _WORLD_ADDRESS = argv.world || argv.w || WORLD_ADDRESS
let REDIS_URL = argv.redis || argv.r || process.env.REDIS_URL

if (argv.env) {
    const env = argv.env.toUpperCase()
    console.log(`Using ${env} environment`)
    _WORLD_ADDRESS = process.env[`${env}_WORLD_ADDRESS`] || _WORLD_ADDRESS
    REDIS_URL = process.env[`${env}_REDIS_URL`] || REDIS_URL
}

if (argv.blockNumber || argv.b) {
    const blockNumber = argv.blockNumber || argv.b
    getUpdatesByBlockNumber(Number(blockNumber)).then((logs) => {
        if (!argv.raw) {
            logs = logs.map((log) => {
                try {
                    const decoded = decodeEventLog({
                        abi,
                        data: log.data,
                        topics: log.topics,
                    })
                    return decoded
                } catch (e) {
                    return log
                }
            })
            if (argv.decode) {
                console.log("\n\n \x1b[31mDecoded values are not complete and represent only changes \x1b[0m \n\n")
                logs = logs.map((log) => {
                    let state = decode.getDefaultTableValues(log.args.tableId)
                    if (log.eventName === 'Store_SpliceStaticData') {
                        state = {
                            staticData: bytesSplice(state.staticData, log.args.start, bytesLength(log.args.data), log.args.data),
                            encodedLengths: state.encodedLengths,
                            dynamicData: state.dynamicData,
                        }
                    } else if (log.eventName === 'Store_SpliceDynamicData') {
                        state = {
                            staticData: state.staticData,
                            encodedLengths: state.encodedLengths,
                            dynamicData: bytesSplice(state.dynamicData, log.args.start, log.args.deleteCount, log.args.data),
                        }
                    } else if (log.eventName === 'Store_SetRecord') {
                        state = {
                            staticData: log.args.staticData,
                            encodedLengths: log.args.encodedLengths,
                            dynamicData: log.args.dynamicData
                        }
                    }
                    const decoded = decode.decodeRecord(log.args.tableId, log.args.keyTuple, state)
                    if (log.eventName === 'Store_DeleteRecord') {
                        decoded.deleted = true
                    }
                    return decoded
                })

            }
        }
        console.log(logs)
        if (argv.decode) {
            console.log("\n\n \x1b[31mDecoded values are not complete and represent only changes \x1b[0m \n\n")
        }
        if (argv.output || argv.o) {
            const output = argv.output || argv.o
            writeFileSync(output, JSON.stringify(logs, null, 2))
        }
        process.exit(0)
    })
} else if (argv.key) {
    const key = argv.key
    getRedisRecord(key).then((record) => {
        console.log(record)
        if (argv.output || argv.o) {
            const output = argv.output || argv.o
            writeFileSync(output, JSON.stringify(record, null, 2))
        }
    })
}
else if (argv.table) {

    const encodedTable = Buffer.from(argv.table.slice(0, 16)).toString('hex').slice(0, 32).padEnd(32, "0")
    const key = `${_WORLD_ADDRESS.toLowerCase()}:${encodedTable}:*`
    getRedisRecord(key).then((record) => {
        console.log(record)
        if (argv.output || argv.o) {
            const output = argv.output || argv.o
            writeFileSync(output, JSON.stringify(record, null, 2))
        }
    })
}


async function getUpdatesByBlockNumber(blockNumber) {
    const logs = await publicClient.getContractEvents({
        address: _WORLD_ADDRESS,
        abi,
        fromBlock: BigInt(blockNumber),
        toBlock: BigInt(blockNumber)
    })
    return logs
}

async function getRedisRecord(key) {
    const client = createClient({
        url: REDIS_URL
    })
    await client.connect()

    let scanResult;
    const keys = new Set();
    scanResult = await client.scan(0,
        { MATCH: key }
    );
    scanResult.keys.forEach(key => keys.add(key));

    while (scanResult.cursor != 0) {
        scanResult = await client.scan(scanResult.cursor, {
            MATCH: key,
            COUNT: 1000000
        });
        scanResult.keys.forEach(key => keys.add(key));
    }

    const keysArray = Array.from(keys);
    const multi = client.multi();
    for (const key of keysArray) {
        multi.hGetAll(key);
    }
    const result = await multi.exec();
    client.disconnect()

    const state = result.map((res, i) => {
        const key = keysArray[i]
        const keys = key.split(':')
        const tableId = '0x' + keys[1].padStart(64, '0')
        try {
            return decode.decodeRecord(tableId, keys.slice(2), res)
        } catch (e) {
            console.log(e)
            return res
        }
    })
    return state
}

function bytesSplice(data, start, deleteCount = 0, newData = "0x") {
    const dataStr = data.slice(2);
    const newDataStr = newData.slice(2);
    return `0x${dataStr.slice(0, start * 2)}${newDataStr}${dataStr.slice(start * 2 + deleteCount * 2)}`;
}

function bytesLength(data) {
    return data.replace(/^0x/, "").length / 2;
}
