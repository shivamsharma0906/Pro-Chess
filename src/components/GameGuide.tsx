
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const GameGuide = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Game Guide">
                    <BookOpen className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground border-border">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">How to Play</DialogTitle>
                    <DialogDescription>
                        Welcome to Pro Chess! Here's a quick guide to get you started.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Game Modes</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li><strong>Human vs Human (Local):</strong> Play against a friend on the same device.</li>
                                <li><strong>Human vs Computer:</strong> Challenge our AI engine. Select difficulty from Easy to Hard.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Time Controls</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li><strong>Blitz:</strong> Fast paced games (3 or 5 minutes).</li>
                                <li><strong>Rapid:</strong> Moderate pace (10 minutes).</li>
                                <li><strong>Classical:</strong> Slow, strategic games (30 minutes).</li>
                                <li><strong>Freestyle:</strong> No timer! Play at your own leisure.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Controls</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li><strong>Move Pieces:</strong> Drag and drop pieces to valid squares.</li>
                                <li><strong>Pause Game:</strong> Need a break? Hit the Pause button to stop the timer (and piece movement).</li>
                                <li><strong>New Game:</strong> Start fresh anytime with the New Game button.</li>
                            </ul>
                        </section>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
