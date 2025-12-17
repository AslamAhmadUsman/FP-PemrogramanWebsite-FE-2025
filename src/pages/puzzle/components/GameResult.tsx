import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  RotateCcw,
  Home,
  Clock,
  ArrowRightLeft,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameResultProps {
  score: number | null;
  moveCount: number;
  timeTaken: number;
  onPlayAgain: () => void;
}

export const GameResult = ({
  score,
  moveCount,
  timeTaken,
  onPlayAgain,
}: GameResultProps) => {
  const navigate = useNavigate();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreRating = (
    score: number | null,
  ): { stars: number; message: string } => {
    if (score === null) return { stars: 0, message: "No score" };
    if (score >= 800) return { stars: 3, message: "Perfect!" };
    if (score >= 500) return { stars: 2, message: "Great Job!" };
    return { stars: 1, message: "Good Try!" };
  };

  const rating = getScoreRating(score);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="max-w-md w-full bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border-2 border-yellow-500/30 shadow-2xl animate-in zoom-in-95 duration-300">
        <CardHeader className="text-center pb-2">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Trophy className="w-14 h-14 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
            🎉 Puzzle Completed!
          </CardTitle>
          <p className="text-slate-400 mt-2">{rating.message}</p>

          {/* Star Rating */}
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 transition-all duration-300 ${
                  star <= rating.stars
                    ? "text-yellow-400 fill-yellow-400 scale-110"
                    : "text-slate-600"
                }`}
                style={{ animationDelay: `${star * 0.2}s` }}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{score ?? "-"}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Score
              </p>
            </div>

            <div className="flex flex-col items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-2">
                <ArrowRightLeft className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{moveCount}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Moves
              </p>
            </div>

            <div className="flex flex-col items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">
                {formatTime(timeTaken)}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Time
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-2 border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-all duration-300"
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={onPlayAgain}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
