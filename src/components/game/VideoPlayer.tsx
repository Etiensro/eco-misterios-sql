import React, { useRef, useEffect } from 'react';
import { Play, SkipForward } from 'lucide-react';
import { Button } from '../ui/button';

interface VideoPlayerProps {
  videoSrc: string;
  title: string;
  onVideoEnd: () => void;
  autoPlay?: boolean;
}

export function VideoPlayer({ videoSrc, title, onVideoEnd, autoPlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // auto-scroll
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const v = videoRef.current;
    if (!v || !autoPlay) return;

    const onCanPlay = async () => {
      try { await v.play(); }
      catch (err: any) {
        // Ignora AbortError: ocurre si el <video> se reemplaza justo después
        if (err?.name !== 'AbortError') console.error(err);
      }
    };

    v.addEventListener('canplay', onCanPlay, { once: true });
    v.load(); // asegura que el nuevo src dispare canplay
    return () => v.removeEventListener('canplay', onCanPlay);
  }, [videoSrc, autoPlay]);

  const handleVideoEnd = () => {
    onVideoEnd();
  };

  const handleSkip = () => {
    onVideoEnd();
  };

  return (
    <div ref={containerRef} className="relative w-full h-full lg:h-full bg-background/95 border border-border rounded-lg overflow-hidden">
      <video 
        ref={videoRef}
        className="w-full h-full object-cover"
        controls
        onEnded={handleVideoEnd}
        poster="/placeholder-video.jpg"
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Fallback para navegadores sin soporte de video */}
        <div className="w-full h-full flex items-center justify-center bg-muted/50">
          <div className="text-center space-y-4">
            <Play className="w-16 h-16 text-primary mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-cinzel font-bold text-primary">{title}</h3>
              <p className="text-muted-foreground">Tu navegador no soporta la reproducción de video.</p>
              <Button onClick={handleSkip} variant="outline">
                <SkipForward className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </video>

      {/* Overlay con botón de saltar */}
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSkip}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Saltar
        </Button>
      </div>

      {/* Título del video */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2">
          <h3 className="text-lg font-cinzel font-semibold text-primary">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}