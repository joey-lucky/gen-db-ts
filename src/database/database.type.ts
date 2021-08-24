export interface TableConfigItem {
    tableName: string;
    tableComments: string;
    columnName: string;
    dataType: "number" | "string" | "boolean";
    comments: string;
}

export type DataBaseType = "oracle" | "mysql";

export interface ConnectionConfig {
    URL: string;
    user: string;
    password: string,
}
