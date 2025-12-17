import { useNavigate } from "react-router-dom";
import { usePuzzleList } from "./hooks/usePuzzleList";
import { PuzzleCard } from "./components/PuzzleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Puzzle, ArrowLeft, Filter, Loader2 } from "lucide-react";
import type { Difficulty } from "./types/puzzle.types";

const difficultyOptions: { value: Difficulty | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function PuzzleListPage() {
  const navigate = useNavigate();
  const {
    puzzles,
    isLoading,
    error,
    selectedDifficulty,
    setSelectedDifficulty,
  } = usePuzzleList();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-lg bg-slate-900/80 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Puzzle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Puzzle Games</h1>
                  <p className="text-sm text-slate-400">
                    Choose a puzzle to play
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400 font-medium">
              Filter by Difficulty:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((option) => (
              <Button
                key={option.label}
                variant={
                  selectedDifficulty === option.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedDifficulty(option.value)}
                className={
                  selectedDifficulty === option.value
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-lg"
                    : "border-slate-600 hover:border-violet-500 hover:bg-slate-800"
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-4" />
            <p className="text-slate-400">Loading puzzles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-white mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-violet-500 to-purple-600"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && puzzles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mb-6">
              <Puzzle className="w-12 h-12 text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              No Puzzles Found
            </h2>
            <p className="text-slate-400 max-w-md">
              {selectedDifficulty
                ? `No ${selectedDifficulty} puzzles available. Try a different difficulty!`
                : "No puzzles are available at the moment. Check back later!"}
            </p>
          </div>
        )}

        {/* Puzzle Grid */}
        {!isLoading && !error && puzzles.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold text-white">
                Available Puzzles
              </h2>
              <Badge
                variant="secondary"
                className="bg-slate-700 text-slate-300"
              >
                {puzzles.length} {puzzles.length === 1 ? "puzzle" : "puzzles"}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {puzzles.map((puzzle) => (
                <PuzzleCard
                  key={puzzle.id}
                  puzzle={puzzle}
                  onClick={() => navigate(`/puzzle/${puzzle.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
