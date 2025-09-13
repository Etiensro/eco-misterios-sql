import React, { useState } from 'react';
import { Play, User, Target } from 'lucide-react';
import { Button } from '../ui/button';

interface IntroScreenProps {
  onStartGame: () => void;
}

export function IntroScreen({ onStartGame }: IntroScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const difficulties = [
    { 
      id: 'easy' as const, 
      name: 'Fácil', 
      time: '10 min',
      description: 'Perfecto para aprender SQL',
      color: 'text-secondary'
    },
    { 
      id: 'medium' as const, 
      name: 'Medio', 
      time: '5 min',
      description: 'Equilibrio entre reto y tiempo',
      color: 'text-accent'
    },
    { 
      id: 'hard' as const, 
      name: 'Difícil', 
      time: '3 min',
      description: 'Para expertos en SQL',
      color: 'text-destructive'
    }
  ];

  const handleStartGame = () => {
    // Guardar dificultad seleccionada en localStorage
    localStorage.setItem('game-difficulty', selectedDifficulty);
    onStartGame();
  };

  return (
    <div className="game-container">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* Logo y Título */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-8xl font-cinzel font-bold text-gradient-primary mb-4">
                ECO
              </h1>
              <div className="absolute -top-4 -right-8 w-6 h-6 bg-primary rounded-full pulse-energy"></div>
            </div>
            
            <p className="text-2xl text-muted-foreground font-inter max-w-2xl mx-auto leading-relaxed">
              Un viaje inmersivo a través de las leyendas mexicanas mientras dominas el arte de SQL
            </p>
          </div>

          {/* Información del Personaje */}
          <div className="mystery-card p-8 max-w-2xl mx-auto">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              
              <div className="flex-1 text-left space-y-3">
                <h2 className="text-3xl font-cinzel font-bold text-primary">
                  Ezequiel Delacroix
                </h2>
                <p className="text-muted-foreground font-inter">
                  Investigador paranormal especializado en fenómenos inexplicables. 
                  Tu misión es descifrar los enigmas del artefacto ancestral utilizando 
                  tus habilidades de análisis de datos.
                </p>
                
                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-secondary" />
                    <span className="text-sm text-secondary font-medium">3 Escenarios</span>
                  </div>
                  <div className="w-1 h-4 bg-border/50"></div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-accent" />
                    <span className="text-sm text-accent font-medium">6 Retos SQL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selección de Dificultad */}
          <div className="mystery-card p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-cinzel font-semibold mb-6">Selecciona tu Dificultad</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedDifficulty === diff.id
                      ? 'border-primary bg-primary/10 glow-effect'
                      : 'border-border/30 hover:border-primary/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className={`text-lg font-cinzel font-bold ${diff.color}`}>
                      {diff.name}
                    </div>
                    <div className="text-2xl font-mono font-bold text-primary">
                      {diff.time}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {diff.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Botón de Inicio */}
          <div className="space-y-4">
            <Button 
              onClick={handleStartGame}
              size="lg"
              className="btn-primary text-xl px-12 py-6"
            >
              <Play className="w-6 h-6 mr-3" />
              Comenzar Aventura
            </Button>
            
            <p className="text-sm text-muted-foreground">
              El video introductorio se reproducirá al comenzar
            </p>
          </div>

        </div>
      </div>
      
      {/* Efectos de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${12 + Math.random() * 8}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}