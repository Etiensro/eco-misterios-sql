// src/utils/apiClient.ts
// Cliente API para comunicación con el backend SQLite (versión mejorada para el juego)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

if (!BACKEND_URL) {
  console.error(
    "VITE_BACKEND_URL no está definido. Asegúrate de tener un archivo .env en la raíz y reinicia Vite."
  );
}

// Interfaces de respuesta
export interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  message?: string;
}

export interface ValidationResult {
  success: boolean;
  isValid?: boolean;
  error?: string;
  message?: string;
}

export interface SchemaResult {
  success: boolean;
  tableName?: string;
  columns?: {
    name: string;
    type: string;
    notNull: boolean;
    primaryKey: boolean;
  }[];
  error?: string;
}

// Clase interna para manejar requests
class APIClient {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!BACKEND_URL) {
      throw new Error("VITE_BACKEND_URL no está definido");
    }

    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });

      const text = await response.text();

      // Manejar caso donde la respuesta no es JSON válido
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = text; // devolver texto crudo si no es JSON
      }

      if (!response.ok) {
        throw new Error(data?.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Ejecutar consulta
  async executeQuery(query: string): Promise<QueryResult> {
    try {
      return await this.makeRequest<QueryResult>("/query", {
        method: "POST",
        body: JSON.stringify({ query }),
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión con el servidor",
      };
    }
  }

  // Validar query
  async validateQuery(userQuery: string, expectedQuery: string): Promise<ValidationResult> {
    try {
      return await this.makeRequest<ValidationResult>("/validate", {
        method: "POST",
        body: JSON.stringify({ userQuery, expectedQuery }),
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión con el servidor",
      };
    }
  }

  // Obtener esquema de tabla
  async getTableSchema(tableName: string): Promise<SchemaResult> {
    try {
      return await this.makeRequest<SchemaResult>(`/schema/${tableName}`);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error obteniendo esquema de tabla",
      };
    }
  }

  // Adaptador para nombres de columnas (compatibilidad con juego)
  async getSchemaNames(tableName: string): Promise<string[]> {
    const schemaResult = await this.getTableSchema(tableName);
    if (schemaResult.success && schemaResult.columns) {
      return schemaResult.columns.map((col) => col.name);
    }
    return [];
  }

  // Checar salud del backend
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return await this.makeRequest<{ status: string; timestamp: string }>("/health");
  }
}

// Instancia única
export const apiClient = new APIClient();

// Exportar funciones sueltas para compatibilidad con tu engineSQL
export async function runQuery(query: string) {
  return await apiClient.executeQuery(query);
}

export async function validateQuery(userQuery: string, expectedQuery: string) {
  return await apiClient.validateQuery(userQuery, expectedQuery);
}

export async function getSchema(tableName: string) {
  return await apiClient.getSchemaNames(tableName);
}
