import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, Play, Settings } from "lucide-react";

interface GameControlsProps {
  onNewGame: () => void;
  onToggleSettings: () => void;
  gameMode: "human-vs-human" | "human-vs-computer";
  onGameModeChange: (mode: "human-vs-human" | "human-vs-computer") => void;
  difficulty: "easy" | "medium" | "hard";
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard") => void;
  timeControl: "blitz-3" | "blitz-5" | "rapid-10" | "classical-30";
  onTimeControlChange: (control: "blitz-3" | "blitz-5" | "rapid-10" | "classical-30") => void;
}

export const GameControls = ({
  onNewGame,
  onToggleSettings,
  gameMode,
  onGameModeChange,
  difficulty,
  onDifficultyChange,
  timeControl,
  onTimeControlChange,
}: GameControlsProps) => {
  return (
    <Card className="p-4 bg-card border-border space-y-4">
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Game Mode</label>
          <Select value={gameMode} onValueChange={onGameModeChange}>
            <SelectTrigger className="bg-muted border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="human-vs-human">Human vs Human</SelectItem>
              <SelectItem value="human-vs-computer">Human vs Computer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {gameMode === "human-vs-computer" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Difficulty</label>
            <Select value={difficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger className="bg-muted border-border">
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

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Time Control</label>
          <Select value={timeControl} onValueChange={onTimeControlChange}>
            <SelectTrigger className="bg-muted border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blitz-3">Blitz (3+0)</SelectItem>
              <SelectItem value="blitz-5">Blitz (5+0)</SelectItem>
              <SelectItem value="rapid-10">Rapid (10+0)</SelectItem>
              <SelectItem value="classical-30">Classical (30+0)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onNewGame} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Play className="mr-2 h-4 w-4" />
          New Game
        </Button>
        <Button onClick={onToggleSettings} variant="outline" size="icon" className="border-border">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
