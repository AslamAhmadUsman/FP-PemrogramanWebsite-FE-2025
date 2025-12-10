// src/pages/crossword/types.ts

// Format Cell sesuai Backend (X/Y)
export interface ICrosswordCell {
  x: number;
  y: number;
  is_black: boolean;
  number?: number;
  value?: string;
  is_locked?: boolean;
  userInput?: string; // Khusus Frontend: untuk menampung ketikan user
}

// Format Soal sesuai Backend
export interface ICrosswordClue {
  number: number;
  question: string;
  answer: string;
  length: number;
  start_x: number;
  start_y: number;
}

// Format Game Data Utama
export interface ICrosswordGameData {
  id?: string; // Optional buat mock
  title: string;
  grid_rows: number;
  grid_cols: number;
  cells: ICrosswordCell[]; // Backend mengirim array flat (bukan array 2D)
  clues: {
    across: ICrosswordClue[];
    down: ICrosswordClue[];
  };
}
