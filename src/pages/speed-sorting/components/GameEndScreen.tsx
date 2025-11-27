import { Button } from "@/components/ui/button";
import { formatTime } from "../hooks/useSpeedSortingGame";

interface GameEndScreenProps {
  finalTime: number;
  totalWords: number;
  incorrectAttempts: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export function GameEndScreen({
  finalTime,
  totalWords,
  incorrectAttempts,
  onPlayAgain,
  onBackToHome,
}: GameEndScreenProps) {
  return (
    <div className="w-full bg-slate-50 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Congratulations!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          You've completed the Speed Sorting game!
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatTime(finalTime)}
            </div>
            <div className="text-sm text-blue-500">Total Time</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {totalWords}
            </div>
            <div className="text-sm text-green-500">Words Completed</div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {incorrectAttempts}
            </div>
            <div className="text-sm text-red-500">Incorrect Attempts</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onPlayAgain} className="w-full" size="lg">
            Play Again
          </Button>
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
