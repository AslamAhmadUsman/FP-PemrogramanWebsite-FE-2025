import { Button } from "@/components/ui/button";
import { Play, Coffee } from "lucide-react";

interface PauseOverlayProps {
  onResume: () => void;
}

export const PauseOverlay = ({ onResume }: PauseOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 text-center shadow-2xl border border-slate-700 max-w-md mx-4 transform animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Coffee className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Game Paused
        </h2>

        <p className="text-slate-400 mb-8 text-lg">
          Take a break! Your progress is saved.
        </p>

        <Button
          onClick={onResume}
          size="lg"
          className="gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <Play className="w-6 h-6" />
          Resume Game
        </Button>
      </div>
    </div>
  );
};
