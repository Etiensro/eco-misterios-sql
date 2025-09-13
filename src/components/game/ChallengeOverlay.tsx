import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Database, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { apiClient, QueryResult } from '@/utils/apiClient';
import { Challenge } from '../../data/gameData';

interface ChallengeOverlayProps {
  isOpen: boolean;
  challenge: Challenge;
  challengeNumber: number;
  onSolve: () => void;
  onError: (error: string) => void;
}

export function ChallengeOverlay({ 
  isOpen, 
  challenge, 
  challengeNumber, 
  onSolve, 
  onError 
}: ChallengeOverlayProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset state cuando cambia el reto
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResult(null);
      setFailedAttempts(0);
      setShowAnswer(false);
    }
  }, [isOpen, challenge.id]);

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      onError('Por favor, ingresa una consulta SQL');
      return;
    }

    setIsExecuting(true);
    
    try {
      // Ejecutar consulta en el backend real
      const queryResult = await apiClient.executeQuery(query);
      setResult(queryResult);
      
      if (queryResult.success) {
        // Validar consulta con el backend
        const validationResult = await apiClient.validateQuery(query, challenge.expectedQuery);
        
        if (validationResult.success && validationResult.isValid) {
          // Consulta correcta - cerrar overlay
          setTimeout(() => {
            onSolve();
          }, 1500);
        } else {
          // Consulta incorrecta - incrementar fallos
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);
          
          onError('La consulta es válida pero no es la respuesta esperada para este reto. Revisa las pistas.');
          
          // Mostrar botón de ayuda desde el 3er intento
          if (newFailedAttempts >= 3) {
            setShowAnswer(true);
          }
        }
      } else {
        // Error en la consulta
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        onError(queryResult.error || 'Error al ejecutar la consulta');
        
        // Mostrar botón de ayuda desde el 3er intento
        if (newFailedAttempts >= 3) {
          setShowAnswer(true);
        }
      }
    } catch (error) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      onError('Error de conexión con el servidor. Asegúrate de que el backend esté ejecutándose.');
      
      // Mostrar botón de ayuda desde el 3er intento
      if (newFailedAttempts >= 3) {
        setShowAnswer(true);
      }
    }
    
    setIsExecuting(false);
  };

  const handleClearQuery = () => {
    setQuery('');
    setResult(null);
  };

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // Nuevo fallo - reaparece el botón si estaba oculto
  useEffect(() => {
    if (failedAttempts >= 3 && !showAnswer) {
      setShowAnswer(true);
    }
  }, [failedAttempts]);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={() => {}}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-6xl max-h-[95vh] translate-x-[-50%] translate-y-[-50%] overflow-hidden border-2 border-primary/20 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg p-0"
          )}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex flex-col h-full">
            {/* Header del reto - Sin botón X */}
            <div className="flex items-center justify-between p-6 border-b border-border/30 bg-muted/20">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-cinzel font-bold text-gradient-jade">
                Reto {challengeNumber}
              </h2>
              <div className="px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-lg">
                <span className="text-xs text-secondary font-mono">{challenge.table}</span>
              </div>
            </div>
            
            {/* Contador de fallos */}
            {failedAttempts > 0 && (
              <div className="text-sm text-destructive">
                Intentos fallidos: {failedAttempts}
              </div>
            )}
          </div>

          {/* Título y descripción del reto */}
          <div className="p-6 border-b border-border/30">
            <h3 className="text-xl font-cinzel font-semibold text-secondary mb-2">
              {challenge.title}
            </h3>
            <p className="text-muted-foreground font-inter leading-relaxed">
              {challenge.description}
            </p>
          </div>
          
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Editor de consultas */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Ingresa tu consulta SQL:
                </label>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`SELECT * FROM ${challenge.table}...`}
                  className="font-mono bg-muted/50 border-border/50 focus:border-primary/50 min-h-32"
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
              
              {/* Botones de acción */}
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

                {/* Botón mostrar/ocultar respuesta */}
                {failedAttempts >= 3 && (
                  <Button
                    variant="secondary"
                    onClick={toggleShowAnswer}
                  >
                    {showAnswer ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Ocultar Respuesta
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Mostrar Respuesta
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Mostrar respuesta */}
              {showAnswer && (
                <div className="p-4 bg-secondary/20 border border-secondary/30 rounded-lg">
                  <h4 className="text-sm font-medium text-secondary mb-2">Respuesta:</h4>
                  <code className="text-sm font-mono text-secondary block bg-muted/50 p-2 rounded">
                    {challenge.expectedQuery}
                  </code>
                </div>
              )}
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
                    
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="w-full border border-border/30 rounded-lg overflow-hidden">
                        <thead className="bg-muted/50 sticky top-0">
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
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}