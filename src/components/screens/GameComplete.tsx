import React, { useEffect, useState } from 'react';
import { Trophy, RotateCcw, Star, Clock, Target } from 'lucide-react';
import { Button } from '../ui/button';

interface GameCompleteProps {
  onRestart: () => void;
  totalTime: number;
  hintsUsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function GameComplete({ onRestart, totalTime, hintsUsed, difficulty }: GameCompleteProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const getPerformanceScore = () => {
    let score = 100;
    
    // Penalizar por tiempo (máximo 30 puntos)
    const timeInMinutes = totalTime / 60000;
    if (timeInMinutes > 15) score -= 30;
    else if (timeInMinutes > 10) score -= 20;
    else if (timeInMinutes > 5) score -= 10;
    
    // Penalizar por pistas (máximo 20 puntos)
    score -= hintsUsed * 3;
    
    // Bonus por dificultad
    if (difficulty === 'hard') score += 20;
    else if (difficulty === 'medium') score += 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const getPerformanceRank = () => {
    const score = getPerformanceScore();
    if (score >= 90) return { rank: 'Maestro SQL', color: 'text-primary', icon: '🏆' };
    if (score >= 75) return { rank: 'Investigador Experto', color: 'text-secondary', icon: '🥇' };
    if (score >= 60) return { rank: 'Detective Competente', color: 'text-accent', icon: '🥈' };
    if (score >= 40) return { rank: 'Aprendiz Prometedor', color: 'text-muted-foreground', icon: '🥉' };
    return { rank: 'Novato Valiente', color: 'text-muted-foreground', icon: '🎖️' };
  };

  const performance = getPerformanceRank();

  return (
    <div className="game-container">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* Video/Animación Final Placeholder */}
          <div className="mystery-card p-12 space-y-8">
            <div className={`transition-all duration-1000 ${showAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="relative mb-8">
                <Trophy className="w-24 h-24 text-primary mx-auto pulse-energy" />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full pulse-energy"></div>
              </div>
              
              <h1 className="text-6xl font-cinzel font-bold text-gradient-primary mb-6">
                ¡Misterio Resuelto!
              </h1>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-xl text-foreground font-inter leading-relaxed">
                  Ezequiel Delacroix ha desentrañado los secretos del artefacto ancestral.
                </p>
                <p className="text-lg text-muted-foreground font-inter leading-relaxed">
                  Los datos ocultos en las leyendas mexicanas han revelado la verdad que 
                  yacía dormida durante siglos. Las fuerzas oscuras han sido apaciguadas 
                  y el equilibrio ha sido restaurado.
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas de Rendimiento */}
          <div className={`grid grid-cols-2 gap-6 transition-all duration-1000 delay-500 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mystery-card p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <div className="text-left">
                  <div className={`text-2xl font-cinzel font-bold ${performance.color}`}>
                    {performance.icon} {performance.rank}
                  </div>
                  <div className="text-4xl font-mono font-bold text-primary">
                    {getPerformanceScore()}/100
                  </div>
                </div>
              </div>
            </div>

            <div className="mystery-card p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-cinzel font-semibold text-secondary">
                    Tiempo Total
                  </div>
                  <div className="text-3xl font-mono font-bold text-primary">
                    {formatTime(totalTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles Adicionales */}
          <div className={`mystery-card p-6 transition-all duration-1000 delay-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <Target className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-primary">3/3</div>
                <div className="text-sm text-muted-foreground">Niveles Completados</div>
              </div>
              
              <div className="text-center">
                <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-primary">{hintsUsed}/12</div>
                <div className="text-sm text-muted-foreground">Pistas Utilizadas</div>
              </div>
              
              <div className="text-center">
                <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-lg font-cinzel font-bold text-primary capitalize">
                  {difficulty}
                </div>
                <div className="text-sm text-muted-foreground">Dificultad</div>
              </div>
            </div>
          </div>

          {/* Mensaje Final */}
          <div className={`mystery-card p-8 bg-primary/5 border-primary/20 transition-all duration-1000 delay-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl font-cinzel font-bold text-primary mb-4">
              El Legado de Ezequiel
            </h2>
            <p className="text-muted-foreground font-inter leading-relaxed max-w-2xl mx-auto">
              Gracias a tus habilidades SQL, has logrado conectar los fragmentos dispersos 
              de información que guardaban las leyendas mexicanas. El artefacto ancestral 
              ahora descansa en paz, y los espíritus pueden encontrar su descanso eterno.
            </p>
          </div>

          {/* Botón de Reinicio */}
          <div className={`space-y-4 transition-all duration-1000 delay-1200 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button 
              onClick={onRestart}
              size="lg"
              className="btn-primary text-xl px-12 py-6"
            >
              <RotateCcw className="w-6 h-6 mr-3" />
              Jugar de Nuevo
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Intenta mejorar tu puntuación o desafíate con una dificultad mayor
            </p>
          </div>

        </div>
      </div>
      
      {/* Efectos de celebración */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-primary/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}