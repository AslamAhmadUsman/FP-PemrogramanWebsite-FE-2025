// src/pages/crossword/PlayCrossword.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { ICrosswordGameData, ICrosswordCell } from "./types";

export default function PlayCrossword() {
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<ICrosswordGameData | null>(null);
  const [gridMatrix, setGridMatrix] = useState<ICrosswordCell[][]>([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);

  // --- MOCK DATA (Pura-pura data dari Backend) ---
  useEffect(() => {
    // Simulasi loading
    setTimeout(() => {
      const mockData: ICrosswordGameData = {
        title: "Web Dev Basics (Mock)",
        grid_rows: 5,
        grid_cols: 5,
        // Backend mengirim cells sebagai Flat Array
        cells: [
          // Baris 0
          { x: 0, y: 0, is_black: true },
          { x: 1, y: 0, is_black: true },
          { x: 2, y: 0, is_black: false, number: 1, value: "R" },
          { x: 3, y: 0, is_black: true },
          { x: 4, y: 0, is_black: true },
          // Baris 1
          { x: 0, y: 1, is_black: false, number: 2, value: "A" },
          { x: 1, y: 1, is_black: false, value: "X" },
          { x: 2, y: 1, is_black: false, value: "I" },
          { x: 3, y: 1, is_black: false, value: "O" },
          { x: 4, y: 1, is_black: false, value: "S" },
          // Baris 2
          { x: 0, y: 2, is_black: true },
          { x: 1, y: 2, is_black: true },
          { x: 2, y: 2, is_black: false, value: "A" },
          { x: 3, y: 2, is_black: true },
          { x: 4, y: 2, is_black: true },
          // Baris 3
          { x: 0, y: 3, is_black: true },
          { x: 1, y: 3, is_black: true },
          { x: 2, y: 3, is_black: false, value: "C" },
          { x: 3, y: 3, is_black: true },
          { x: 4, y: 3, is_black: true },
          // Baris 4
          { x: 0, y: 4, is_black: true },
          { x: 1, y: 4, is_black: true },
          { x: 2, y: 4, is_black: false, value: "T" },
          { x: 3, y: 4, is_black: true },
          { x: 4, y: 4, is_black: true },
        ],
        clues: {
          across: [
            {
              number: 2,
              question: "HTTP Client Library",
              answer: "AXIOS",
              length: 5,
              start_x: 0,
              start_y: 1,
            },
          ],
          down: [
            {
              number: 1,
              question: "JS Framework by Meta",
              answer: "REACT",
              length: 5,
              start_x: 2,
              start_y: 0,
            },
          ],
        },
      };

      // Transform Flat Array -> Matrix 2D
      const matrix: ICrosswordCell[][] = Array.from(
        { length: mockData.grid_rows },
        () => [],
      );

      // Init array kosong
      for (let r = 0; r < mockData.grid_rows; r++) {
        for (let c = 0; c < mockData.grid_cols; c++) {
          matrix[r][c] = { x: c, y: r, is_black: true };
        }
      }

      // Isi data
      mockData.cells.forEach((cell) => {
        if (cell.y < mockData.grid_rows && cell.x < mockData.grid_cols) {
          matrix[cell.y][cell.x] = { ...cell, userInput: "" };
        }
      });

      setGridMatrix(matrix);
      setGameData(mockData);
      setLoading(false);
    }, 1000); // Delay 1 detik
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (r: number, c: number, val: string) => {
    const newVal = val.slice(-1).toUpperCase();
    const newGrid = [...gridMatrix];
    newGrid[r][c] = { ...newGrid[r][c], userInput: newVal };
    setGridMatrix(newGrid);
  };

  const handleFinish = () => {
    toast.success("Game Selesai! (Mock Submission)");
    navigate("/");
  };

  if (loading || !gameData)
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4">
      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Exit
        </Button>
        <Typography variant="h3">{gameData.title}</Typography>
        <div className="font-mono text-xl font-bold bg-white px-3 py-1 rounded border">
          {new Date(timer * 1000).toISOString().substr(11, 8)}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
        {/* GRID AREA */}
        <Card className="p-6 flex-1 flex justify-center items-center bg-white shadow-md overflow-auto">
          <div
            className="grid gap-1 bg-slate-800 border-4 border-slate-800"
            style={{
              gridTemplateColumns: `repeat(${gameData.grid_cols}, minmax(40px, 1fr))`,
            }}
          >
            {gridMatrix.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white"
                >
                  {cell.is_black ? (
                    <div className="w-full h-full bg-slate-800" />
                  ) : (
                    <div className="relative w-full h-full">
                      {cell.number && (
                        <span className="absolute top-0.5 left-0.5 text-[9px] sm:text-[10px] font-bold text-slate-500 z-10 pointer-events-none">
                          {cell.number}
                        </span>
                      )}
                      <Input
                        className="w-full h-full p-0 text-center font-bold uppercase text-xl sm:text-2xl border-slate-300 rounded-none focus:ring-2 focus:ring-inset focus:ring-primary focus:border-primary"
                        maxLength={1}
                        value={cell.userInput}
                        onChange={(e) =>
                          handleInputChange(rowIndex, colIndex, e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        </Card>

        {/* CLUES AREA */}
        <Card className="w-full lg:w-1/3 p-6 h-[600px] overflow-y-auto flex flex-col gap-6">
          <div>
            <Typography variant="h4" className="border-b pb-2 mb-3">
              Mendatar
            </Typography>
            <ul className="space-y-3">
              {gameData.clues.across.map((clue) => (
                <li key={`a-${clue.number}`} className="text-sm">
                  <span className="font-bold mr-2">#{clue.number}</span>
                  {clue.question}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Typography variant="h4" className="border-b pb-2 mb-3">
              Menurun
            </Typography>
            <ul className="space-y-3">
              {gameData.clues.down.map((clue) => (
                <li key={`d-${clue.number}`} className="text-sm">
                  <span className="font-bold mr-2">#{clue.number}</span>
                  {clue.question}
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={handleFinish} className="mt-auto w-full">
            Selesai
          </Button>
        </Card>
      </div>
    </div>
  );
}
