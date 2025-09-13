import React from 'react';

interface GameHeaderProps {
  currentLevel: number;
  totalLevels: number;
  scenarioName: string;
}

export function GameHeader({ currentLevel, totalLevels, scenarioName }: GameHeaderProps) {
  return (
    <header className="mystery-card p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full pulse-energy"></div>
            <h1 className="text-3xl font-cinzel font-bold text-gradient-primary">
              ECO
            </h1>
          </div>
          <div className="h-6 w-px bg-border/50"></div>
          <div className="text-muted-foreground">
            <span className="text-sm font-inter">Investigador:</span>
            <span className="ml-2 text-primary font-medium">Ezequiel Delacroix</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm text-muted-foreground font-inter">Escenario Actual</div>
            <div className="text-lg font-cinzel font-semibold text-secondary">
              {scenarioName}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-muted/50 px-4 py-2 rounded-lg">
            <div className="text-sm text-muted-foreground font-inter">Nivel</div>
            <div className="text-2xl font-cinzel font-bold text-primary">
              {currentLevel}
            </div>
            <div className="text-muted-foreground">/</div>
            <div className="text-lg text-muted-foreground">
              {totalLevels}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 h-1 bg-muted/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-500"
          style={{ width: `${(currentLevel / totalLevels) * 100}%` }}
        ></div>
      </div>
    </header>
  );
}