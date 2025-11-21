// src/components/ui/GameStatus.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, Trophy, Crown, Timer } from "lucide-react";

type GameStatusType = "playing" | "check" | "checkmate" | "stalemate" | "draw" | "timeout";

interface GameStatusProps {
  status: GameStatusType;
  currentTurn: "white" | "black";
  winner?: "white" | "black" | "draw";
  reason?: string;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  status,
  currentTurn,
  winner,
  reason,
}) => {
  const config = {
    playing: {
      icon: <Crown className="h-6 w-6 text-primary" />,
      message: `${currentTurn === "white" ? "White" : "Black"} to move`,
      className: "bg-primary/10 border-primary/50",
    },
    check: {
      icon: <AlertCircle className="h-6 w-6 text-destructive" />,
      message: `${currentTurn === "white" ? "White" : "Black"} is in check!`,
      className: "bg-destructive/10 border-destructive animate-pulse",
    },
    checkmate: {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      message: winner === "white" ? "White wins by checkmate!" : "Black wins by checkmate!",
      className: "bg-yellow-500/10 border-yellow-500 shadow-lg",
    },
    timeout: {
      icon: <Timer className="h-6 w-6 text-red-500 animate-pulse" />,
      message: winner === "white" ? "White wins on time!" : "Black wins on time!",
      className: "bg-red-500/10 border-red-500 shadow-lg",
    },
    stalemate: {
      icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
      message: "Stalemate – Draw!",
      className: "bg-orange-500/10 border-orange-500",
    },
    draw: {
      icon: <AlertCircle className="h-6 w-6 text-muted-foreground" />,
      message: reason ? `${reason} – Draw` : "Draw",
      className: "bg-muted/50 border-muted",
    },
  };

  const { icon, message, className } = config[status];

  return (
    <Card className={`p-5 ${className} transition-all duration-300`} aria-live="polite">
      <div className="flex items-center gap-4">
        {icon}
        <p className="text-lg font-bold">{message}</p>
      </div>
    </Card>
  );
};