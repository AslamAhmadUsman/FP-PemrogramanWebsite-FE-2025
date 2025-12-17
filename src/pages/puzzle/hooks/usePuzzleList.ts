import { useState, useEffect, useCallback } from "react";
import { puzzleApi } from "../services/puzzleApi";
import type { IPuzzleGame, Difficulty } from "../types/puzzle.types";

interface UsePuzzleListResult {
  puzzles: IPuzzleGame[];
  isLoading: boolean;
  error: string | null;
  selectedDifficulty: Difficulty | undefined;
  setSelectedDifficulty: (difficulty: Difficulty | undefined) => void;
  refetch: () => Promise<void>;
}

export const usePuzzleList = (): UsePuzzleListResult => {
  const [puzzles, setPuzzles] = useState<IPuzzleGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | undefined
  >(undefined);

  const fetchPuzzles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await puzzleApi.getList(selectedDifficulty);
      setPuzzles(data);
    } catch (err) {
      setError("Failed to fetch puzzles");
      console.error("Error fetching puzzles:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDifficulty]);

  useEffect(() => {
    void fetchPuzzles();
  }, [fetchPuzzles]);

  return {
    puzzles,
    isLoading,
    error,
    selectedDifficulty,
    setSelectedDifficulty,
    refetch: fetchPuzzles,
  };
};
