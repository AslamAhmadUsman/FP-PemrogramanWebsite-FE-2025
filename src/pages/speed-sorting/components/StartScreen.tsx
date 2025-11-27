import { Button } from "@/components/ui/button";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">
        Speed Sorting Game
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        Drag the words to their correct categories as fast as you can!
      </p>
      <Button
        onClick={onStart}
        size="lg"
        className="px-8 py-4 text-xl font-semibold"
      >
        Start Game
      </Button>
    </div>
  );
}
