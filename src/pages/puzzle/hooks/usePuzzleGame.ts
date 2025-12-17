import { useState, useCallback, useRef } from "react";
import type {
  IPuzzlePiece,
  GameState,
  Difficulty,
  IPuzzleStartResponse,
} from "../types/puzzle.types";
import { puzzleApi } from "../services/puzzleApi";
import { useTimer } from "./useTimer";

interface UsePuzzleGameProps {
  gameId: string;
}

export const usePuzzleGame = ({ gameId }: UsePuzzleGameProps) => {
  const [gameState, setGameState] = useState<GameState>("lobby");
  const [pieces, setPieces] = useState<IPuzzlePiece[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [sessionData, setSessionData] = useState<IPuzzleStartResponse | null>(
    null,
  );
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const finishingRef = useRef(false);

  const getTimeLimit = useCallback((diff: Difficulty): number => {
    switch (diff) {
      case "easy":
        return 300;
      case "medium":
        return 600;
      case "hard":
        return 900;
      default:
        return 300;
    }
  }, []);

  const getGridSize = useCallback((diff: Difficulty): number => {
    switch (diff) {
      case "easy":
        return 3;
      case "medium":
        return 4;
      case "hard":
        return 5;
      default:
        return 3;
    }
  }, []);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (!finishingRef.current) {
      finishingRef.current = true;
      setGameState("finished");
    }
  }, []);

  const timer = useTimer({
    initialTime: getTimeLimit(difficulty),
    onTimeUp: handleTimeUp,
  });

  // Create shuffled puzzle pieces
  const createPieces = useCallback(
    (rows: number, cols: number): IPuzzlePiece[] => {
      const total = rows * cols;
      const newPieces: IPuzzlePiece[] = [];

      for (let i = 0; i < total; i++) {
        newPieces.push({
          id: i,
          correctPosition: i,
          currentPosition: i,
          imageX: (i % cols) * (100 / cols),
          imageY: Math.floor(i / cols) * (100 / rows),
        });
      }

      // Fisher-Yates shuffle for currentPosition
      const positions = newPieces.map((_, i) => i);
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      newPieces.forEach((piece, index) => {
        piece.currentPosition = positions[index];
      });

      return newPieces;
    },
    [],
  );

  // Check if puzzle is solved
  const checkWin = useCallback((currentPieces: IPuzzlePiece[]): boolean => {
    return currentPieces.every(
      (piece) => piece.currentPosition === piece.correctPosition,
    );
  }, []);

  // Finish game
  const handleFinish = useCallback(
    async (currentMoveCount: number) => {
      if (finishingRef.current) return;
      finishingRef.current = true;

      timer.pause();
      setGameState("finished");

      if (!sessionData) return;

      try {
        const result = await puzzleApi.finishGame({
          gameId,
          sessionId: sessionData.sessionId,
          moveCount: currentMoveCount,
          timeTaken: timer.getElapsedTime(),
        });
        setScore(result.score);
      } catch (err) {
        console.error("Failed to finish game:", err);
      }
    },
    [gameId, sessionData, timer],
  );

  // Start game
  const startGame = useCallback(
    async (selectedDifficulty: Difficulty) => {
      setIsLoading(true);
      setError(null);
      finishingRef.current = false;

      try {
        const response = await puzzleApi.startGame(gameId, selectedDifficulty);
        setSessionData(response);
        setDifficulty(selectedDifficulty);

        const gridSize = getGridSize(selectedDifficulty);
        const newPieces = createPieces(gridSize, gridSize);
        setPieces(newPieces);
        setMoveCount(0);
        setGameState("playing");
        timer.reset(getTimeLimit(selectedDifficulty));
        timer.start();
      } catch (err) {
        setError("Failed to start game");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [gameId, getGridSize, createPieces, getTimeLimit, timer],
  );

  // Swap two pieces
  const swapPieces = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (gameState !== "playing" || finishingRef.current) return;

      setPieces((prev) => {
        const newPieces = [...prev];
        const fromPiece = newPieces.find(
          (p) => p.currentPosition === fromIndex,
        );
        const toPiece = newPieces.find((p) => p.currentPosition === toIndex);

        if (fromPiece && toPiece) {
          fromPiece.currentPosition = toIndex;
          toPiece.currentPosition = fromIndex;
        }

        const newMoveCount = moveCount + 1;
        setMoveCount(newMoveCount);

        // Check win after swap
        if (checkWin(newPieces)) {
          setTimeout(() => {
            void handleFinish(newMoveCount);
          }, 500);
        }

        return newPieces;
      });
    },
    [gameState, moveCount, checkWin, handleFinish],
  );

  // Pause game
  const pauseGame = useCallback(() => {
    timer.pause();
    setGameState("paused");
  }, [timer]);

  // Resume game
  const resumeGame = useCallback(() => {
    timer.start();
    setGameState("playing");
  }, [timer]);

  // Exit game
  const exitGame = useCallback(async () => {
    timer.pause();

    if (sessionData) {
      try {
        await puzzleApi.finishGame({
          gameId,
          sessionId: sessionData.sessionId,
          moveCount: 0,
          timeTaken: 0,
        });
      } catch (err) {
        console.error("Failed to exit game:", err);
      }
    }
  }, [gameId, sessionData, timer]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState("lobby");
    setPieces([]);
    setMoveCount(0);
    setSessionData(null);
    setScore(null);
    setError(null);
    finishingRef.current = false;
  }, []);

  return {
    // State
    gameState,
    pieces,
    moveCount,
    sessionData,
    difficulty,
    score,
    isLoading,
    error,
    timer,

    // Actions
    startGame,
    swapPieces,
    pauseGame,
    resumeGame,
    handleFinish,
    exitGame,
    setDifficulty,
    resetGame,

    // Helpers
    getGridSize,
    getTimeLimit,
  };
};
