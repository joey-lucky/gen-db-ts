import {writeFileSync} from "./utils/fileUtils";
import {getTableConfigData} from "./database";
import {genClassEnd, genClassStart, genColumn} from "./genTs";

export type Options = {
    URL: string;
    user: string;
    password: string,
    out: string;
    type: any;
};

export async function generateDbType(opt: Options) {
    let data = await getTableConfigData(opt.type, opt);
    let fileText = "import {BaseModel} from \"./BaseModel\";\n\n";
    let preTableName = "";
    for (let item of data) {
        if (preTableName !== item.tableName) {
            if (!!preTableName) {
                fileText += genClassEnd(item);
            }
            fileText += genClassStart(item);
            preTableName = item.tableName;
        }
        fileText += genColumn(item);
    }
    fileText += genClassEnd(data[data.length - 1]);
    writeFileSync(opt.out, fileText);
}