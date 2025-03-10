import { mudTables } from '../config/config'
import { fieldParser, fieldTypeSizes } from './fieldSizes'
import nameMapping from './nameMapping'

const world = mudTables as { [key: string]: Table }

export function decodeTableId(id: Hex): { name: string, type: TbType | null } {
    const nameHexStr = id.slice(-32)
    const shortName = Buffer.from(nameHexStr, 'hex').toString('utf-8').replace(/\0/g, '')
    const name = nameMapping[shortName]

    const typeHexStr = id.slice(2, 34)
    const type = id.length == 66 ? Buffer.from(typeHexStr, 'hex').toString('utf-8').replace(/\0/g, '') as TbType : null

    if (name in world === false) {
        return { name: shortName, type }
        // throw new Error(`Table ID ${shortName} not found in world`)
    }
    return { name, type }
}

function isDynamicType(type: string): ColumnType {
    const isDynamic = type.includes('[') ||
        type === 'string' ||
        type === 'bytes' ||
        type === 'bool_array' ||
        type === 'address_array';

    if (isDynamic) {
        const match = [...type.matchAll(/(.*)\[([0-9]*)\]/g)][0]
        if (match) {
            return {
                isDynamic,
                baseType: match[1],
                length: parseInt(match[2])
            }
        }
        return {
            isDynamic,
            baseType: type
        }
    }
    return { isDynamic }
}

function parseSchema(tableName: keyof typeof world): Schema {
    const table = world[tableName]
    const schema = table.schema
    const staticFields = []
    const dynamicFields = []
    const keys: { key: string, type: keyof typeof fieldTypeSizes }[] = []
    // clear keys from schema
    for (const [key, value] of Object.entries(schema)) {
        const { isDynamic, baseType, length } = isDynamicType(value)
        const len = length || 0
        if (isDynamic) {
            dynamicFields.push({
                key,
                type: baseType as keyof typeof fieldTypeSizes,
                length: len
            })
        } else {
            staticFields.push({
                key,
                type: value as keyof typeof fieldTypeSizes
            })
            if (fieldTypeSizes[value] === undefined) {
                // if the field is unknown assume it's an enum of size 1 byte (uint8)
                fieldTypeSizes[value] = 1
                fieldParser[value] = fieldParser.uint8
            }
        }
    }
    for (const key of table.key) {
        const index = staticFields.findIndex((field) => field.key === key)
        if (index !== -1) {
            keys.push(staticFields[index])
            staticFields.splice(index, 1)
        } else {
            throw new Error(`Key ${key} not found in table ${table}`)
        }
    }


    return {
        staticFields,
        dynamicFields,
        keys,
        tableName,
    }
}

const schemaParser: { [key: keyof typeof world]: Schema } = {}
for (const key of Object.keys(world)) {
    schemaParser[key] = parseSchema(key as keyof typeof world)
}

const defaultSchemaValues: { [key: keyof typeof world]: Store_Record } = {}

export {
    schemaParser,
    defaultSchemaValues
}
