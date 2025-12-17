import type { IPuzzlePiece } from "../types/puzzle.types";

interface PuzzlePieceProps {
  piece: IPuzzlePiece;
  gridSize: number;
  imageUrl: string;
  pieceSize: number;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
}

export const PuzzlePiece = ({
  piece,
  gridSize,
  imageUrl,
  pieceSize,
  isSelected,
  isDragging,
  onSelect,
}: PuzzlePieceProps) => {
  const row = Math.floor(piece.currentPosition / gridSize);
  const col = piece.currentPosition % gridSize;

  return (
    <div
      className={`
        absolute cursor-pointer transition-all duration-200 rounded-sm overflow-hidden
        ${isSelected ? "ring-4 ring-violet-500 ring-offset-2 ring-offset-slate-900 z-20 scale-105" : ""}
        ${isDragging ? "opacity-50 scale-95" : ""}
        hover:brightness-110 hover:z-10
      `}
      style={{
        width: `${pieceSize}px`,
        height: `${pieceSize}px`,
        left: `${col * pieceSize}px`,
        top: `${row * pieceSize}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${pieceSize * gridSize}px ${pieceSize * gridSize}px`,
        backgroundPosition: `-${(piece.imageX * pieceSize * gridSize) / 100}px -${(piece.imageY * pieceSize * gridSize) / 100}px`,
        boxShadow: isSelected
          ? "0 10px 25px rgba(139, 92, 246, 0.4)"
          : "0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
      onClick={onSelect}
    >
      {/* Subtle border effect */}
      <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none" />

      {/* Correct position indicator (only in dev mode if needed) */}
      {piece.currentPosition === piece.correctPosition && (
        <div className="absolute top-1 left-1 w-2 h-2 bg-emerald-500 rounded-full opacity-50" />
      )}
    </div>
  );
};
