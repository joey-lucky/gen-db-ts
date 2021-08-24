import {ConnectionConfig, TableConfigItem} from "./database.type";
import {getConnection} from "oracledb";

export async function getDataConfigData(opt: ConnectionConfig): Promise<TableConfigItem[]> {
    const sql = "select t.table_name, t3.comments table_comments, t1.column_name, t1.data_type, t2.comments\n" +
        "from user_tables t\n" +
        "     left join user_tab_columns t1 on t1.table_name = t.table_name and\n" +
        "                                      t1.column_name not in ('CREATETIME', 'UPDATETIME', 'CREATE_BY', 'UPDATE_BY')\n" +
        "     left join user_col_comments t2 on t2.table_name = t1.table_name and t2.column_name = t1.column_name\n" +
        "     left join user_tab_comments t3 on t3.table_name = t.table_name\n" +
        "where (t.table_name like 'C_%' or t.table_name like 'D_%')\n" +
        "order by t.table_name asc, length(t1.column_name) asc";
    const conn = await getConnection({
        user: opt.user,　　//用户名
        password: opt.password,　　//密码
        //IP:数据库IP地址，PORT:数据库端口，SCHEMA:数据库名称
        connectString: opt.URL
    });
    const res = await conn.execute(sql);
    const rows: any[] = res?.rows || [];
    const data: TableConfigItem[] = rows
        .map((arr: any) => {
            const item: any = {};
            res.metaData?.forEach((meta, index) => {
                item[meta.name] = arr[index];
            })
            return item;
        })
        .map(item => {
            const configItem: TableConfigItem = {
                tableName:item.TABLE_NAME,
                tableComments:item.TABLE_COMMENTS,
                columnName:item.COLUMN_NAME,
                comments:item.COMMENTS,
                dataType: "string"
            };
            if (item.DATA_TYPE === "NUMBER") {
                configItem.dataType = "number";
            }
            return configItem;
        });
    return data;
}