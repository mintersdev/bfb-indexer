import { fieldParser, fieldTypeSizes } from './fieldSizes';
import { decodeTableId, schemaParser } from './schema';

// encodedLengths is a 32-byte value that contains the length in bytes of all the dynamic data fields
function decodeEncodedLengths(encodedLengths: Hex): DecodedLengths {
    const lengths = encodedLengths.slice(2)
    const lengthArray: number[] = []
    for (let i = 0; i < 50; i += 10) {
        lengthArray.push(parseInt(lengths.slice(i, i + 10), 16))
    }
    const totalLength = parseInt(lengths.slice(50), 16)
    return {
        totalLength,
        fieldLengths: lengthArray.reverse()
    }
}

function sliceDynamicData(data: Hex, decodeDynamicData: DecodedLengths): string[] {
    const dataStr = data.slice(2)
    let start = 0
    const dynamicData = decodeDynamicData.fieldLengths.map((length) => {
        const slice = dataStr.slice(start, start + length * 2)
        start += length * 2
        return slice
    })
    // remove unused columns empty data
    return dynamicData
}


function decodeDynamicData(record: Store_Record, schema: Schema) {
    const decodedLengths = decodeEncodedLengths(record.encodedLengths)
    const slicedDynamicData = sliceDynamicData(record.dynamicData, decodedLengths)
    const dynamicData: { [key: string]: any } = {}
    slicedDynamicData.map((data, i) => {
        if (i >= schema.dynamicFields.length) {
            return
        }
        try {
            const field = schema.dynamicFields[i]
            const baseType = field.type as string
            // const length = field.length
            const typeSize = fieldTypeSizes[baseType]
            let decodedData: any = []
            if (field.type === "string") {
                decodedData = fieldParser[baseType](data)
                dynamicData[field.key] = decodedData
            } else {
                for (let i = 0; i < data.length; i += typeSize * 2) {
                    const rawValue = data.slice(i, i + typeSize * 2)
                    const value = fieldParser[baseType](rawValue)
                    decodedData.push(value)
                }
                dynamicData[field.key] = decodedData
            }
        } catch (e) {
            console.log(JSON.stringify({ slicedDynamicData, i, data, record, schema }, null, 2))
            console.log("Error: ", e)
            throw e
        }
    })
    return dynamicData
}

function decodeKeys(keyTuple: Hex[], schema: Schema) {
    try {
        if (keyTuple.length === 0 || keyTuple[0] as string === "") {
            return {}
        }
        const keys: { [key: string]: any } = {}
        for (let i = 0; i < keyTuple.length; i++) {
            const key = schema.keys[i]
            const value = fieldParser[key.type as string](keyTuple[i])
            keys[key.key] = value
        }
        return keys
    } catch (e) {
        console.log(JSON.stringify({ keyTuple, schema }, null, 2))
        throw e
    }
}

function decodeStaticData(data: Hex, schema: Schema) {
    const sizes = schema.staticFields.map((field) => 2 * fieldTypeSizes[field.type as string])
    const dataStr = data.slice(2)
    const staticData: { [key: string]: any } = {}
    let size = 0

    for (let i = 0; i < sizes.length; i++) {
        try {
            const dataSlice = dataStr.slice(size, size + sizes[i])
            size += sizes[i]
            const field = schema.staticFields[i]
            const value = fieldParser[field.type as string](dataSlice)
            staticData[field.key] = value
        } catch (e) {
            console.log(JSON.stringify({ data, schema, sizes, dataStr, size, i }), null, 2)
            throw e
        }
    }
    return staticData
}

export function getDefaultTableValues(tableId: Hex): Store_Record {
    const { name: tableName } = decodeTableId(tableId)
    const schema = schemaParser[tableName]
    if (!schema) {
        return {
            staticData: "0x",
            encodedLengths: "0x",
            dynamicData: "0x"
        }
    }
    const staticData = schema.staticFields.map((field) => "".padEnd(fieldTypeSizes[field.type as string] * 2, "0")).join("")
    const lenSum = schema.dynamicFields.reduce((acc, field) => acc += fieldTypeSizes[field.type as string] * field.length!, 0)
    const encodedLengths = schema.dynamicFields.map(
        (field) => (fieldTypeSizes[field.type as string] * field.length!).toString(16).padStart(10, "0"))
        .reverse().join("").concat(lenSum.toString(16).padStart(14, "0"))
    const dynamicData = "".padEnd(lenSum * 2, "0")

    return {
        staticData: `0x${staticData}`,
        encodedLengths: `0x${encodedLengths}`,
        dynamicData: `0x${dynamicData}`
    }
}

export function decodeRecord(tableId: Hex, keyTuple: Hex[], record: Store_Record): DecodedRecord {
    const { name: tableName, type } = decodeTableId(tableId)
    if (!record) {
        throw new Error(`Record not found for table ${tableName} and key ${keyTuple}`)
    }

    const schema = schemaParser[tableName]
    if (!schema) {
        return {
            tableName,
            data: {
                keyTuple,
                ...record,
            }
        }
    }

    try {
        const decodedDynamicData = decodeDynamicData(record, schema)
        const decodedKeys = decodeKeys(keyTuple, schema)
        const decodedStaticData = decodeStaticData(record.staticData, schema)

        return {
            tableName,
            data: {
                ...decodedKeys,
                ...decodedStaticData,
                ...decodedDynamicData,
            }
        }
    } catch (e) {
        console.log(JSON.stringify({ tableId, keyTuple, record }, null, 2))
        throw e
    }
}
