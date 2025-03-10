import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

if (argv.table || argv.t) {
    const table = argv.table || argv.t;
    const encoded = Buffer.from(table).toString('hex').slice(0,32).padEnd(32, "0")
    console.log(encoded);
}
