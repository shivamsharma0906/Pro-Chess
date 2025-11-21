// src/pages/Index.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "@/components/ChessBoard";
import { MoveHistory } from "@/components/MoveHistory";
import { GameControls } from "@/components/GameControls";
import { GameTimer } from "@/components/GameTimer";
import { GameStatus } from "@/components/GameStatus";
import { useToast } from "@/hooks/use-toast";

type GameMode = "human-vs-human" | "human-vs-computer";
type Difficulty = "easy" | "medium" | "hard";
type TimeControl = "blitz-3" | "blitz-5" | "rapid-10" | "classical-30";

const getTimeControlSeconds = (control: TimeControl): number => {
  const map: Record<TimeControl, number> = {
    "blitz-3": 3 * 60,
    "blitz-5": 5 * 60,
    "rapid-10": 10 * 60,
    "classical-30": 30 * 60,
  };
  return map[control];
};

export default function Index() {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("human-vs-human");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [timeControl, setTimeControl] = useState<TimeControl>("blitz-5");
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white");
  const [winner, setWinner] = useState<"white" | "black" | "draw" | undefined>(undefined);
  const [gameOverReason, setGameOverReason] = useState<string>("");

  const [whiteTime, setWhiteTime] = useState(getTimeControlSeconds("blitz-5"));
  const [blackTime, setBlackTime] = useState(getTimeControlSeconds("blitz-5"));
  const [activeTimer, setActiveTimer] = useState<"white" | "black" | null>(null); // ← Timer OFF on load

  const { toast } = useToast();

  // Sync time control changes
  useEffect(() => {
    const secs = getTimeControlSeconds(timeControl);
    setWhiteTime(secs);
    setBlackTime(secs);
  }, [timeControl]);

  const pushMove = useCallback((san: string) => {
    setMoveHistory(prev => [...prev, san]);
    setFen(gameRef.current.fen());
    setCurrentTurn(gameRef.current.turn() === "w" ? "white" : "black");
  }, []);

  const checkGameOver = useCallback(() => {
    const g = gameRef.current;
    if (!g.isGameOver()) {
      setActiveTimer(g.turn() === "w" ? "white" : "black");
      return;
    }
    setActiveTimer(null);

    if (g.isCheckmate()) {
      const win = g.turn() === "w" ? "black" : "white";
      setWinner(win);
      setGameOverReason("Checkmate");
      toast({ title: "Checkmate!", description: `${win} wins!` });
    } else if (g.isStalemate()) {
      setWinner("draw");
      setGameOverReason("Stalemate");
      toast({ title: "Draw", description: "Stalemate" });
    } else if (g.isInsufficientMaterial()) {
      setWinner("draw");
      setGameOverReason("Insufficient material");
      toast({ title: "Draw", description: "Not enough pieces" });
    } else if (g.isThreefoldRepetition()) {
      setWinner("draw");
      setGameOverReason("Threefold repetition");
      toast({ title: "Draw", description: "Threefold repetition" });
    } else {
      setWinner("draw");
      setGameOverReason("Draw");
      toast({ title: "Draw", description: "Game drawn" });
    }
  }, [toast]);

  // Computer AI
  const makeComputerMove = useCallback(() => {
    const g = gameRef.current;
    if (g.isGameOver() || g.turn() !== "b") return;

    const moves = g.moves({ verbose: true });
    if (moves.length === 0) return;

    let move;
    if (difficulty === "easy") {
      move = moves[Math.floor(Math.random() * moves.length)];
    } else if (difficulty === "medium") {
      const captures = moves.filter(m => m.captured);
      move = captures.length ? captures[Math.floor(Math.random() * captures.length)] : moves[Math.floor(Math.random() * moves.length)];
    } else {
      const checks = moves.filter(m => {
        const temp = new Chess(g.fen());
        temp.move(m);
        return temp.inCheck();
      });
      const captures = moves.filter(m => m.captured);
      move = checks.length ? checks[Math.floor(Math.random() * checks.length)]
           : captures.length ? captures[Math.floor(Math.random() * captures.length)]
           : moves[Math.floor(Math.random() * moves.length)];
    }

    const result = g.move(move);
    if (result) {
      pushMove(result.san);
      checkGameOver();
    }
  }, [difficulty, pushMove, checkGameOver]);

  useEffect(() => {
    if (gameMode === "human-vs-computer" && gameRef.current.turn() === "b" && !gameRef.current.isGameOver()) {
      const timer = setTimeout(makeComputerMove, 600);
      return () => clearTimeout(timer);
    }
  }, [fen, gameMode, makeComputerMove]);

  // Handle player move
  const handleMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    if (gameRef.current.isGameOver()) return;

    const result = gameRef.current.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion || "q",
    });

    if (result) {
      pushMove(result.san);
      checkGameOver();
    }
  }, [pushMove, checkGameOver]);

  // START GAME BUTTON — This is the key!
  const handleNewGame = useCallback(() => {
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setMoveHistory([]);
    setWinner(undefined);
    setGameOverReason("");
    setCurrentTurn("white");

    // Reset timers
    const secs = getTimeControlSeconds(timeControl);
    setWhiteTime(secs);
    setBlackTime(secs);

    // TIMER STARTS ONLY NOW
    setActiveTimer("white");

    toast({ title: "Game Started!", description: "White to move • Good luck!" });
  }, [timeControl, toast]);

  const handleTimeUp = useCallback((color: "white" | "black") => {
    if (gameRef.current.isGameOver()) return;
    const win = color === "white" ? "black" : "white";
    setWinner(win);
    setGameOverReason("Timeout");
    setActiveTimer(null);
    toast({ title: "Time's up!", description: `${win} wins on time!` });
  }, [toast]);

  const gameStatus = winner
    ? gameOverReason === "Timeout" ? "timeout" as const
    : gameOverReason === "Checkmate" ? "checkmate" as const
    : gameOverReason === "Stalemate" ? "stalemate" as const
    : "draw" as const
    : gameRef.current.inCheck() ? "check" as const
    : "playing" as const;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-5xl font-bold text-primary mb-2">Pro Chess</h1>
        <p className="text-center text-muted-foreground mb-8">Play • Learn • Master</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-3 space-y-6">
            <GameControls
              onNewGame={handleNewGame}
              onToggleSettings={() => {}}
              gameMode={gameMode}
              onGameModeChange={setGameMode}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              timeControl={timeControl}
              onTimeControlChange={setTimeControl}
            />
            <GameTimer initialTime={blackTime} isActive={activeTimer === "black"} player="black" onTimeUp={() => handleTimeUp("black")} />
          </div>

          {/* Center */}
          <div className="lg:col-span-6 space-y-6">
            <GameStatus status={gameStatus} currentTurn={currentTurn} winner={winner} reason={winner ? gameOverReason : undefined} />
            <ChessBoard game={gameRef.current} onMove={handleMove} playerColor="white" />
            <GameTimer initialTime={whiteTime} isActive={activeTimer === "white"} player="white" onTimeUp={() => handleTimeUp("white")} />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-3">
            <MoveHistory moves={moveHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}