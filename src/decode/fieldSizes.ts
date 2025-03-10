export const fieldTypeSizes: { [key: string]: number } = {
    uint8: 1,
    uint16: 2,
    uint24: 3,
    uint32: 4,
    uint40: 5,
    uint48: 6,
    uint56: 7,
    uint64: 8,
    uint72: 9,
    uint80: 10,
    uint88: 11,
    uint96: 12,
    uint104: 13,
    uint112: 14,
    uint120: 15,
    uint128: 16,
    uint136: 17,
    uint144: 18,
    uint152: 19,
    uint160: 20,
    uint168: 21,
    uint176: 22,
    uint184: 23,
    uint192: 24,
    uint200: 25,
    uint208: 26,
    uint216: 27,
    uint224: 28,
    uint232: 29,
    uint240: 30,
    uint248: 31,
    uint256: 32,
    int8: 1,
    int16: 2,
    int24: 3,
    int32: 4,
    int40: 5,
    int48: 6,
    int56: 7,
    int64: 8,
    int72: 9,
    int80: 10,
    int88: 11,
    int96: 12,
    int104: 13,
    int112: 14,
    int120: 15,
    int128: 16,
    int136: 17,
    int144: 18,
    int152: 19,
    int160: 20,
    int168: 21,
    int176: 22,
    int184: 23,
    int192: 24,
    int200: 25,
    int208: 26,
    int216: 27,
    int224: 28,
    int232: 29,
    int240: 30,
    int248: 31,
    int256: 32,
    bytes1: 1,
    bytes2: 2,
    bytes3: 3,
    bytes4: 4,
    bytes5: 5,
    bytes6: 6,
    bytes7: 7,
    bytes8: 8,
    bytes9: 9,
    bytes10: 10,
    bytes11: 11,
    bytes12: 12,
    bytes13: 13,
    bytes14: 14,
    bytes15: 15,
    bytes16: 16,
    bytes17: 17,
    bytes18: 18,
    bytes19: 19,
    bytes20: 20,
    bytes21: 21,
    bytes22: 22,
    bytes23: 23,
    bytes24: 24,
    bytes25: 25,
    bytes26: 26,
    bytes27: 27,
    bytes28: 28,
    bytes29: 29,
    bytes30: 30,
    bytes31: 31,
    bytes32: 32,
    bool: 1,
    address: 20,
    string: 1,
}

function convertNegative(buf: Buffer): number {
    if (buf[0] < 128) {
        return parseInt(buf.toString('hex'), 16)
    }

    // flip bits
    const converted = Buffer.from(
        Array.from(buf).map(x => ~x)
    );

    return -(parseInt(converted.toString('hex'), 16) + 1)
}

function store_parseInt(data: string): number {
    if (data.startsWith("0x")) {
        data = data.slice(2)
    }
    return convertNegative(Buffer.from(data, 'hex'))
    //return parseInt(data, 16)
}

function store_parseUInt(data: string): number {
    return parseInt(data, 16)
}

function store_parseHex(data: string): string {
    if (data.startsWith("0x")) {
        return data
    }
    return `0x${data}`
}

function store_parseBool(data: string): boolean {
    const number = parseInt(data)
    return !(number === 0)
}

function store_parseAddress(data: string): string {
    return `0x${data.slice(-40)}`
}

function store_parseSignedHex(data: string): string {
    if (data.startsWith("0x")) {
        return data
    }
    return `0x${data}`
}

function store_parseString(data: string): string {
    if (data.startsWith("0x")) {
        data = data.slice(2)
    }
    return Buffer.from(data, 'hex').toString('utf-8').replace(/\0/g, '')
}

export const fieldParser: { [key: string]: (data: string) => any } = {
    uint8: store_parseUInt,
    uint16: store_parseUInt,
    uint24: store_parseUInt,
    uint32: store_parseUInt,
    uint40: store_parseUInt,
    uint48: store_parseUInt,
    uint56: store_parseUInt,
    uint64: store_parseUInt,
    uint72: store_parseHex,
    uint80: store_parseHex,
    uint88: store_parseHex,
    uint96: store_parseHex,
    uint104: store_parseHex,
    uint112: store_parseHex,
    uint120: store_parseHex,
    uint128: store_parseHex,
    uint136: store_parseHex,
    uint144: store_parseHex,
    uint152: store_parseHex,
    uint160: store_parseHex,
    uint168: store_parseHex,
    uint176: store_parseHex,
    uint184: store_parseHex,
    uint192: store_parseHex,
    uint200: store_parseHex,
    uint208: store_parseHex,
    uint216: store_parseHex,
    uint224: store_parseHex,
    uint232: store_parseHex,
    uint240: store_parseHex,
    uint248: store_parseHex,
    uint256: store_parseHex,
    int8: store_parseInt,
    int16: store_parseInt,
    int24: store_parseInt,
    int32: store_parseInt,
    int40: store_parseInt,
    int48: store_parseInt,
    int56: store_parseInt,
    int64: store_parseInt,
    int72: store_parseSignedHex,
    int80: store_parseSignedHex,
    int88: store_parseSignedHex,
    int96: store_parseSignedHex,
    int104: store_parseSignedHex,
    int112: store_parseSignedHex,
    int120: store_parseSignedHex,
    int128: store_parseSignedHex,
    int136: store_parseSignedHex,
    int144: store_parseSignedHex,
    int152: store_parseSignedHex,
    int160: store_parseSignedHex,
    int168: store_parseSignedHex,
    int176: store_parseSignedHex,
    int184: store_parseSignedHex,
    int192: store_parseSignedHex,
    int200: store_parseSignedHex,
    int208: store_parseSignedHex,
    int216: store_parseSignedHex,
    int224: store_parseSignedHex,
    int232: store_parseSignedHex,
    int240: store_parseSignedHex,
    int248: store_parseSignedHex,
    int256: store_parseSignedHex,
    bytes1: store_parseHex,
    bytes2: store_parseHex,
    bytes3: store_parseHex,
    bytes4: store_parseHex,
    bytes5: store_parseHex,
    bytes6: store_parseHex,
    bytes7: store_parseHex,
    bytes8: store_parseHex,
    bytes9: store_parseHex,
    bytes10: store_parseHex,
    bytes11: store_parseHex,
    bytes12: store_parseHex,
    bytes13: store_parseHex,
    bytes14: store_parseHex,
    bytes15: store_parseHex,
    bytes16: store_parseHex,
    bytes17: store_parseHex,
    bytes18: store_parseHex,
    bytes19: store_parseHex,
    bytes20: store_parseHex,
    bytes21: store_parseHex,
    bytes22: store_parseHex,
    bytes23: store_parseHex,
    bytes24: store_parseHex,
    bytes25: store_parseHex,
    bytes26: store_parseHex,
    bytes27: store_parseHex,
    bytes28: store_parseHex,
    bytes29: store_parseHex,
    bytes30: store_parseHex,
    bytes31: store_parseHex,
    bytes32: store_parseHex,
    bool: store_parseBool,
    address: store_parseAddress,
    string: store_parseString,
}
