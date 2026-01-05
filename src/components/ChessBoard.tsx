import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card } from "@/components/ui/card";

interface ChessBoardProps {
  game: Chess;
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
  playerColor: "white" | "black";
}

export const ChessBoard = ({ game, onMove, playerColor }: ChessBoardProps) => {
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // Attempt move to see if valid, but don't mutate here (let parent do it via onMove)
    // Actually, onMove expects us to trigger the move action.
    // The parent 'handleMove' checks validity using game.move() which mutates.
    // However, react-chessboard expects boolean return to update UI immediately? 
    // No, if position prop is controlled (which it is via game.fen()), we return true 
    // and wait for parent to update 'game' prop.

    // We can't validate fully without mutating a temp instance, but parent does that.
    // Just pass it up.

    onMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Default to queen for simplicity, can add custom dialog later
    });

    return true; // Optimistic update
  };

  return (
    <Card className="p-4 bg-card border-border shadow-2xl">
      <div className="w-full max-w-[600px] mx-auto aspect-square">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={playerColor}
          customDarkSquareStyle={{ backgroundColor: "hsl(var(--board-dark))" }}
          customLightSquareStyle={{ backgroundColor: "hsl(var(--board-light))" }}
          animationDuration={200}
        />
      </div>
    </Card>
  );
};
