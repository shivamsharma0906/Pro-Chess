import { useState, useCallback, useEffect } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "@/components/ChessBoard";
import { MoveHistory } from "@/components/MoveHistory";
import { GameControls } from "@/components/GameControls";
import { GameTimer } from "@/components/GameTimer";
import { GameStatus } from "@/components/GameStatus";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<"human-vs-human" | "human-vs-computer">("human-vs-human");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [timeControl, setTimeControl] = useState<"blitz-3" | "blitz-5" | "rapid-10" | "classical-30">("blitz-5");
  const [gameStatus, setGameStatus] = useState<"playing" | "checkmate" | "stalemate" | "draw" | "check">("playing");
  const [winner, setWinner] = useState<"white" | "black" | "draw">();
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white");
  const [whiteTime, setWhiteTime] = useState(300); // 5 minutes in seconds
  const [blackTime, setBlackTime] = useState(300);
  const [isWhiteTimerActive, setIsWhiteTimerActive] = useState(false);
  const [isBlackTimerActive, setIsBlackTimerActive] = useState(false);
  const { toast } = useToast();

  const getTimeControlSeconds = (control: typeof timeControl) => {
    switch (control) {
      case "blitz-3":
        return 180;
      case "blitz-5":
        return 300;
      case "rapid-10":
        return 600;
      case "classical-30":
        return 1800;
    }
  };

  useEffect(() => {
    const time = getTimeControlSeconds(timeControl);
    setWhiteTime(time);
    setBlackTime(time);
  }, [timeControl]);

  const makeComputerMove = useCallback(() => {
    const gameCopy = new Chess(game.fen());
    const possibleMoves = gameCopy.moves({ verbose: true });

    if (possibleMoves.length === 0) return;

    let selectedMove;
    
    if (difficulty === "easy") {
      // Random move
      selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    } else if (difficulty === "medium") {
      // Prefer captures, otherwise random
      const captures = possibleMoves.filter(move => move.captured);
      selectedMove = captures.length > 0 
        ? captures[Math.floor(Math.random() * captures.length)]
        : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    } else {
      // Hard: Prefer checks, then captures, otherwise random
      const checks = possibleMoves.filter(move => {
        gameCopy.move(move);
        const isCheck = gameCopy.inCheck();
        gameCopy.undo();
        return isCheck;
      });
      const captures = possibleMoves.filter(move => move.captured);
      
      if (checks.length > 0) {
        selectedMove = checks[Math.floor(Math.random() * checks.length)];
      } else if (captures.length > 0) {
        selectedMove = captures[Math.floor(Math.random() * captures.length)];
      } else {
        selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      }
    }

    gameCopy.move(selectedMove);
    setGame(gameCopy);
    setMoveHistory([...moveHistory, selectedMove.san]);
    checkGameStatus(gameCopy);
    setCurrentTurn(gameCopy.turn() === "w" ? "white" : "black");
    
    // Toggle timers
    setIsBlackTimerActive(false);
    setIsWhiteTimerActive(true);
  }, [game, difficulty, moveHistory]);

  const checkGameStatus = (gameCopy: Chess) => {
    if (gameCopy.isCheckmate()) {
      setGameStatus("checkmate");
      setWinner(gameCopy.turn() === "w" ? "black" : "white");
      setIsWhiteTimerActive(false);
      setIsBlackTimerActive(false);
      toast({
        title: "Checkmate!",
        description: `${gameCopy.turn() === "w" ? "Black" : "White"} wins!`,
      });
    } else if (gameCopy.isStalemate()) {
      setGameStatus("stalemate");
      setWinner("draw");
      setIsWhiteTimerActive(false);
      setIsBlackTimerActive(false);
      toast({
        title: "Stalemate",
        description: "The game is a draw.",
      });
    } else if (gameCopy.isDraw()) {
      setGameStatus("draw");
      setWinner("draw");
      setIsWhiteTimerActive(false);
      setIsBlackTimerActive(false);
      toast({
        title: "Draw",
        description: "The game is a draw.",
      });
    } else if (gameCopy.inCheck()) {
      setGameStatus("check");
    } else {
      setGameStatus("playing");
    }
  };

  const onDrop = useCallback(
    (move: { from: string; to: string; promotion?: string }) => {
      const gameCopy = new Chess(game.fen());
      
      try {
        const result = gameCopy.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion || "q",
        });

        if (result) {
          setGame(gameCopy);
          setMoveHistory([...moveHistory, result.san]);
          checkGameStatus(gameCopy);
          const newTurn = gameCopy.turn() === "w" ? "white" : "black";
          setCurrentTurn(newTurn);

          // Toggle timers
          if (newTurn === "white") {
            setIsBlackTimerActive(false);
            setIsWhiteTimerActive(true);
          } else {
            setIsWhiteTimerActive(false);
            setIsBlackTimerActive(true);
          }

          // Computer move if needed
          if (gameMode === "human-vs-computer" && gameCopy.turn() === "b" && !gameCopy.isGameOver()) {
            setTimeout(() => makeComputerMove(), 500);
          }
        }
      } catch (error) {
        console.error("Invalid move:", error);
      }
    },
    [game, gameMode, makeComputerMove, moveHistory]
  );

  const handleNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setGameStatus("playing");
    setWinner(undefined);
    setCurrentTurn("white");
    const time = getTimeControlSeconds(timeControl);
    setWhiteTime(time);
    setBlackTime(time);
    setIsWhiteTimerActive(true);
    setIsBlackTimerActive(false);
    toast({
      title: "New Game",
      description: "A new game has started!",
    });
  };

  const handleTimeUp = (color: "white" | "black") => {
    setGameStatus("checkmate");
    setWinner(color === "white" ? "black" : "white");
    setIsWhiteTimerActive(false);
    setIsBlackTimerActive(false);
    toast({
      title: "Time's Up!",
      description: `${color === "white" ? "Black" : "White"} wins on time!`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Pro Chess</h1>
          <p className="text-muted-foreground">Master the Game of Kings</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-3 space-y-4 animate-slide-up">
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
            <GameTimer
              initialTime={blackTime}
              isActive={isBlackTimerActive}
              player="black"
              onTimeUp={() => handleTimeUp("black")}
            />
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-6 space-y-4 animate-fade-in">
            <GameStatus status={gameStatus} currentTurn={currentTurn} winner={winner} />
            <ChessBoard game={game} onMove={onDrop} playerColor="white" />
            <GameTimer
              initialTime={whiteTime}
              isActive={isWhiteTimerActive}
              player="white"
              onTimeUp={() => handleTimeUp("white")}
            />
          </div>

          {/* Right Panel - Move History */}
          <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <MoveHistory moves={moveHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
