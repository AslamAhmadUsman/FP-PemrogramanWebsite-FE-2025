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
    <div className="mb-6 sm:mb-8 lg:mb-12 overflow-hidden">
      <div className="relative h-24 sm:h-32 lg:h-40">
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
              className={`rounded-lg sm:rounded-xl text-sm sm:text-lg lg:text-2xl font-semibold sm:font-bold transform transition-all select-none shrink-0 
                w-[120px] h-[80px] sm:w-[150px] sm:h-[100px] lg:w-[200px] lg:h-[140px] 
                flex items-center justify-center ${
                  !word.completed
                    ? `bg-white text-black border sm:border-2 border-gray-300 cursor-move shadow-sm sm:shadow-md ${
                        draggedItem
                          ? ""
                          : "hover:border-gray-500 hover:shadow-md sm:hover:shadow-lg hover:scale-105"
                      }`
                    : "bg-green-100 text-green-600 border sm:border-2 border-green-300 shadow-sm sm:shadow-md"
                }`}
              style={{
                opacity: draggedItem === word.id ? 0.3 : 1,
              }}
            >
              {word.completed ? (
                <Check className="w-4 h-4 sm:w-6 sm:h-6 lg:w-10 lg:h-10" />
              ) : (
                word.text
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
