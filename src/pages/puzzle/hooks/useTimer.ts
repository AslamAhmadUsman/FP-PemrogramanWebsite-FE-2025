import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerProps {
  initialTime: number; // dalam detik
  onTimeUp?: () => void;
}

export const useTimer = ({ initialTime, onTimeUp }: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep onTimeUp callback updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (newTime?: number) => {
      setTimeLeft(newTime ?? initialTime);
      setIsRunning(false);
    },
    [initialTime],
  );

  const getElapsedTime = useCallback(() => {
    return initialTime - timeLeft;
  }, [initialTime, timeLeft]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUpRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    timeLeft,
    isRunning,
    formattedTime: formatTime(timeLeft),
    start,
    pause,
    reset,
    getElapsedTime,
  };
};
