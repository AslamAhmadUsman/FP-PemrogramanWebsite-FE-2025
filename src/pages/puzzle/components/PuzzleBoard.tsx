import { useState, useCallback, useEffect, useRef } from "react";
import type { IPuzzlePiece } from "../types/puzzle.types";
import { PuzzlePiece } from "./PuzzlePiece";
import { Eye, EyeOff, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PuzzleBoardProps {
  pieces: IPuzzlePiece[];
  gridSize: number;
  imageUrl: string;
  onSwap: (fromIndex: number, toIndex: number) => void;
}

export const PuzzleBoard = ({
  pieces,
  gridSize,
  imageUrl,
  onSwap,
}: PuzzleBoardProps) => {
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [boardSize, setBoardSize] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive board size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Max size 500px, min size 280px, responsive to container
        const size = Math.min(Math.max(containerWidth - 32, 280), 500);
        setBoardSize(size);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const pieceSize = boardSize / gridSize;

  const handlePieceSelect = useCallback(
    (position: number) => {
      if (selectedPiece === null) {
        // First selection
        setSelectedPiece(position);
      } else if (selectedPiece === position) {
        // Deselect
        setSelectedPiece(null);
      } else {
        // Swap pieces
        onSwap(selectedPiece, position);
        setSelectedPiece(null);
      }
    },
    [selectedPiece, onSwap],
  );

  // Keyboard support for deselecting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPiece(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-6 w-full">
      {/* Control buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 border-2 border-slate-600 hover:border-violet-500 transition-all"
        >
          {showPreview ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {showPreview ? "Hide" : "Show"} Preview
        </Button>
      </div>

      {/* Preview image */}
      {showPreview && (
        <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="absolute -inset-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl blur-lg opacity-30" />
          <div className="relative rounded-lg overflow-hidden border-2 border-violet-500/50 shadow-xl">
            <img
              src={imageUrl}
              alt="Puzzle preview"
              className="w-48 h-48 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Maximize2 className="w-8 h-8 text-white/80" />
            </div>
          </div>
        </div>
      )}

      {/* Puzzle board */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 rounded-2xl blur-xl opacity-20 animate-pulse" />

        {/* Board container */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 shadow-2xl border border-slate-700">
          {/* Grid background */}
          <div
            className="relative bg-slate-950 rounded-lg overflow-hidden"
            style={{ width: `${boardSize}px`, height: `${boardSize}px` }}
          >
            {/* Grid lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${pieceSize}px ${pieceSize}px`,
              }}
            />

            {/* Puzzle pieces */}
            {pieces.map((piece) => (
              <PuzzlePiece
                key={piece.id}
                piece={piece}
                gridSize={gridSize}
                imageUrl={imageUrl}
                pieceSize={pieceSize}
                isSelected={selectedPiece === piece.currentPosition}
                isDragging={false}
                onSelect={() => handlePieceSelect(piece.currentPosition)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center space-y-1">
        <p className="text-sm text-slate-400">
          {selectedPiece !== null
            ? "🎯 Now click another piece to swap!"
            : "👆 Click a piece to select it"}
        </p>
        <p className="text-xs text-slate-500">
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300 text-xs">
            Esc
          </kbd>{" "}
          to deselect
        </p>
      </div>
    </div>
  );
};
