import { readFileSync } from 'fs';
import { Abi, Chain } from 'viem';
import IWorldABI from './defaultIWorld.abi.json'
import tables from './defaultMudTables'
import { defineChain } from "viem";
import { defaultChainConfig } from './chain';
import path from 'path';

export const ignoreTables = [
    '52696768745175657565000000000000',  // RightQueue
    '4c656674517565756500000000000000',  // LeftQueue
    '4b657973496e5461626c650000000000'
]

export const groups = {
    always: [
        "War",
        "WarConfig",
        "PlayerDonated",
        "Army",
    ],

    map: [
        "ReforgerUsed",
        "TeamLeft",
        "TeamRight",
        "Buildings",
        "Locations",
        "Siege",
        "QuestRequirements",
    ],
}

let config: {
    abi?: Abi,
    world?: { [key: string]: { address: string, blockNumber: number } },
    chain_config?: any,
    tables?: MudStore,
} | null = null

const config_path = path.join(__dirname, '../../contract.json')
try {
    config = JSON.parse(readFileSync(config_path, 'utf-8'));
    console.log(config?.world)
} catch (e) {
    console.log(`Couldn't load config from ${config_path}, using default values`);
}

export const world_abi = config?.abi || IWorldABI
export const mudTables = config?.tables || tables
const chain_config = config?.chain_config || defaultChainConfig
export const chain = defineChain(chain_config) as Chain
export const WORLD_ADDRESS = config?.world?.[chain.id.toString()].address || process.env.WORLD_ADDRESS
if (!WORLD_ADDRESS) {
    throw new Error("WORLD_ADDRESS is required (env or in config link)")
}
