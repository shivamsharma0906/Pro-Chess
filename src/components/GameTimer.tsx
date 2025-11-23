// src/components/ui/GameTimer.tsx
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface GameTimerProps {
  initialTime: number; // seconds
  isActive: boolean;
  player: "white" | "black";
  onTimeUp: () => void;
}

export const GameTimer: React.FC<GameTimerProps> = ({
  initialTime,
  isActive,
  player,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef<number | null>(null);
  const hasCalledTimeUp = useRef(false);

  // Reset when initialTime changes (new game)
  useEffect(() => {
    setTimeLeft(initialTime);
    hasCalledTimeUp.current = false;
  }, [initialTime]);

  // Handle ticking
  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isActive) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!hasCalledTimeUp.current) {
            hasCalledTimeUp.current = true;
            onTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isCritical = timeLeft < 30 && isActive;

  return (
    <Card
      className={`p-4 transition-all duration-300 ${
        isActive
          ? "bg-primary/10 border-primary shadow-lg"
          : "bg-muted border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-foreground/80" />
          <span className="text-lg font-semibold capitalize">{player}</span>
        </div>

        <div
          className={`text-3xl font-bold font-mono ${
            isCritical ? "text-destructive animate-pulse" : "text-foreground"
          }`}
          aria-live="polite"
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>
    </Card>
  );
};

export default GameTimer;