import React, { useEffect, useState } from 'react';
import { Level } from '../../data/gameData';

interface LevelTransitionProps {
  newLevel: Level;
  onTransitionComplete: () => void;
}

export function LevelTransition({ newLevel, onTransitionComplete }: LevelTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onTransitionComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onTransitionComplete]);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Fondo oscuro con animación */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/20" />
      
      {/* Efectos de partículas */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Contenido de transición */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-6 animate-scale-in">
          {/* Título del nuevo nivel */}
          <div className="space-y-4">
            <div className="text-6xl font-cinzel font-bold text-gradient-primary animate-fade-in">
              {newLevel.name}
            </div>
            
            <div className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto animate-fade-in animation-delay-300">
              {newLevel.description}
            </div>
          </div>

          {/* Línea decorativa animada */}
          <div className="flex items-center justify-center space-x-4 animate-fade-in animation-delay-600">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary animate-slide-in-left" />
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-primary animate-slide-in-right" />
          </div>

          {/* Texto de carga */}
          <div className="text-sm text-muted-foreground/80 font-inter animate-fade-in animation-delay-900">
            Preparando el escenario...
          </div>
        </div>
      </div>

      {/* Borde brillante animado */}
      <div className="absolute inset-0 border-2 border-primary/20 animate-pulse" />
    </div>
  );
}