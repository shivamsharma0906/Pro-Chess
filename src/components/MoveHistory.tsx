// src/components/ui/MoveHistory.tsx
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveHistoryProps {
  moves: string[]; // SAN or simple move strings, alternating white/black
  className?: string;
  maxLines?: number;
}

/**
 * Renders move history as numbered pairs.
 * - Accepts moves as an array: [ "e4", "e5", "Nf3", "Nc6", ... ]
 * - Groups them into pairs: { number: 1, white: "e4", black: "e5" }
 */
export const MoveHistory: React.FC<MoveHistoryProps> = React.memo(
  ({ moves, className = "", maxLines = 500 }) => {
    const movePairs = useMemo(() => {
      const pairs: { number: number; white?: string; black?: string }[] = [];
      for (let i = 0; i < Math.min(moves.length, maxLines * 2); i += 2) {
        pairs.push({
          number: Math.floor(i / 2) + 1,
          white: moves[i],
          black: moves[i + 1],
        });
      }
      return pairs;
    }, [moves, maxLines]);

    return (
      <Card className={`p-4 bg-card border-border h-full ${className}`}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Move History</h3>

        {movePairs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No moves yet</div>
        ) : (
          <ScrollArea className="h-[500px]" aria-label="Move history scroll area">
            <ol className="space-y-1 list-none" role="list">
              {movePairs.map((pair) => {
                const whiteText = pair.white ?? "";
                const blackText = pair.black ?? "";
                // key: use move number + side to avoid duplicates
                return (
                  <li
                    key={`move-${pair.number}`}
                    className="flex items-center gap-3 font-mono text-sm py-1.5 px-2 rounded hover:bg-muted/50 transition-colors"
                    role="listitem"
                    aria-label={`Move ${pair.number}`}
                  >
                    <span className="text-muted-foreground w-8">{pair.number}.</span>

                    <div className="flex-1 min-w-0">
                      {/* white move */}
                      <div className="flex items-center gap-2">
                        <span className="text-foreground truncate" title={whiteText || ""}>
                          {whiteText || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* black move */}
                      <span
                        className="text-foreground truncate"
                        title={blackText || ""}
                        aria-hidden={!blackText}
                      >
                        {blackText || ""}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </ScrollArea>
        )}
      </Card>
    );
  }
);

export default MoveHistory;
