import { CategoryBuckets } from "./components/CategoryBuckets";
import { CountdownScreen } from "./components/CountdownScreen";
import { ExitDialog } from "./components/ExitDialog";
import { GameEndScreen } from "./components/GameEndScreen";
import { GameHeader } from "./components/GameHeader";
import { StartScreen } from "./components/StartScreen";
import { WordCardsAnimation } from "./components/WordCardsAnimation";
import {
  getScrollAnimation,
  mockCategories,
  useSpeedSortingGame,
} from "./hooks/useSpeedSortingGame";

export default function SpeedSorting() {
  const game = useSpeedSortingGame();
  const scrollAnimation = getScrollAnimation();

  if (game.gameEnded) {
    return (
      <>
        <style>{scrollAnimation}</style>
        <GameEndScreen
          finalTime={game.finalTime}
          totalWords={game.totalWords}
          incorrectAttempts={game.incorrectAttempts}
          onPlayAgain={game.resetGame}
          onBackToHome={() => (window.location.href = "/")}
        />
      </>
    );
  }

  return (
    <>
      <style>{scrollAnimation}</style>
      <div className="w-full bg-slate-50 min-h-screen flex flex-col">
        <GameHeader
          timer={game.timer}
          score={game.score}
          onExit={() => game.setShowExit(true)}
        />

        <div className="w-full h-full p-8 flex justify-center items-center">
          <div className="max-w-3xl w-full space-y-6">
            <div className="bg-white w-full p-8 text-center space-y-6 rounded-xl border shadow-sm">
              {game.gameState === "waiting" && (
                <StartScreen onStart={game.startGame} />
              )}

              {game.gameState === "countdown" && (
                <CountdownScreen countdown={game.countdown} />
              )}

              {game.gameState === "playing" && (
                <>
                  <WordCardsAnimation
                    words={game.words}
                    speed={game.speed}
                    draggedItem={game.draggedItem}
                    onDragStart={game.handleDragStart}
                    onDragEnd={game.handleDragEnd}
                  />

                  <CategoryBuckets
                    categories={mockCategories}
                    hoveredCategory={game.hoveredCategory}
                    dropFeedback={game.dropFeedback}
                    onDragOver={game.handleDragOver}
                    onDragEnter={game.handleDragEnter}
                    onDragLeave={game.handleDragLeave}
                    onDrop={game.handleDrop}
                  />

                  <div className="text-lg font-bold text-gray-900">
                    {game.completedWords} of {game.totalWords} words completed
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <ExitDialog
          isOpen={game.showExit}
          onCancel={() => game.setShowExit(false)}
          onConfirm={() => window.location.reload()}
        />
      </div>
    </>
  );
}
