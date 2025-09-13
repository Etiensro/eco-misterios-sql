import React from 'react';
import { Target, CheckCircle } from 'lucide-react';

interface ProgressPanelProps {
  currentLevel: number;
  totalLevels: number;
  currentChallenge: number;
  totalChallenges: number;
}

export function ProgressPanel({ 
  currentLevel, 
  totalLevels, 
  currentChallenge, 
  totalChallenges 
}: ProgressPanelProps) {
  return (
    <div className="mystery-card p-4">
      <div className="flex items-center space-x-3 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="font-cinzel font-semibold text-lg">Progreso</h3>
      </div>
      
      <div className="space-y-4">
        {/* Progreso del Nivel */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-inter text-muted-foreground">Niveles</span>
            <span className="text-sm font-mono text-primary font-medium">
              {currentLevel}/{totalLevels}
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-500"
              style={{ width: `${(currentLevel / totalLevels) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Progreso del Reto */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-inter text-muted-foreground">Retos del Nivel</span>
            <span className="text-sm font-mono text-secondary font-medium">
              {currentChallenge}/{totalChallenges}
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-secondary to-secondary-glow rounded-full transition-all duration-500"
              style={{ width: `${(currentChallenge / totalChallenges) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Indicadores de Estado */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {Array.from({ length: totalLevels }, (_, index) => (
            <div 
              key={index}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                index + 1 < currentLevel 
                  ? 'bg-primary/20 text-primary' 
                  : index + 1 === currentLevel 
                  ? 'bg-secondary/20 text-secondary pulse-energy' 
                  : 'bg-muted/20 text-muted-foreground'
              }`}
            >
              {index + 1 < currentLevel ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-xs font-mono font-bold">{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}