import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

interface PauseButtonProps {
  isPaused: boolean;
  onTogglePause: () => void;
  disabled?: boolean;
}

export const PauseButton = ({
  isPaused,
  onTogglePause,
  disabled,
}: PauseButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onTogglePause}
      disabled={disabled}
      className="flex items-center gap-2 font-semibold border-2 hover:bg-primary/10 transition-all duration-300"
    >
      {isPaused ? (
        <>
          <Play className="w-4 h-4 text-green-500" />
          Resume
        </>
      ) : (
        <>
          <Pause className="w-4 h-4 text-yellow-500" />
          Pause
        </>
      )}
    </Button>
  );
};
