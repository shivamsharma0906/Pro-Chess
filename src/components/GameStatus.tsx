import { Card } from "@/components/ui/card";
import { AlertCircle, Trophy, Crown } from "lucide-react";

interface GameStatusProps {
  status: "playing" | "checkmate" | "stalemate" | "draw" | "check";
  currentTurn: "white" | "black";
  winner?: "white" | "black" | "draw";
}

export const GameStatus = ({ status, currentTurn, winner }: GameStatusProps) => {
  const getStatusMessage = () => {
    switch (status) {
      case "checkmate":
        return {
          icon: <Trophy className="h-5 w-5 text-primary" />,
          message: `Checkmate! ${winner === "white" ? "White" : "Black"} wins!`,
          className: "bg-primary/10 border-primary",
        };
      case "stalemate":
        return {
          icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
          message: "Stalemate! Game is a draw.",
          className: "bg-muted/50 border-muted",
        };
      case "draw":
        return {
          icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
          message: "Game drawn by agreement.",
          className: "bg-muted/50 border-muted",
        };
      case "check":
        return {
          icon: <AlertCircle className="h-5 w-5 text-destructive" />,
          message: `${currentTurn === "white" ? "White" : "Black"} is in check!`,
          className: "bg-destructive/10 border-destructive",
        };
      default:
        return {
          icon: <Crown className="h-5 w-5 text-foreground" />,
          message: `${currentTurn === "white" ? "White" : "Black"} to move`,
          className: "bg-card border-border",
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <Card className={`p-4 ${statusInfo.className} transition-all`}>
      <div className="flex items-center gap-3">
        {statusInfo.icon}
        <p className="text-base font-semibold text-foreground">{statusInfo.message}</p>
      </div>
    </Card>
  );
};
