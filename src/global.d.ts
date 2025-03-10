type Hex = `0x${string}`

type MudSchema = {
    [key: string]: string
}

type Table = {
    schema: MudSchema,
    key: string[]
    type?: "offchainTable"
}

type MudStore = {
    [key: string]: Table
}

type Store_Record = {
    staticData: Hex;
    encodedLengths: Hex;
    dynamicData: Hex;
    // __blockNumber: string;
    // __logIndex: number;
};

type DecodedRecord = {
    tableName: string,
    data: { [key: string]: any },
}

type Update = UpdateCore & Meta

type UpdateCore = {
    table: string,
    new: { [key: string]: any } | null,
    old: { [key: string]: any } | null,
}

type Store_SpliceStaticData = {
    eventName: "Store_SpliceStaticData",
    args: {
        tableId: Hex,
        keyTuple: Array<Hex>,
        start: number,
        data: Hex
    }
}

type Store_SetRecord = {
    eventName: "Store_SetRecord",
    args: {
        tableId: Hex,
        keyTuple: Array<Hex>,
        staticData: Hex,
        encodedLengths: Hex,
        dynamicData: Hex
    }
}

type Store_SpliceDynamicData = {
    eventName: "Store_SpliceDynamicData",
    args: {
        tableId: Hex,
        keyTuple: Array<Hex>,
        dynamicFieldIndex: number,
        start: number,
        deleteCount: number,
        encodedLengths: Hex,
        data: Hex
    }
}

type Store_DeleteRecord = {
    eventName: "Store_DeleteRecord",
    args: {
        tableId: Hex,
        keyTuple: Array<Hex>
    }
}

type Store_Event = Store_SpliceStaticData | Store_SetRecord | Store_SpliceDynamicData | Store_DeleteRecord

type DecodedLengths = {
    totalLength: number,
    fieldLengths: number[]
}

type ColumnType = {
    isDynamic: boolean,
    baseType?: keyof typeof FieldTypeSizes,
    length?: number
}

type Schema = {
    staticFields: { key: string, type: keyof typeof FieldTypeSizes }[],
    dynamicFields: { key: string, type: keyof typeof FieldTypeSizes, length?: number }[]
    keys: { key: string, type: keyof typeof FieldTypeSizes }[],
    tableName: string | number
}

type Meta = {
    __blockNumber: string,
    __logIndex: number,
}

type TbType = 'tbworld' | 'tbstore' | 'otworld' | 'tbmetadata' | 'tb' | 'tbuniqueEntity' | 'tbkeywval'

type RedisSet = "Map" | "Default" | "Users" | "Battle" | "War" | "Battles"

type ClientId = string

type ClientFilter = {
    address: string,
}

type SubGroup = RedisSet | `Battle:${number | string}`


type RedisReadTimeStats = {
    totalReads: number;
    totalReadTime: number;  // in milliseconds
    averageReadTime: number; // in milliseconds
    lastReadAt: number;     // timestamp
}

type RedisWriteStats = {
    totalWrites: number;
    totalWriteTime: number;  // in milliseconds
    averageWriteTime: number; // in milliseconds
    lastWriteAt: number;     // timestamp
}

type blockStat = {
    blockNumber: string;
    timestamp: number;
}

type LogStat = {
    timestampArrived: number | null;
    timestampSent: number | null;
    blockNumber: string;
}

