import { mudTables } from '../config/config'
const world = mudTables as { [key: string]: Table }

const nameMapping: { [key: string]: string } = {}

for (const name of Object.keys(world)) {
    nameMapping[name.slice(0, 16)] = name
}


export default nameMapping;
