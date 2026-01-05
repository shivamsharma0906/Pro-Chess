// src/components/ui/GameControls.tsx
import { GameGuide } from "@/components/GameGuide";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pause, Play } from "lucide-react";

interface GameControlsProps {
  onNewGame: () => void;
  onToggleSettings: () => void;
  gameMode: "human-vs-human" | "human-vs-computer";
  onGameModeChange: (mode: "human-vs-human" | "human-vs-computer") => void;
  difficulty: "easy" | "medium" | "hard";
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard") => void;
  timeControl: "blitz-3" | "blitz-5" | "rapid-10" | "classical-30" | "unlimited";
  onTimeControlChange: (control: "blitz-3" | "blitz-5" | "rapid-10" | "classical-30" | "unlimited") => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isGameActive: boolean;
}

export const GameControls = ({
  onNewGame,
  gameMode,
  onGameModeChange,
  difficulty,
  onDifficultyChange,
  timeControl,
  onTimeControlChange,
  isPaused,
  onTogglePause,
  isGameActive,
}: GameControlsProps) => {
  return (
    <Card className="p-6 bg-card border border-border shadow-lg space-y-6">
      {/* Game Mode */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Game Mode</label>
        <Select value={gameMode} onValueChange={onGameModeChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="human-vs-human">Human vs Human (Local)</SelectItem>
            <SelectItem value="human-vs-computer">Human vs Computer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty — only when vs computer */}
      {gameMode === "human-vs-computer" && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          <label className="text-sm font-medium text-foreground">Difficulty</label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Time Control */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Time Control</label>
        <Select value={timeControl} onValueChange={onTimeControlChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blitz-3">Blitz (3+0)</SelectItem>
            <SelectItem value="blitz-5">Blitz (5+0)</SelectItem>
            <SelectItem value="rapid-10">Rapid (10+0)</SelectItem>
            <SelectItem value="classical-30">Classical (30+0)</SelectItem>
            <SelectItem value="unlimited">Freestyle (∞)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button onClick={onNewGame} size="lg" className="flex-1 font-semibold">
          <Play className="mr-2 h-5 w-5" />
          New Game
        </Button>

        {isGameActive && timeControl !== "unlimited" && (
          <Button onClick={onTogglePause} size="icon" variant="outline" title={isPaused ? "Resume" : "Pause"}>
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
        )}

        <GameGuide />
      </div>
    </Card>
  );
};

export default GameControls;