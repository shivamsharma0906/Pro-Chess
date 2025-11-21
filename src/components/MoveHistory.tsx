import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveHistoryProps {
  moves: string[];
}

export const MoveHistory = ({ moves }: MoveHistoryProps) => {
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <Card className="p-4 bg-card border-border h-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Move History</h3>
      <ScrollArea className="h-[500px]">
        <div className="space-y-1">
          {movePairs.map((pair) => (
            <div key={pair.number} className="flex items-center gap-3 font-mono text-sm py-1.5 px-2 rounded hover:bg-muted/50 transition-colors">
              <span className="text-muted-foreground w-8">{pair.number}.</span>
              <span className="text-foreground flex-1">{pair.white}</span>
              {pair.black && <span className="text-foreground flex-1">{pair.black}</span>}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
