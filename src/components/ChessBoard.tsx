import { useState } from "react";
import { Chess, Square, PieceSymbol, Color } from "chess.js";
import { Card } from "@/components/ui/card";

interface ChessBoardProps {
  game: Chess;
  onMove: (move: { from: string; to: string; promotion?: string }) => void;
  playerColor: "white" | "black";
}

const pieceUnicode: Record<string, string> = {
  wp: "♙",
  wn: "♘",
  wb: "♗",
  wr: "♖",
  wq: "♕",
  wk: "♔",
  bp: "♟",
  bn: "♞",
  bb: "♝",
  br: "♜",
  bq: "♛",
  bk: "♚",
};

export const ChessBoard = ({ game, onMove, playerColor }: ChessBoardProps) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  const board = game.board();
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  if (playerColor === "black") {
    files.reverse();
    ranks.reverse();
  }

  const handleSquareClick = (square: Square) => {
    if (!selectedSquare) {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map((m) => m.to as Square));
      }
    } else {
      if (possibleMoves.includes(square)) {
        const moves = game.moves({ square: selectedSquare, verbose: true });
        const move = moves.find((m) => m.to === square);
        
        if (move) {
          onMove({
            from: selectedSquare,
            to: square,
            promotion: move.promotion || "q",
          });
        }
      } else {
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          const moves = game.moves({ square, verbose: true });
          setPossibleMoves(moves.map((m) => m.to as Square));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    }
  };

  const renderSquare = (file: string, rank: string) => {
    const square = (file + rank) as Square;
    const piece = game.get(square);
    const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0;
    const isSelected = selectedSquare === square;
    const isPossibleMove = possibleMoves.includes(square);
    const isInCheck = game.inCheck() && piece?.type === "k" && piece.color === game.turn();

    return (
      <div
        key={square}
        onClick={() => handleSquareClick(square)}
        className={`
          aspect-square flex items-center justify-center cursor-pointer text-5xl select-none
          transition-all duration-150 hover:brightness-110
          ${isLight ? "bg-board-light" : "bg-board-dark"}
          ${isSelected ? "ring-4 ring-board-highlight ring-inset" : ""}
          ${isInCheck ? "bg-destructive/30" : ""}
          ${isPossibleMove ? "relative" : ""}
        `}
      >
        {isPossibleMove && (
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none`}
          >
            <div
              className={`
                ${piece ? "w-full h-full bg-board-highlight/30 border-4 border-board-highlight" : "w-4 h-4 rounded-full bg-board-highlight/50"}
              `}
            />
          </div>
        )}
        {piece && (
          <span className={`${piece.color === "w" ? "text-foreground drop-shadow-lg" : "text-background drop-shadow-lg"} z-10`}>
            {pieceUnicode[piece.color + piece.type]}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className="p-4 bg-card border-border">
      <div className="w-full max-w-[600px] mx-auto">
        <div className="grid grid-cols-8 gap-0 border-4 border-panel-border rounded-lg overflow-hidden shadow-2xl">
          {ranks.map((rank) =>
            files.map((file) => renderSquare(file, rank))
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono px-2">
          {files.map((file) => (
            <span key={file}>{file}</span>
          ))}
        </div>
      </div>
    </Card>
  );
};
