import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  duration: number; // en milisegundos
  onTimeUp: () => void;
  isActive: boolean;
}

export function Timer({ duration, onTimeUp, isActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          onTimeUp();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage <= 20) return 'timer-critical';
    if (percentage <= 50) return 'timer-warning';
    return 'timer-safe';
  };

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="mystery-card p-4">
      <div className="flex items-center space-x-3 mb-3">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-cinzel font-semibold text-lg">Tiempo Restante</h3>
      </div>
      
      <div className="space-y-3">
        <div className={`text-3xl font-mono font-bold ${getTimerClass()}`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              percentage <= 20 
                ? 'bg-destructive' 
                : percentage <= 50 
                ? 'bg-accent' 
                : 'bg-secondary'
            }`}
            style={{ width: `${Math.max(0, percentage)}%` }}
          ></div>
        </div>
        
        {percentage <= 20 && (
          <div className="flex items-center space-x-2 text-destructive text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>¡Tiempo crítico!</span>
          </div>
        )}
      </div>
    </div>
  );
}