import React, { useState } from 'react';
import { Play, RotateCcw, Database } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface QueryResult {
  success: boolean;
  data?: any[];
  message?: string;
  error?: string;
}

interface SQLConsoleProps {
  expectedQuery: string;
  tableName: string;
  onQuerySuccess: () => void;
  onQueryError: (error: string) => void;
}

export function SQLConsole({ expectedQuery, tableName, onQuerySuccess, onQueryError }: SQLConsoleProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      onQueryError('Por favor, ingresa una consulta SQL');
      return;
    }

    setIsExecuting(true);

    try {
      // 👉 Cambia esta URL por la de tu backend en Render
      const response = await fetch('https://hackrush-2025-1.onrender.com/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const queryResult: QueryResult = await response.json();
      setResult(queryResult);

    if (queryResult.success) {
  // Verifica si la consulta del usuario es igual a la esperada (ignorando mayúsculas/minúsculas y espacios extra)
    const normalize = (str: string) =>
      str.trim().replace(/\s+/g, " ").toLowerCase();

  if (normalize(query) === normalize(expectedQuery)) {
      onQuerySuccess();
    } else {
    onQueryError("La consulta es válida, pero no es la respuesta esperada para este reto.");
    }
  } else {
    onQueryError(queryResult.error || "Error al ejecutar la consulta");
  }
    } catch (error) {
      onQueryError('Error al conectar con el servidor');
    }

    setIsExecuting(false);
  };

  const handleClearQuery = () => {
    setQuery('');
    setResult(null);
  };

  return (
    <div className="mystery-card p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Database className="w-6 h-6 text-secondary" />
        <h2 className="text-2xl font-cinzel font-bold text-gradient-jade">
          Consola SQL
        </h2>
        <div className="px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-lg">
          <span className="text-xs text-secondary font-mono">{tableName}</span>
        </div>
      </div>
      
      {/* Editor */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Ingresa tu consulta SQL:
          </label>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SELECT * FROM ..."
            className="font-mono bg-muted/50 border-border/50 focus:border-primary/50 min-h-24"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleExecuteQuery();
              }
            }}
          />
          <div className="text-xs text-muted-foreground">
            Tip: Presiona Ctrl+Enter (o Cmd+Enter) para ejecutar rápidamente
          </div>
        </div>
        
        {/* Botones */}
        <div className="flex space-x-3">
          <Button
            onClick={handleExecuteQuery}
            disabled={isExecuting || !query.trim()}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            {isExecuting ? 'Ejecutando...' : 'Ejecutar Consulta'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClearQuery}
            disabled={isExecuting}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>

      {/* Resultados */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${result.success ? 'bg-success-glow' : 'bg-danger-glow'}`}></div>
            <h3 className="font-semibold text-lg">Resultado</h3>
          </div>

          {result.success && result.data ? (
            <div className="space-y-3">
              {result.message && (
                <div className="p-3 bg-secondary/20 border border-secondary/30 rounded-lg text-sm text-secondary">
                  {result.message}
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full border border-border/30 rounded-lg overflow-hidden">
                  <thead className="bg-muted/50">
                    <tr>
                      {result.data.length > 0 && Object.keys(result.data[0]).map((column) => (
                        <th key={column} className="px-4 py-2 text-left text-sm font-medium border-b border-border/30">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.map((row, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm border-b border-border/10">
                            {typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            result.error && (
              <div className="p-3 bg-destructive/20 border border-destructive/30 rounded-lg text-sm text-destructive">
                {result.error}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
