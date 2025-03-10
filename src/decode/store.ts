import { createIndex } from "../index_db";
import { deleteStoreRecord, getStoreRecord, setStoreRecord } from "../cache";
import { decodeRecord, getDefaultTableValues } from "./decode";

// export const store = new Map<string, Store_Record>();

export function encodeTableName(tableName: string): string {
    // cut to max 16 chars
    const shorten = tableName.slice(0, 16);
    return Buffer.from(shorten).toString("hex").padEnd(32, "0")
}

export function storeKey(tableId: Hex, keyTuple: Hex[]): string {
    const tableKey = tableId.slice(-32)
    return `${tableKey}:${keyTuple.join(":")}`;
}

function bytesSplice(data: Hex, start: number, deleteCount = 0, newData: Hex = "0x"): Hex {
    const dataStr = data.slice(2);
    const newDataStr = newData.slice(2);
    return `0x${dataStr.slice(0, start * 2)}${newDataStr}${dataStr.slice(start * 2 + deleteCount * 2)}`;
}

function bytesLength(data: Hex): number {
    return data.replace(/^0x/, "").length / 2;
}

export async function Store_handleLog(log: Store_Event, meta: Meta, key: string): Promise<{
    recordStored: Promise<void>,
    indexCreated: Promise<void>,
    update: Update
} | null> {
    let result: {
        update: UpdateCore,
        recordStored: Promise<void>
    } = {
        update: {
            table: "",
            new: null,
            old: null
        },
        recordStored: Promise.resolve()
    }
    let indexCreated: Promise<void> = Promise.resolve();
    switch (log.eventName) {
        case "Store_SetRecord":
            result = await store_SetRecord(log as Store_SetRecord, meta, key);
            break;
        case "Store_DeleteRecord": {
            result = await store_DeleteRecord(log as Store_DeleteRecord, key);
            break;
        }
        case "Store_SpliceStaticData":
            result = await store_SpliceStaticData(log as Store_SpliceStaticData, meta, key);
            break;
        case "Store_SpliceDynamicData":
            result = await store_SpliceDynamicData(log as Store_SpliceDynamicData, meta, key);
            break;
        default:
    }
    try {
        if (result.update.new || result.update.old) {
            indexCreated = createIndex(result.update, log, meta, key);
        }
        else {
            return null
        }
    } catch (e) {
        console.log(JSON.stringify({ update: result.update, log, meta, key }, null, 2))
        throw e
    }

    return {
        recordStored: result.recordStored,
        indexCreated,
        update: { ...result.update, ...meta }
    }
}

async function store_SetRecord(log: Store_SetRecord, meta: Meta, key: string): Promise<{ update: UpdateCore, recordStored: Promise<void> }> {
    const oldRecord = await getStoreRecord(key);
    let oldState: DecodedRecord | null = null;
    if (oldRecord) {
        oldState = decodeRecord(log.args.tableId, log.args.keyTuple, oldRecord);
    }
    const newState = decodeRecord(log.args.tableId, log.args.keyTuple, log.args);
    const recordStored = setStoreRecord(key, {
        staticData: log.args.staticData,
        encodedLengths: log.args.encodedLengths,
        dynamicData: log.args.dynamicData,
    }, meta);

    return {
        update: {
            table: newState.tableName,
            new: newState.data,
            old: oldState?.data || null
        },
        recordStored
    }
}

async function store_DeleteRecord(log: Store_DeleteRecord, key: string): Promise<{ update: UpdateCore, recordStored: Promise<void> }> {
    // const oldRecord = store.get(key);
    const oldRecord = await getStoreRecord(key);
    if (!oldRecord) {
        return {
            update: {
                table: "",
                new: null,
                old: null
            },
            recordStored: Promise.resolve()
        }
    }
    const oldState = decodeRecord(log.args.tableId, log.args.keyTuple, oldRecord);
    // store.delete(key);
    deleteStoreRecord(key);
    return {
        update: {
            table: oldState.tableName,
            new: null,
            old: oldState.data
        },
        recordStored: Promise.resolve()
    }
}

async function store_SpliceStaticData(log: Store_SpliceStaticData, meta: Meta, key: string): Promise<{ update: UpdateCore, recordStored: Promise<void> }> {
    // const record = store.get(key) ?? getDefaultTableValues(log.args.tableId);
    // const oldRecord = store.get(key);
    const oldRecord = await getStoreRecord(key);
    let oldState: DecodedRecord | null = null;
    if (oldRecord) {
        oldState = decodeRecord(log.args.tableId, log.args.keyTuple, oldRecord);
    }
    // console.log(oldRecord, log, meta)
    const record = oldRecord ?? getDefaultTableValues(log.args.tableId);
    const newRecord = {
        staticData: bytesSplice(record.staticData, log.args.start, bytesLength(log.args.data), log.args.data),
        encodedLengths: record.encodedLengths,
        dynamicData: record.dynamicData,
    }
    const newState = decodeRecord(log.args.tableId, log.args.keyTuple, newRecord);
    // store.set(key, newRecord);
    const recordStored = setStoreRecord(key, newRecord, meta);

    return {
        update: {
            table: newState.tableName,
            new: newState.data,
            old: oldState?.data || null
        },
        recordStored
    }
}

async function store_SpliceDynamicData(log: Store_SpliceDynamicData, meta: Meta, key: string): Promise<{ update: UpdateCore, recordStored: Promise<void> }> {
    const oldRecord = await getStoreRecord(key);
    let oldState: DecodedRecord | null = null;
    if (oldRecord) {
        oldState = decodeRecord(log.args.tableId, log.args.keyTuple, oldRecord);
    }
    // console.log(oldRecord, log, meta)
    const record = oldRecord ?? getDefaultTableValues(log.args.tableId);
    const newRecord = {
        staticData: record.staticData,
        encodedLengths: log.args.encodedLengths,
        dynamicData: bytesSplice(record.dynamicData, log.args.start, log.args.deleteCount, log.args.data),
    }
    const newState = decodeRecord(log.args.tableId, log.args.keyTuple, newRecord);
    const recordStored = setStoreRecord(key, newRecord, meta);

    return {
        update: {
            table: newState.tableName,
            new: newState.data,
            old: oldState?.data || null
        },
        recordStored
    }
}

export async function printLogRemote(table: string, keyTuple: string[]): Promise<void> {
    const tableId = encodeTableName(table);
    const key = storeKey(tableId as Hex, keyTuple as Hex[]);
    const record = await getStoreRecord(key) as Store_Record & Meta;
    console.log("key", key)
    if (!record) {
        console.log("Log Remote: NIMO ", key);
        return;
    }
    const decoded = decodeRecord(tableId as Hex, keyTuple as Hex[], record);
    console.log("Log Remote: ", {
        ...decoded,
        __blockNumber: record.__blockNumber,
        __logIndex: record.__logIndex
    });
}
