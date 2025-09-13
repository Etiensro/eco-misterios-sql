import React from 'react';
import { Lightbulb, Lock } from 'lucide-react';
import { Button } from '../ui/button';

interface HintPanelProps {
  hints: string[];
  usedHints: number[];
  onUseHint: (hintIndex: number) => void;
}

export function HintPanel({ hints, usedHints, onUseHint }: HintPanelProps) {
  return (
    <div className="mystery-card p-4">
      <div className="flex items-center space-x-3 mb-4">
        <Lightbulb className="w-5 h-5 text-accent" />
        <h3 className="font-cinzel font-semibold text-lg">Pistas</h3>
      </div>
      
      <div className="space-y-3">
        {hints.map((hint, index) => (
          <div key={index}>
            {usedHints.includes(index) ? (
              <div className="p-3 bg-secondary/20 border border-secondary/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-secondary-foreground font-inter">
                    {hint}
                  </p>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full p-3 h-auto justify-start border border-border/30 hover:border-accent/50"
                onClick={() => onUseHint(index)}
              >
                <Lock className="w-4 h-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Pista {index + 1} - Clic para revelar
                </span>
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground text-center">
        {usedHints.length} de {hints.length} pistas utilizadas
      </div>
    </div>
  );
}