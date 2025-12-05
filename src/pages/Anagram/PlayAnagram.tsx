import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock,
  Check,
  Maximize,
  Minimize,
  Menu,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:4000/api/game/anagram";
const TOTAL_QUESTIONS_PLACEHOLDER = 15;

interface Question {
  correct_word: string;
  scrambled_letters: string[];
  image_url: string;
}

interface GamePlayData {
  game_id: string;
  questions: Question[];
}

// Letter bubble
const ScrambleLetterBubble: React.FC<{ letter: string }> = ({ letter }) => (
  <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg cursor-grab select-none">
    {letter}
  </div>
);

// Input bubble (Slot)
const InputSlotBubble: React.FC<{ guessLetter?: string }> = ({
  guessLetter,
}) => (
  <div className="w-16 h-16 border-4 border-dashed border-slate-300 rounded-full flex items-center justify-center font-bold text-2xl text-slate-800">
    {guessLetter ?? ""}
  </div>
);

const PlayAnagram = () => {
  const { id: game_id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- STATE DATA & UI ---
  const [gameData, setGameData] = useState<GamePlayData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State Game Logic
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [score] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // --- LOGIC STOPWATCH ---
  useEffect(() => {
    if (!isLoading) {
      const timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoading]);

  const formatTime = (t: number) => {
    const minutes = Math.floor(t / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (t % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const fetchGameData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/play/public`, {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load Anagram game data.");
      }

      setGameData(result.data);
    } catch (err: unknown) {
      console.error("Fetch Game Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error during data fetch.");
      }
    }
  };

  useEffect(() => {
    if (game_id) {
      fetchGameData(game_id);
    } else {
      setError("Game ID not found in URL.");
      setIsLoading(false);
    }
  }, [game_id]);

  // --- HANDLERS ---
  const handleExit = () => {
    if (
      window.confirm(
        "Are you sure you want to exit the game? Your current score will be lost.",
      )
    ) {
      navigate("/explore");
    }
  };

  const handleSkip = () => {
    if (gameData && currentQuestionIndex < gameData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setCurrentGuess([]); // Reset jawaban
    } else {
      alert("Game finished!");
      // TODO: Ganti /finish sesuai route yang sebenarnya (misalnya /anagram/result/:game_id)
      navigate("/finish");
    }
  };

  // --- RENDER DATA DINAMIS ---
  const currentQuestion = gameData?.questions[currentQuestionIndex];
  const totalQuestions =
    gameData?.questions.length || TOTAL_QUESTIONS_PLACEHOLDER;

  // --- LOADING & ERROR STATES ---
  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl text-slate-600">
        Loading Anagram Game...
      </div>
    );
  if (error || !gameData || !currentQuestion)
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center p-10 text-red-600 text-xl">
        <h2 className="mb-4 font-bold">Error Loading Game</h2>
        <p>{error || "Game data or current question not found."}</p>
        <Button onClick={() => navigate("/my-projects")} className="mt-6">
          Back to Projects
        </Button>
      </div>
    );

  const scrambledLetters = currentQuestion.scrambled_letters;
  const answerLength = currentQuestion.correct_word.length;

  return (
    <div
      className={`min-h-screen ${isFullScreen ? "fixed inset-0 z-50" : "relative"} bg-pink-50/20 flex flex-col justify-between items-center p-6 md:p-10 transition-all`}
    >
      {/* HEADER */}
      <div className="w-full max-w-2xl flex justify-between items-center text-slate-600">
        {/* Stopwatch */}
        <div className="flex items-center gap-2 font-mono text-xl">
          <Clock className="w-6 h-6 text-slate-500" />
          <span>{formatTime(timeElapsed)}</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 font-mono text-xl">
          <Check className="w-6 h-6 text-green-600" />
          <span className="font-bold text-green-700">{score}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center w-full max-w-md my-8">
        {/* Gambar Hint DINAMIS */}
        <div className="w-full h-48 bg-white/70 rounded-xl mb-10 flex items-center justify-center shadow-lg">
          <img
            // Gabung URL BE + path yang tersimpan di DB
            src={`http://localhost:4000${currentQuestion.image_url}`}
            alt="Question Hint"
            onError={(e) => (e.currentTarget.src = "/fallback.png")}
            className="max-h-full max-w-full object-contain rounded-xl p-2"
          />
        </div>

        {/* Slot Jawaban DINAMIS */}
        <div className="flex justify-center gap-4 mb-10">
          {Array.from({ length: answerLength }).map((_, i) => (
            <InputSlotBubble key={`slot-${i}`} guessLetter={currentGuess[i]} />
          ))}
        </div>

        {/* Huruf acak DINAMIS */}
        <div className="flex flex-wrap justify-center gap-3">
          {scrambledLetters.map((letter, i) => (
            <ScrambleLetterBubble key={`scramble-${i}`} letter={letter} />
          ))}
        </div>

        {/* CHECK BUTTON */}
        <div className="mt-8">
          <Button className="bg-green-600 hover:bg-green-700 font-bold">
            CHECK ANSWER
          </Button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full max-w-2xl flex justify-between items-end">
        {/* Exit */}
        <div
          onClick={handleExit}
          className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition cursor-pointer"
        >
          <Menu className="w-6 h-6" />
          <span className="hidden sm:inline">Exit Game</span>
        </div>

        {/* Page Counter DINAMIS */}
        <div className="flex items-center gap-3 text-lg font-semibold text-slate-700">
          <button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className="disabled:opacity-50"
          >
            <SkipForward className="w-6 h-6 rotate-180" />
          </button>
          <span>
            {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <button
            onClick={handleSkip}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="disabled:opacity-50"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Fullscreen */}
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="p-2 rounded-full text-slate-500 hover:text-slate-700"
        >
          {isFullScreen ? <Minimize /> : <Maximize />}
        </button>
      </div>
    </div>
  );
};

export default PlayAnagram;
