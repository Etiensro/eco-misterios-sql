import React from 'react';
import { Timer } from './Timer';
import { HintPanel } from './HintPanel';
import { ProgressPanel } from './ProgressPanel';
import { SQLGuide } from './SQLGuide';
import { Level, Challenge } from '../../data/gameData';

interface SidebarProps {
  currentLevel: Level;
  currentChallenge: Challenge;
  challengeIndex: number;
  timeLeft: number;
  onTimeUp: () => void;
  isTimerActive: boolean;
  usedHints: number[];
  onUseHint: (hintIndex: number) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function Sidebar({ 
  currentLevel, 
  currentChallenge, 
  challengeIndex,
  timeLeft,
  onTimeUp,
  isTimerActive,
  usedHints,
  onUseHint,
  difficulty
}: SidebarProps) {
  return (
    <aside className="w-full space-y-6">
      {/* Información del Escenario */}
      <div className="mystery-card p-6">
        <h2 className="text-2xl font-cinzel font-bold text-gradient-primary mb-3">
          {currentLevel.name}
        </h2>
        <p className="text-muted-foreground text-sm font-inter leading-relaxed">
          {currentLevel.scenario}
        </p>
        <div className="mt-4 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-xs text-primary font-medium">
            Dificultad: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}
          </p>
        </div>
      </div>

      {/* Temporizador */}
      <Timer 
        duration={timeLeft} 
        onTimeUp={onTimeUp} 
        isActive={isTimerActive}
      />

      {/* Panel de Pistas */}
      <HintPanel 
        hints={currentChallenge.hints}
        usedHints={usedHints}
        onUseHint={onUseHint}
      />

      {/* Progreso */}
      <ProgressPanel 
        currentLevel={currentLevel.id}
        totalLevels={3}
        currentChallenge={challengeIndex + 1}
        totalChallenges={currentLevel.challenges.length}
      />

      {/* Guía SQL */}
      <SQLGuide />
    </aside>
  );
}