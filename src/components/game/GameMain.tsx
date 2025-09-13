import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/use-toast';
import { Sidebar } from './Sidebar';
import { ScenarioDisplay } from './ScenarioDisplay';
import { VideoPlayer } from './VideoPlayer';
import { ChallengeOverlay } from './ChallengeOverlay';
import { gameLevels, difficultySettings, finalGameVideo } from '../../data/gameData';

interface GameMainProps {
  onGameComplete: (stats: { totalTime: number; hintsUsed: number; difficulty: string }) => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Estados del flujo por nivel
type GameState = 
  | 'intro_video'
  | 'challenge_1'
  | 'inter_video'
  | 'challenge_2'
  | 'outro_video'
  | 'final_video'
  | 'game_complete';

export function GameMain({ onGameComplete, difficulty }: GameMainProps) {
  const { toast } = useToast();
  
  // Estado del juego
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('intro_video');
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(difficultySettings[difficulty].timeLimit);

  // Obtener nivel actual
  const currentLevel = gameLevels[currentLevelIndex];
  const currentChallenge = gameState === 'challenge_1' 
    ? currentLevel.challenges[0] 
    : currentLevel.challenges[1];

  // Deshabilitar scroll global del documento en modo nivel
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Manejar fin de tiempo
  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    toast({
      title: "¡Tiempo agotado!",
      description: "Has perdido el juego. Puedes intentarlo de nuevo.",
      variant: "destructive"
    });
    
    // Reiniciar después de mostrar el mensaje
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }, [toast]);

  // Manejar uso de pista
  const handleUseHint = (hintIndex: number) => {
    if (!usedHints.includes(hintIndex)) {
      setUsedHints([...usedHints, hintIndex]);
      setTotalHintsUsed(prev => prev + 1);
      
      toast({
        title: "Pista revelada",
        description: "Pista añadida al panel lateral.",
        variant: "default"
      });
    }
  };

  // Avanzar al siguiente estado
  const advanceGameState = () => {
    switch (gameState) {
      case 'intro_video':
        setGameState('challenge_1');
        break;
      case 'challenge_1':
        setGameState('inter_video');
        break;
      case 'inter_video':
        setGameState('challenge_2');
        break;
      case 'challenge_2':
        setGameState('outro_video');
        break;
      case 'outro_video':
        // Avanzar al siguiente nivel o finalizar automáticamente
        if (currentLevelIndex < gameLevels.length - 1) {
          // Hay otro nivel - avanzar
          setTimeout(() => {
            setCurrentLevelIndex(prev => prev + 1);
            setGameState('intro_video');
            setUsedHints([]);
            setTimeLeft(difficultySettings[difficulty].timeLimit);
          }, 1000); // Pequeña pausa para transición suave
        } else {
          // Era el último nivel - ir al video final
          setGameState('final_video');
        }
        break;
      case 'final_video':
        setGameState('game_complete');
        break;
      case 'game_complete':
        // Juego completado
        const totalTime = Date.now() - startTime;
        onGameComplete({
          totalTime,
          hintsUsed: totalHintsUsed,
          difficulty
        });
        break;
    }
  };

  // Manejar éxito de consulta SQL
  const handleQuerySuccess = () => {
    toast({
      title: "¡Consulta correcta!",
      description: "Has resuelto este reto. Avanzando al siguiente...",
      variant: "default"
    });

    // Resetear temporizador para el siguiente reto/video
    setTimeLeft(difficultySettings[difficulty].timeLimit);
    setUsedHints([]);

    setTimeout(() => {
      advanceGameState();
    }, 1500);
  };

  // Manejar error de consulta SQL
  const handleQueryError = (error: string) => {
    toast({
      title: "Error en la consulta",
      description: error,
      variant: "destructive"
    });
  };

  // Obtener video actual según el estado
  const getCurrentVideo = () => {
    switch (gameState) {
      case 'intro_video':
        return {
          src: currentLevel.videos.intro,
          title: `${currentLevel.name} - Introducción`
        };
      case 'inter_video':
        return {
          src: currentLevel.videos.between,
          title: `${currentLevel.name} - Intermedio`
        };
      case 'outro_video':
        return {
          src: currentLevel.videos.outro,
          title: `${currentLevel.name} - Final`
        };
      case 'final_video':
        return {
          src: finalGameVideo,
          title: "ECO - Final del Juego"
        };
      default:
        return null;
    }
  };

  const currentVideo = getCurrentVideo();
  const isVideoState = ['intro_video', 'inter_video', 'outro_video', 'final_video'].includes(gameState);
  const isChallengeState = ['challenge_1', 'challenge_2'].includes(gameState);
  const challengeNumber = gameState === 'challenge_1' ? 1 : 2;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Columna principal - Escenario + Videos */}
      <main className="flex-1 relative overflow-hidden">
        {/* Escenario de fondo permanente */}
        <ScenarioDisplay level={currentLevel} />
        
        {/* Video player superpuesto cuando corresponde */}
        {isVideoState && currentVideo && (
          <div className="absolute inset-0 z-10">
            <VideoPlayer
              videoSrc={currentVideo.src}
              title={currentVideo.title}
              onVideoEnd={advanceGameState}
            />
          </div>
        )}
      </main>

      {/* Sidebar con scroll independiente */}
      <aside className="basis-[25%] shrink-0 h-screen overflow-y-auto border-l border-border/30 bg-background/95 backdrop-blur-sm">
        <div className="p-6">
          <Sidebar
            currentLevel={currentLevel}
            currentChallenge={currentChallenge}
            challengeIndex={challengeNumber - 1}
            timeLeft={timeLeft}
            onTimeUp={handleTimeUp}
            isTimerActive={isTimerActive}
            usedHints={usedHints}
            onUseHint={handleUseHint}
            difficulty={difficulty}
          />
        </div>
      </aside>

      {/* Overlay de reto SQL (pantalla completa) */}
      <ChallengeOverlay
        isOpen={isChallengeState}
        challenge={currentChallenge}
        challengeNumber={challengeNumber}
        onSolve={handleQuerySuccess}
        onError={handleQueryError}
      />

      {/* Efectos ambientales */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="floating-particles">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${10 + Math.random() * 6}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}