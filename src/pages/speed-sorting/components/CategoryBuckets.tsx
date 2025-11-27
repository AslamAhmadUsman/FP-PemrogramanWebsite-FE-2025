import type { Category, DropFeedback } from "../hooks/useSpeedSortingGame";

interface CategoryBucketsProps {
  categories: Category[];
  hoveredCategory: string | null;
  dropFeedback: DropFeedback | null;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, categoryId: string) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, categoryId: string) => void;
}

export function CategoryBuckets({
  categories,
  hoveredCategory,
  dropFeedback,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}: CategoryBucketsProps) {
  return (
    <div className="flex justify-center gap-6 mb-6">
      {categories.map((category) => (
        <div
          key={category.id}
          onDragOver={onDragOver}
          onDragEnter={(e) => onDragEnter(e, category.id)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, category.id)}
          className={`
            bg-white text-black border-2 rounded-lg px-8 py-6
            text-lg font-semibold text-center cursor-pointer
            transform transition-all duration-200 hover:scale-105
            ${
              dropFeedback?.categoryId === category.id
                ? dropFeedback.isCorrect
                  ? "scale-125 border-green-500 bg-green-100 shadow-xl"
                  : "scale-90 border-red-500 bg-red-100 shadow-xl"
                : hoveredCategory === category.id
                  ? "scale-110 border-blue-400 bg-blue-50 shadow-lg"
                  : "border-gray-300"
            }
          `}
          style={{
            minWidth: "150px",
            minHeight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
}
