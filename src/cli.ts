import {Command} from "commander";
import {generateDbType, Options} from "./genrateDbType";


const program = new Command();
program.version("0.0.1");


const optionHelpInfo:any = {
    URL: "e.g -U 192.168.1.162:1521/dev",
    user: "e.g -u root",
    password: "e.g -p 123456",
    type: "e.g -t oracle",
    out: "e.g -o ./src/model.ts",
};

const defOptions:any = {
    type: "oracle",
    out: "./src/model.ts",
}

program
    .option('-U,--URL <database URL>', optionHelpInfo.URL)
    .option('-u,--user <user name>', optionHelpInfo.user)
    .option('-p,--password <user password>', optionHelpInfo.password)
    .option('-t,--type <user password>', optionHelpInfo.type)
    .option('-o,--out <out file>', optionHelpInfo.out);
program.parse(process.argv);
const opts: any = program.opts();
for (const key of Object.keys(optionHelpInfo)) { // 校验数据
    let helpInfo = optionHelpInfo[key];
    let value = opts[key] || defOptions[key];
    opts[key] = value;
    // @ts-ignore
    if (!value) {
        throw new Error(`option ${key} is null, e.g "${helpInfo}"`);
    }
}

generateDbType(opts).catch(e=>console.error(e));
