import { runQuery, validateQuery, getSchema } from "./apiClient";

export async function executeSQL(query: string) {
  return await runQuery(query);
}

export async function validateUserQuery(userQuery: string, expectedQuery: string) {
  return await validateQuery(userQuery, expectedQuery);
}

export async function fetchTableSchema(tableName: string) {
  return await getSchema(tableName);
}
