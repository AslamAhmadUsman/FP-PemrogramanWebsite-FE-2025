import { useEffect, useState } from "react";

// Types
export interface WordItem {
  id: string;
  text: string;
  correctCategory: string;
  completed?: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type GameState = "waiting" | "countdown" | "playing";

export interface DropFeedback {
  categoryId: string;
  isCorrect: boolean;
}

// Constants
export const mockCategories: Category[] = [
  { id: "colors", name: "Colours", color: "bg-blue-600" },
  { id: "numbers", name: "Numbers", color: "bg-green-600" },
  { id: "family", name: "Family", color: "bg-purple-600" },
];

export const mockWords: WordItem[] = [
  { id: "1", text: "seven", correctCategory: "numbers" },
  { id: "2", text: "two", correctCategory: "numbers" },
  { id: "3", text: "eleven", correctCategory: "numbers" },
  { id: "4", text: "four", correctCategory: "numbers" },
  { id: "5", text: "red", correctCategory: "colors" },
  { id: "6", text: "blue", correctCategory: "colors" },
  { id: "7", text: "green", correctCategory: "colors" },
  { id: "8", text: "mother", correctCategory: "family" },
  { id: "9", text: "father", correctCategory: "family" },
  { id: "10", text: "sister", correctCategory: "family" },
];

// Utility functions
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getScrollAnimation = () => `
  @keyframes scroll-right {
    0% { transform: translateX(-33.333%); }
    100% { transform: translateX(0); }
  }
  [data-dragging="true"] {
    border-color: #d1d5db !important;
    box-shadow: none !important;
  }
  [data-dragging="true"]:hover {
    border-color: #d1d5db !important;
    box-shadow: none !important;
    transform: none !important;
  }
`;

export function useSpeedSortingGame() {
  const [words, setWords] = useState<WordItem[]>(mockWords);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [dropFeedback, setDropFeedback] = useState<DropFeedback | null>(null);
  const [showExit, setShowExit] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [finalTime, setFinalTime] = useState(0);
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [countdown, setCountdown] = useState(3);

  const totalWords = mockWords.length;
  const completedWords = words.filter((w) => w.completed).length;
  const speed = 10;

  useEffect(() => {
    if (gameState !== "playing" || gameEnded) return;
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [gameState, gameEnded]);

  useEffect(() => {
    if (completedWords === totalWords && completedWords > 0 && !gameEnded) {
      setGameEnded(true);
      setFinalTime(timer);
    }
  }, [completedWords, totalWords, timer, gameEnded]);

  const startGame = () => {
    setGameState("countdown");
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState("playing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetGame = () => {
    setWords(mockWords);
    setScore(0);
    setTimer(0);
    setIncorrectAttempts(0);
    setGameEnded(false);
    setFinalTime(0);
    setGameState("waiting");
    setCountdown(3);
    setDraggedItem(null);
    setHoveredCategory(null);
    setDropFeedback(null);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    wordId: string,
  ) => {
    if (gameState !== "playing") {
      e.preventDefault();
      return;
    }
    setDraggedItem(wordId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setHoveredCategory(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    categoryId: string,
  ) => {
    e.preventDefault();
    if (draggedItem) {
      setHoveredCategory(categoryId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setHoveredCategory(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    categoryId: string,
  ) => {
    e.preventDefault();

    if (!draggedItem) return;

    const draggedWord = words.find((w) => w.id === draggedItem);
    if (!draggedWord) return;

    const isCorrect = draggedWord.correctCategory === categoryId;

    setDropFeedback({ categoryId, isCorrect });

    if (isCorrect) {
      setTimeout(() => {
        setWords((prev) =>
          prev.map((w) =>
            w.id === draggedItem ? { ...w, completed: true } : w,
          ),
        );
        setScore((prev) => prev + 1);
      }, 300);
    } else {
      setIncorrectAttempts((prev) => prev + 1);
    }

    setDraggedItem(null);
    setHoveredCategory(null);

    setTimeout(() => {
      setDropFeedback(null);
    }, 600);
  };

  return {
    // State
    words,
    score,
    timer,
    incorrectAttempts,
    draggedItem,
    hoveredCategory,
    dropFeedback,
    showExit,
    gameEnded,
    finalTime,
    gameState,
    countdown,
    totalWords,
    completedWords,
    speed,
    // Actions
    setShowExit,
    startGame,
    resetGame,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
}
