import { publicClient } from "./listener";
// import { Log } from "viem";
// 
// const readStats: RedisReadTimeStats = {
//     totalReads: 0,
//     totalReadTime: 0,
//     averageReadTime: 0,
//     lastReadAt: Date.now()
// }
// 
// const writeStats: RedisWriteStats = {
//     totalWrites: 0,
//     totalWriteTime: 0,
//     averageWriteTime: 0,
//     lastWriteAt: Date.now()
// }
// 
// const blockStats: { [key: string]: string } = {}
// const logStats: { [key: string]: LogStat } = {}
// 
// export function getStats() {
//     return {
//         blockStats,
//         // readStats,
//         // writeStats,
//         // logStats,
//     }
// }
// 
// export async function updateRedisReadStats(readTimeMs: number): Promise<void> {
//     readStats.totalReads++;
//     readStats.totalReadTime += readTimeMs;
//     readStats.averageReadTime = readStats.totalReadTime / readStats.totalReads;
//     readStats.lastReadAt = Date.now();
// }
// 
// export async function updateRedisWriteStats(writeTimeMs: number): Promise<void> {
//     writeStats.totalWrites++;
//     writeStats.totalWriteTime += writeTimeMs;
//     writeStats.averageWriteTime = writeStats.totalWriteTime / writeStats.totalWrites;
//     writeStats.lastWriteAt = Date.now();
// }
// 
export async function getChainStats() {
    publicClient.watchBlockNumber({
        onBlockNumber: (blockNumber: bigint) => {
            // blockStats[blockNumber.toString()] = Date.now().toString()
            // console.log("arrived blockNumber: ", blockNumber.toString())
        }
    });
}
// 
// 
// let logStatCounter = 0
// export async function addLogStats(log: Log) {
//     const now = performance.now()
//     const key = `${log.topics.join(",")}:${log.blockNumber}:${log.logIndex}`
//     logStats[key] = {
//         timestampArrived: now,
//         timestampSent: null,
//         blockNumber: '0'
//     }
//     logStatCounter++;
//     if (logStatCounter > 1000) {
//         logStatCounter = 0
//         const keys = Object.keys(logStats)
//         for (const key of keys) {
//             delete logStats[key]
//         }
//     }
// }
// 
// export async function updateLogStats(topics: string[], blockNumber: string, logIndex: number) {
//     const now = performance.now()
//     const key = `${topics.join(",")}:${blockNumber}:${logIndex}`
//     if (logStats[key]) {
//         logStats[key].timestampSent = now
//     }
// }
