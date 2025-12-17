import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { puzzleApi } from "../services/puzzleApi";
import { usePuzzleGame } from "../hooks/usePuzzleGame";
import { DifficultySelector } from "../components/DifficultySelector";
import { PuzzleBoard } from "../components/PuzzleBoard";
import { ExitButton } from "../components/ExitButton";
import { PauseButton } from "../components/PauseButton";
import { PauseOverlay } from "../components/PauseOverlay";
import { GameTimer } from "../components/GameTimer";
import { MoveCounter } from "../components/MoveCounter";
import { GameResult } from "../components/GameResult";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Puzzle, Loader2, AlertCircle } from "lucide-react";
import type { IPuzzleGame } from "../types/puzzle.types";

export default function PuzzleGamePage() {
  const { id: gameId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [puzzleData, setPuzzleData] = useState<IPuzzleGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    gameState,
    pieces,
    moveCount,
    sessionData,
    difficulty,
    score,
    isLoading,
    timer,
    startGame,
    swapPieces,
    pauseGame,
    resumeGame,
    resetGame,
    getGridSize,
    getTimeLimit,
  } = usePuzzleGame({ gameId: gameId! });

  useEffect(() => {
    const fetchPuzzle = async () => {
      if (!gameId) {
        navigate("/puzzle");
        return;
      }

      try {
        const data = await puzzleApi.getById(gameId);
        setPuzzleData(data);
      } catch (error) {
        console.error("Failed to fetch puzzle:", error);
        setFetchError("Failed to load puzzle. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void fetchPuzzle();
  }, [gameId, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-violet-500 animate-spin" />
          <p className="text-slate-400 text-lg">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError || !puzzleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Puzzle Not Found
          </h1>
          <p className="text-slate-400 mb-6">
            {fetchError || "The puzzle you are looking for does not exist."}
          </p>
          <Button
            onClick={() => navigate("/puzzle")}
            className="bg-gradient-to-r from-violet-500 to-purple-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Puzzles
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = sessionData?.gameJson?.imageUrl
    ? `${import.meta.env.VITE_API_URL as string}/${sessionData.gameJson.imageUrl}`
    : puzzleData.game_json?.imageUrl
      ? `${import.meta.env.VITE_API_URL as string}/${puzzleData.game_json.imageUrl}`
      : puzzleData.thumbnail_image
        ? `${import.meta.env.VITE_API_URL as string}/${puzzleData.thumbnail_image}`
        : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950">
      {/* Pause Overlay */}
      {gameState === "paused" && <PauseOverlay onResume={resumeGame} />}

      {/* Game Result Modal */}
      {gameState === "finished" && (
        <GameResult
          score={score}
          moveCount={moveCount}
          timeTaken={timer.getElapsedTime()}
          onPlayAgain={resetGame}
        />
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-slate-900/80 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {gameState === "lobby" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/puzzle")}
                  className="hover:bg-slate-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Puzzle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white line-clamp-1">
                    {puzzleData.name}
                  </h1>
                  <p className="text-sm text-slate-400 line-clamp-1">
                    {puzzleData.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Game Controls - only show during playing/paused */}
            {(gameState === "playing" || gameState === "paused") &&
              sessionData && (
                <div className="flex items-center gap-3">
                  <PauseButton
                    isPaused={gameState === "paused"}
                    onTogglePause={
                      gameState === "paused" ? resumeGame : pauseGame
                    }
                  />
                  <ExitButton
                    gameId={gameId!}
                    sessionId={sessionData.sessionId}
                  />
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Lobby State */}
        {gameState === "lobby" && (
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Puzzle Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-2xl opacity-20" />
              <div className="relative aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={puzzleData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                    <Puzzle className="w-24 h-24 text-white/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Select Difficulty
              </h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Choose your challenge level. Higher difficulty means more pieces
                and less time!
              </p>
            </div>

            <DifficultySelector onSelect={startGame} isLoading={isLoading} />
          </div>
        )}

        {/* Playing State */}
        {(gameState === "playing" || gameState === "paused") && sessionData && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <GameTimer
                formattedTime={timer.formattedTime}
                timeLeft={timer.timeLeft}
                totalTime={getTimeLimit(difficulty)}
              />
              <MoveCounter count={moveCount} />
            </div>

            {/* Puzzle Board */}
            <div className="flex justify-center">
              <PuzzleBoard
                pieces={pieces}
                gridSize={getGridSize(difficulty)}
                imageUrl={imageUrl}
                onSwap={swapPieces}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
