import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Timer, Grid3X3 } from "lucide-react";
import type { Difficulty } from "../types/puzzle.types";

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  isLoading?: boolean;
}

const difficulties: {
  value: Difficulty;
  label: string;
  grid: string;
  time: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  icon: string;
}[] = [
  {
    value: "easy",
    label: "Easy",
    grid: "3×3",
    time: "5 min",
    color: "text-emerald-400",
    bgGradient:
      "from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700",
    borderColor: "border-emerald-500/30 hover:border-emerald-400/50",
    icon: "🌱",
  },
  {
    value: "medium",
    label: "Medium",
    grid: "4×4",
    time: "10 min",
    color: "text-amber-400",
    bgGradient:
      "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
    borderColor: "border-amber-500/30 hover:border-amber-400/50",
    icon: "🔥",
  },
  {
    value: "hard",
    label: "Hard",
    grid: "5×5",
    time: "15 min",
    color: "text-rose-400",
    bgGradient: "from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700",
    borderColor: "border-rose-500/30 hover:border-rose-400/50",
    icon: "💀",
  },
];

export const DifficultySelector = ({
  onSelect,
  isLoading,
}: DifficultySelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {difficulties.map((diff) => (
        <Card
          key={diff.value}
          className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 ${diff.borderColor} group`}
          onClick={() => !isLoading && onSelect(diff.value)}
        >
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">{diff.icon}</div>
            <CardTitle
              className={`text-2xl font-bold ${diff.color} group-hover:scale-110 transition-transform`}
            >
              {diff.label}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Challenge Level
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Grid3X3 className="w-4 h-4" />
                <span className="font-semibold">{diff.grid}</span>
              </div>
              <div className="w-px h-4 bg-slate-600" />
              <div className="flex items-center gap-2 text-slate-300">
                <Timer className="w-4 h-4" />
                <span className="font-semibold">{diff.time}</span>
              </div>
            </div>

            <Button
              className={`w-full bg-gradient-to-r ${diff.bgGradient} text-white font-bold py-3 shadow-lg transition-all duration-300`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Starting...
                </span>
              ) : (
                "Start Game"
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
