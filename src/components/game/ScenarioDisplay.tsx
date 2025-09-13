import React from 'react';
import { Level } from '../../data/gameData';
import casaBrujasImg from '../../assets/casa-brujas.jpg';
import xtabayForestImg from '../../assets/xtabay-forest.jpg';
import islaMunecasImg from '../../assets/isla-munecas.jpg';

interface ScenarioDisplayProps {
  level: Level;
}

export function ScenarioDisplay({ level }: ScenarioDisplayProps) {
  // Obtener imagen del escenario basada en el nivel
  const getScenarioImage = (levelId: number) => {
    const scenarios = {
      1: casaBrujasImg,
      2: xtabayForestImg,
      3: islaMunecasImg
    };
    return scenarios[levelId as keyof typeof scenarios];
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Imagen del Escenario - Full Screen */}
      <img 
        src={getScenarioImage(level.id)}
        alt={level.name}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay visual tenue */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-background/10 to-transparent pointer-events-none"></div>
      
      {/* Efectos de partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-particles">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}