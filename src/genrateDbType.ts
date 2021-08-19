import {getConnection} from "oracledb";
import fs from "fs";
import path from "path";

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);
export type Options = { URL: string; user: string; password: string, out: string };
type Item = { TABLE_NAME: string; TABLE_COMMENTS: string; COLUMN_NAME: string; DATA_TYPE: string; COMMENTS: string; }

function startInterface(tableName: string, tableComments: string) {
    let modelName = "";
    for (const s of tableName.toLowerCase().split("_")) {
        modelName += s.substring(0, 1).toUpperCase() + s.substring(1);
    }
    modelName += "Model";
    return `// ${tableComments}
export class ${tableName} extends BaseModel {
    static tableName = "${tableName}";
`;
}

const END_OF_DESC_LIST = ["_ID"]

function addColumn(columnName: string, dataType: string, comments: string) {
    let res: string;
    if (dataType === "NUMBER") {
        res = `    ${columnName}?: number; // ${comments}\n`;
    } else {
        res = `    ${columnName}?: string; // ${comments}\n`;
    }
    let needDesc = comments && comments.includes("关联");
    for (const s of END_OF_DESC_LIST) {
        if (columnName.endsWith(s)) {
            needDesc = true;
        }
    }
    if (needDesc) {
        res += `    ${columnName}_DESC?: string; \n`;
    }
    return res;
}

export function generateDbType(opt: Options) {
    const config = {
        user: opt.user,　　//用户名
        password: opt.password,　　//密码
        //IP:数据库IP地址，PORT:数据库端口，SCHEMA:数据库名称
        connectString: opt.URL
    };
    getConnection(config).then((conn) => {
        const sql = "select t.table_name, t3.comments table_comments, t1.column_name, t1.data_type, t2.comments\n" +
            "from user_tables t\n" +
            "     left join user_tab_columns t1 on t1.table_name = t.table_name and\n" +
            "                                      t1.column_name not in ('CREATETIME', 'UPDATETIME', 'CREATE_BY', 'UPDATE_BY')\n" +
            "     left join user_col_comments t2 on t2.table_name = t1.table_name and t2.column_name = t1.column_name\n" +
            "     left join user_tab_comments t3 on t3.table_name = t.table_name\n" +
            "where (t.table_name like 'C_%' or t.table_name like 'D_%')\n" +
            "order by t.table_name asc, length(t1.column_name) asc";
        conn.execute(sql).then((res) => {
            const data: Item[] = res.rows?.map((arr: any) => {
                const item: any = {};
                res.metaData?.forEach((meta, index) => {
                    item[meta.name] = arr[index];
                })
                return item;
            }) || [];
            let fileText = "import {BaseModel} from \"./BaseModel\";\n\n";
            let preTableName = "";
            data.forEach(item => {
                const tableName = item.TABLE_NAME;
                const tableComments = item.TABLE_COMMENTS;
                const columnName = item.COLUMN_NAME;
                const dataType = item.DATA_TYPE;
                const comments = item.COMMENTS;
                if (preTableName !== tableName) {
                    if (!!preTableName) {
                        fileText += "}\n\n";
                    }
                    fileText += startInterface(tableName, tableComments);
                    preTableName = tableName;
                }
                fileText += addColumn(columnName, dataType, comments);
            })
            fileText += "}\\n";
            fs.writeFile(resolveApp(opt.out), fileText, {'flag': 'a'}, function (err) {
                if (err) {
                    throw err;
                }
            });
        });
    })
}