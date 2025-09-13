import React, { useState, useEffect } from 'react';
import { IntroScreen } from '../components/screens/IntroScreen';
import { VideoIntro } from '../components/screens/VideoIntro';
import { GameMain } from '../components/game/GameMain';
import { GameComplete } from '../components/screens/GameComplete';

type GameState = 'intro' | 'video' | 'playing' | 'complete';

interface GameStats {
  totalTime: number;
  hintsUsed: number;
  difficulty: string;
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  useEffect(() => {
    // Recuperar dificultad seleccionada
    const savedDifficulty = localStorage.getItem('game-difficulty') as 'easy' | 'medium' | 'hard';
    if (savedDifficulty) {
      setDifficulty(savedDifficulty);
    }
  }, []);

  const handleStartGame = () => {
    setGameState('video');
  };

  const handleVideoEnd = () => {
    setGameState('playing');
  };

  const handleGameComplete = (stats: GameStats) => {
    setGameStats(stats);
    setGameState('complete');
  };

  const handleRestart = () => {
    setGameState('intro');
    setGameStats(null);
    // Limpiar localStorage para permitir nueva selección de dificultad
    localStorage.removeItem('game-difficulty');
  };

  switch (gameState) {
    case 'intro':
      return <IntroScreen onStartGame={handleStartGame} />;
    
    case 'video':
      return <VideoIntro onVideoEnd={handleVideoEnd} />;
    
    case 'playing':
      return (
        <GameMain 
          onGameComplete={handleGameComplete}
          difficulty={difficulty}
        />
      );
    
    case 'complete':
      return gameStats ? (
        <GameComplete 
          onRestart={handleRestart}
          totalTime={gameStats.totalTime}
          hintsUsed={gameStats.hintsUsed}
          difficulty={gameStats.difficulty as 'easy' | 'medium' | 'hard'}
        />
      ) : null;
    
    default:
      return <IntroScreen onStartGame={handleStartGame} />;
  }
}