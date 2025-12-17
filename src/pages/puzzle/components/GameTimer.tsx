import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface GameTimerProps {
  formattedTime: string;
  timeLeft: number;
  totalTime: number;
}

export const GameTimer = ({
  formattedTime,
  timeLeft,
  totalTime,
}: GameTimerProps) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = percentage < 20;
  const isCritical = percentage < 10;

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-slate-700 shadow-xl">
      <div className="flex items-center gap-2">
        <Clock
          className={cn(
            "w-5 h-5 transition-colors",
            isCritical
              ? "text-red-500 animate-pulse"
              : isLow
                ? "text-orange-500"
                : "text-emerald-400",
          )}
        />
        <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Time Left
        </span>
      </div>

      <div
        className={cn(
          "text-5xl font-mono font-bold transition-colors tabular-nums",
          isCritical && "text-red-500 animate-pulse",
          isLow && !isCritical && "text-orange-500",
          !isLow && !isCritical && "text-emerald-400",
        )}
        style={{
          textShadow: isCritical
            ? "0 0 20px rgba(239, 68, 68, 0.5)"
            : isLow
              ? "0 0 20px rgba(249, 115, 22, 0.3)"
              : "0 0 20px rgba(52, 211, 153, 0.3)",
        }}
      >
        {formattedTime}
      </div>

      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden shadow-inner">
        <div
          className={cn(
            "h-full transition-all duration-1000 rounded-full",
            isCritical
              ? "bg-gradient-to-r from-red-600 to-red-400"
              : isLow
                ? "bg-gradient-to-r from-orange-600 to-orange-400"
                : "bg-gradient-to-r from-emerald-600 to-emerald-400",
          )}
          style={{
            width: `${percentage}%`,
            boxShadow: isCritical ? "0 0 10px rgba(239, 68, 68, 0.5)" : "",
          }}
        />
      </div>
    </div>
  );
};
