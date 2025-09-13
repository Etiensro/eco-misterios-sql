import React, { useState } from 'react';
import { Book, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

interface SQLCommandProps {
  command: string;
  description: string;
  example: string;
}

function SQLCommand({ command, description, example }: SQLCommandProps) {
  return (
    <div className="border border-border/30 rounded-lg p-3 space-y-2">
      <div className="flex items-center space-x-2">
        <code className="text-primary font-mono font-semibold text-sm bg-primary/10 px-2 py-1 rounded">
          {command}
        </code>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="sql-console">
        <code className="text-xs">{example}</code>
      </div>
    </div>
  );
}

export function SQLGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  const sqlCommands = [
    {
      command: "SELECT",
      description: "Selecciona columnas de una tabla",
      example: "SELECT * FROM tabla"
    },
    {
      command: "WHERE",
      description: "Filtra filas basado en condiciones",
      example: "SELECT * FROM tabla WHERE columna = 'valor'"
    },
    {
      command: "ORDER BY",
      description: "Ordena los resultados",
      example: "SELECT * FROM tabla ORDER BY columna ASC"
    },
    {
      command: "GROUP BY",
      description: "Agrupa filas por valores de columna",
      example: "SELECT columna, COUNT(*) FROM tabla GROUP BY columna"
    },
    {
      command: "HAVING",
      description: "Filtra grupos después de GROUP BY",
      example: "SELECT columna, COUNT(*) FROM tabla GROUP BY columna HAVING COUNT(*) > 1"
    },
    {
      command: "JOIN",
      description: "Combina datos de múltiples tablas",
      example: "SELECT * FROM tabla1 JOIN tabla2 ON tabla1.id = tabla2.id"
    },
    {
      command: "COUNT(*)",
      description: "Cuenta el número de filas",
      example: "SELECT COUNT(*) FROM tabla"
    }
  ];

  return (
    <div className="mystery-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Book className="w-5 h-5 text-accent" />
          <h3 className="font-cinzel font-semibold text-lg">Guía SQL</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sqlCommands.map((cmd, index) => (
            <SQLCommand key={index} {...cmd} />
          ))}
        </div>
      )}
      
      {!isExpanded && (
        <p className="text-sm text-muted-foreground text-center">
          Comandos SQL esenciales para resolver los retos
        </p>
      )}
    </div>
  );
}