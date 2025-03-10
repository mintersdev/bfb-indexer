import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config_url = process.env.COPY_CONFIG
if (!config_url) {
    throw new Error('COPY_CONFIG is required')
}

fetch(config_url).then(response => {
    return response.json()
}).then(data => {
    console.log(__dirname)
    const config_path = path.join(__dirname, '../contract.json')
    writeFileSync(config_path, JSON.stringify(data))
    console.log('config file has been written')
}).catch(err => {
    throw new Error(err)
})
