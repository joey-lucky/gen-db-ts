import {TableConfigItem} from "./database/database.type";

function parseToModelName (tableName:string):string{
    const newName = tableName.toLowerCase()
        .split("_")
        .map(item=>item.substring(0, 1).toUpperCase() + item.substring(1)).join("")
    return newName + "Model";
}

export function genColumn(item: TableConfigItem): string {
    const {columnName,comments,dataType} = item;
    const strArr = [];
    if (dataType === "number") {
        strArr.push(`    ${item.columnName}?: number; // ${item.comments}\n`);
    } else {
        strArr.push(`    ${item.columnName}?: string; // ${item.comments}\n`);
    }
    if (comments?.includes("关联") || item.columnName.endsWith("_ID")) {
        strArr.push(`    ${columnName}_DESC?: string; \n`)
    }
    return strArr.join("");
}

export function genClassStart(item: TableConfigItem) {
    const {tableName, tableComments} = item;
    const modelName = parseToModelName(tableName);
    const strArr = [];
    strArr.push(`// ${tableComments}\n`);
    strArr.push(`export class ${modelName} extends BaseModel {\n`);
    strArr.push(`    static tableName = "${tableName}";\n`);
    return strArr.join("")
}

export function genClassEnd(item: TableConfigItem) {
    return "}\n\n"
}
