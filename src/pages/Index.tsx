// src/pages/Index.tsx
"use client";

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

// THIS WAS MISSING — NOW FIXED
const getTimeControlSeconds = (control: TimeControl): number => {
  const map: Record<TimeControl, number> = {
    "blitz-3": 3 * 60,
    "blitz-5": 5 * 60,
    "rapid-10": 10 * 60,
    "classical-30": 30 *  60,
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

  // Timer state
  const [whiteTime, setWhiteTime] = useState(getTimeControlSeconds("blitz-5"));
  const [blackTime, setBlackTime] = useState(getTimeControlSeconds("blitz-5"));
  const [activeTimer, setActiveTimer] = useState<"white" | "black" | null>(null);

  // THIS IS THE MAGIC LINE THAT FIXES THE TIMER RESET
  const [gameKey, setGameKey] = useState(0);

  const { toast } = useToast();

  // Update timers when time control changes
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
      toast({ title: "Checkmate!", description: `${win.charAt(0).toUpperCase() + win.slice(1)} wins!` });
    } else if (g.isDraw()) {
      setWinner("draw");
      setGameOverReason("Draw");
      toast({ title: "Draw", description: "Game ended in a draw" });
    }
  }, [toast]);

  // Simple computer AI
  const makeComputerMove = useCallback(() => {
    const g = gameRef.current;
    if (g.isGameOver() || g.turn() !== "b") return;

    const moves = g.moves();
    if (moves.length === 0) return;

    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    const result = g.move(randomMove);

    if (result) {
      pushMove(result.san);
      checkGameOver();
    }
  }, [pushMove, checkGameOver]);

  // Computer move when it's black's turn
  useEffect(() => {
    if (gameMode === "human-vs-computer" && gameRef.current.turn() === "b" && !gameRef.current.isGameOver()) {
      const timer = setTimeout(makeComputerMove, 800);
      return () => clearTimeout(timer);
    }
  }, [fen, gameMode, makeComputerMove]);

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

  // NEW GAME — Now properly resets timers!
  const handleNewGame = useCallback(() => {
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setMoveHistory([]);
    setWinner(undefined);
    setGameOverReason("");
    setCurrentTurn("white");

    const secs = getTimeControlSeconds(timeControl);
    setWhiteTime(secs);
    setBlackTime(secs);
    setActiveTimer("white");

    // THIS LINE FIXES THE TIMER RESET BUG
    setGameKey(prev => prev + 1);

    toast({ title: "New Game", description: "White to move — Good luck!" });
  }, [timeControl, toast]);

  const handleTimeUp = useCallback((color: "white" | "black") => {
    if (gameRef.current.isGameOver()) return;
    const win = color === "white" ? "black" : "white";
    setWinner(win);
    setGameOverReason("Timeout");
    setActiveTimer(null);
    toast({ title: "Time Up!", description: `${win.charAt(0).toUpperCase() + win.slice(1)} wins on time!` });
  }, [toast]);

  const gameStatus = winner
    ? gameOverReason === "Timeout" ? "timeout" as const
    : gameOverReason === "Checkmate" ? "checkmate" as const
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

            {/* BLACK TIMER — NOW WITH key= FOR FULL RESET */}
            <GameTimer
              key={`black-${gameKey}`}
              initialTime={blackTime}
              isActive={activeTimer === "black"}
              player="black"
              onTimeUp={() => handleTimeUp("black")}
            />
          </div>

          {/* Center */}
          <div className="lg:col-span-6 space-y-6">
            <GameStatus status={gameStatus} currentTurn={currentTurn} winner={winner} reason={winner ? gameOverReason : undefined} />
            <ChessBoard game={gameRef.current} onMove={handleMove} playerColor="white" />
            
            {/* WHITE TIMER — NOW WITH key= FOR FULL RESET */}
            <GameTimer
              key={`white-${gameKey}`}
              initialTime={whiteTime}
              isActive={activeTimer === "white"}
              player="white"
              onTimeUp={() => handleTimeUp("white")}
            />
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