import { ArrowRightLeft } from "lucide-react";

interface MoveCounterProps {
  count: number;
}

export const MoveCounter = ({ count }: MoveCounterProps) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-slate-700 shadow-xl">
      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <ArrowRightLeft className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Moves
        </span>
        <span className="text-2xl font-bold text-white tabular-nums">
          {count}
        </span>
      </div>
    </div>
  );
};
