import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Puzzle, Users, Clock } from "lucide-react";
import type { IPuzzleGame, Difficulty } from "../types/puzzle.types";

interface PuzzleCardProps {
  puzzle: IPuzzleGame;
  onClick: () => void;
}

const difficultyConfig: Record<
  Difficulty,
  { label: string; color: string; bgColor: string }
> = {
  easy: {
    label: "Easy",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20 border-emerald-500/30",
  },
  medium: {
    label: "Medium",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20 border-amber-500/30",
  },
  hard: {
    label: "Hard",
    color: "text-rose-400",
    bgColor: "bg-rose-500/20 border-rose-500/30",
  },
};

export const PuzzleCard = ({ puzzle, onClick }: PuzzleCardProps) => {
  const difficulty =
    difficultyConfig[puzzle.difficulty] || difficultyConfig.easy;
  const imageUrl = puzzle.thumbnail_image
    ? `${import.meta.env.VITE_API_URL as string}/${puzzle.thumbnail_image}`
    : "";

  return (
    <Card
      className="group cursor-pointer overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={puzzle.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Puzzle className="w-16 h-16 text-white/50" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

          {/* Difficulty badge */}
          <Badge
            className={`absolute top-3 right-3 ${difficulty.bgColor} ${difficulty.color} border font-semibold`}
          >
            {difficulty.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1">
          {puzzle.name}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 min-h-[2.5rem]">
          {puzzle.description ||
            "Complete the puzzle by arranging all pieces correctly!"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{puzzle.total_played || 0} plays</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>
            {puzzle.difficulty === "easy"
              ? "5 min"
              : puzzle.difficulty === "medium"
                ? "10 min"
                : "15 min"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
