// src/components/ui/GameTimer.tsx
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface GameTimerProps {
  initialTime: number; // in seconds
  isActive: boolean;
  player: "white" | "black";
  onTimeUp: () => void;
}

export const GameTimer: React.FC<GameTimerProps> = ({ initialTime, isActive, player, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const intervalRef = useRef<number | null>(null);
  const timeUpCalledRef = useRef(false);

  // Reset the timer when initialTime changes
  useEffect(() => {
    setTimeLeft(initialTime);
    timeUpCalledRef.current = false;
    // if timer was running, we'll let the other effect handle restarting
  }, [initialTime]);

  // Manage the ticking interval
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isActive) {
      return; // nothing to do while paused
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // ensure onTimeUp is called only once
          if (!timeUpCalledRef.current) {
            timeUpCalledRef.current = true;
            try {
              onTimeUp();
            } catch (err) {
              // keep ticking stopped even if callback errors
              console.error("onTimeUp callback error:", err);
            }
          }
          // stop ticking further
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // cleanup on unmount or when isActive changes
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 30;

  return (
    <Card className={`p-3 ${isActive ? "bg-primary/10 border-primary" : "bg-card border-border"} transition-all`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-foreground" />
          <span className="text-sm font-medium text-foreground capitalize">{player}</span>
        </div>
        <div
          className={`text-2xl font-bold font-mono ${isLowTime && isActive ? "text-destructive animate-pulse" : "text-foreground"}`}
          aria-live="polite"
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>
    </Card>
  );
};

export default GameTimer;
