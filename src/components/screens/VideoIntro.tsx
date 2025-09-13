import React, { useEffect, useRef, useState } from 'react';
import { SkipForward } from 'lucide-react';
import { Button } from '../ui/button';

interface VideoIntroProps {
  onVideoEnd: () => void;
}

export function VideoIntro({ onVideoEnd }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Mostrar botón de saltar después de 3 segundos
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', onVideoEnd);
      return () => video.removeEventListener('ended', onVideoEnd);
    }
  }, [onVideoEnd]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Video placeholder - En producción, usar el video real */}
      <div className="relative w-full h-full">
        {/* Placeholder para el video introductorio */}
        <div className="w-full h-full bg-gradient-to-b from-mystery-shadow via-background/20 to-background flex items-center justify-center">
          <div className="text-center space-y-8 max-w-4xl mx-auto p-8">
            <div className="relative">
              <h1 className="text-6xl font-cinzel font-bold text-gradient-primary mb-4">
                ECO
              </h1>
              <div className="absolute -top-2 -right-4 w-4 h-4 bg-primary rounded-full pulse-energy"></div>
            </div>
            
            <div className="space-y-6 text-center">
              <p className="text-2xl text-foreground font-inter leading-relaxed">
                En las profundidades de México, donde las leyendas cobran vida...
              </p>
              
              <p className="text-xl text-muted-foreground font-inter leading-relaxed">
                Un artefacto ancestral guarda secretos que solo pueden ser revelados 
                a través del análisis de datos perdidos en el tiempo.
              </p>
              
              <p className="text-lg text-secondary font-inter leading-relaxed">
                Como Ezequiel Delacroix, investigador de lo paranormal, 
                deberás usar tus habilidades SQL para desentrañar los misterios 
                que acechan en las sombras de tres escenarios legendarios.
              </p>
            </div>

            {/* Simulación de video con animaciones */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div className="mystery-card p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full pulse-energy"></div>
                </div>
                <h3 className="font-cinzel font-bold text-lg text-primary mb-2">Casa de las Brujas</h3>
                <p className="text-sm text-muted-foreground">Los ecos del pasado revelan verdades dolorosas</p>
              </div>
              
              <div className="mystery-card p-6 text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-secondary rounded-full pulse-energy"></div>
                </div>
                <h3 className="font-cinzel font-bold text-lg text-secondary mb-2">La Xtabay</h3>
                <p className="text-sm text-muted-foreground">Entre ilusiones y realidad, la verdad aguarda</p>
              </div>
              
              <div className="mystery-card p-6 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-accent rounded-full pulse-energy"></div>
                </div>
                <h3 className="font-cinzel font-bold text-lg text-accent mb-2">Isla de las Muñecas</h3>
                <p className="text-sm text-muted-foreground">Las guardianas silenciosas protegen el secreto final</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-primary font-cinzel font-semibold">
                ¿Estás listo para descubrir la verdad?
              </p>
            </div>
          </div>
        </div>

        {/* Video real (comentado para usar placeholder) */}
        {/*
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        >
          <source src="/videos/intro.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento video.
        </video>
        */}

        {/* Botón de saltar */}
        {showSkip && (
          <div className="absolute top-8 right-8">
            <Button
              onClick={onVideoEnd}
              variant="outline"
              className="bg-background/80 backdrop-blur-sm"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Saltar Intro
            </Button>
          </div>
        )}

        {/* Auto-advance después de tiempo determinado */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 text-muted-foreground text-sm">
            <div className="w-2 h-2 bg-primary rounded-full pulse-energy"></div>
            <span>La aventura comenzará automáticamente...</span>
          </div>
        </div>
      </div>

      {/* Auto-advance después de 10 segundos si no hay video real */}
      {(() => {
        setTimeout(() => {
          onVideoEnd();
        }, 10000);
        return null;
      })()}
    </div>
  );
}