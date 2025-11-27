import { Check } from "lucide-react";
import type { WordItem } from "../hooks/useSpeedSortingGame";

interface WordCardsAnimationProps {
  words: WordItem[];
  speed: number;
  draggedItem: string | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, wordId: string) => void;
  onDragEnd: () => void;
}

export function WordCardsAnimation({
  words,
  speed,
  draggedItem,
  onDragStart,
  onDragEnd,
}: WordCardsAnimationProps) {
  return (
    <div className="mb-8 overflow-hidden">
      <div className="relative h-28">
        <div
          className="flex gap-4 absolute whitespace-nowrap"
          style={{
            animation: `scroll-right ${speed}s linear infinite`,
            width: "max-content",
          }}
        >
          {[...words, ...words, ...words].map((word, index) => (
            <div
              key={`${word.id}-${index}`}
              draggable={!word.completed}
              onDragStart={
                !word.completed ? (e) => onDragStart(e, word.id) : undefined
              }
              onDragEnd={!word.completed ? onDragEnd : undefined}
              className={`rounded text-lg font-semibold transform transition-all select-none shrink-0 ${
                !word.completed
                  ? `bg-white text-black border border-gray-300 cursor-move ${
                      draggedItem ? "" : "hover:border-gray-500 hover:shadow-md"
                    }`
                  : "bg-green-100 text-green-600 border border-green-300"
              }`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "150px",
                height: "100px",
                opacity: draggedItem === word.id ? 0.3 : 1,
              }}
            >
              {word.completed ? <Check className="w-6 h-6" /> : word.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
