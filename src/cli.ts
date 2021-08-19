import {Command} from "commander";
import {generateDbType, Options} from "./genrateDbType";


const program = new Command();
program.version("0.0.1");

program
    .option('-U,--URL <database URL>', 'e.g -U 192.168.1.162:1521/dev')
    .option('-u,--user <user name>', 'e.g -u root')
    .option('-p,--password <user password>', 'e.g -p 123456')
    .option('-t,--type <user password>', 'e.g -t oracle')
    .option('-o,--out <out file>', 'e.g -o ./src/model.ts')
    .parse();
const opts: Options = program.opts();
console.log(opts);
try {
    if (!opts.URL) {
        throw new Error('option URL is null, e.g "-U 192.168.1.162:1521/dev"')
    }
    if (!opts.user) {
        throw new Error('option user is null, e.g "-u root"')
    }
    if (!opts.password) {
        throw new Error('option password is null, e.g "-p 123456"')
    }
    if (!opts.out) {
        throw new Error('option out is null, e.g "-o ./src/model.ts"')
    }
    generateDbType(opts);
} catch (e) {
    console.log(e.message);
}
