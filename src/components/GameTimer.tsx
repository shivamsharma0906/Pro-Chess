import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface GameTimerProps {
  initialTime: number; // in seconds
  isActive: boolean;
  player: "white" | "black";
  onTimeUp: () => void;
}

export const GameTimer = ({ initialTime, isActive, player, onTimeUp }: GameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
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
        <div className={`text-2xl font-bold font-mono ${isLowTime && isActive ? "text-destructive animate-pulse" : "text-foreground"}`}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>
    </Card>
  );
};
