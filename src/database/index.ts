import * as oracle from "./oracle";
import {ConnectionConfig, DataBaseType, TableConfigItem} from "./database.type";

export function getTableConfigData(type: DataBaseType = "oracle", connectionConfig: ConnectionConfig): Promise<TableConfigItem[]> {
    if (type === "oracle") {
        return oracle.getDataConfigData(connectionConfig);
    }
    return Promise.resolve([]);
}