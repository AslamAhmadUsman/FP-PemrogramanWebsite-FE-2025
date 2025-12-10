// src/pages/crosswords/utils/generator.ts

export interface WordInput {
  answer: string;
  clue: string;
}

export interface PlacedWord {
  answer: string;
  clue: string;
  row: number;
  col: number;
  direction: "across" | "down";
  number: number;
}

// Ukuran Grid Virtual
const GRID_SIZE = 20;

export function generateCrosswordLayout(inputs: WordInput[]) {
  // 1. Bersihkan input
  const words = inputs
    .filter((i) => i.answer.trim().length > 0)
    .map((i) => ({
      ...i,
      answer: i.answer.toUpperCase().replace(/[^A-Z]/g, ""),
    }));

  if (words.length === 0) return { grid: [], placed: [] };

  // 2. Init Grid Kosong
  const grid: (string | null)[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
  const placedWords: PlacedWord[] = [];

  // 3. Urutkan kata terpanjang
  const sortedWords = [...words].sort(
    (a, b) => b.answer.length - a.answer.length,
  );

  // 4. Taruh kata pertama di tengah
  const firstWord = sortedWords[0];
  const startRow = Math.floor(GRID_SIZE / 2);
  const startCol = Math.floor((GRID_SIZE - firstWord.answer.length) / 2);

  placeWord(grid, firstWord.answer, startRow, startCol, "across");
  placedWords.push({
    ...firstWord,
    row: startRow,
    col: startCol,
    direction: "across",
    number: 1,
  });

  // 5. Coba pasang kata sisanya
  let clueCounter = 2;

  for (let i = 1; i < sortedWords.length; i++) {
    const word = sortedWords[i];

    // Scan grid
    outerLoop: for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const charOnGrid = grid[r][c];

        if (charOnGrid) {
          for (let charIdx = 0; charIdx < word.answer.length; charIdx++) {
            if (word.answer[charIdx] === charOnGrid) {
              // Coba pasang Vertikal (Down)
              const tryRowDown = r - charIdx;
              const tryColDown = c;
              if (canPlace(grid, word.answer, tryRowDown, tryColDown, "down")) {
                placeWord(grid, word.answer, tryRowDown, tryColDown, "down");
                placedWords.push({
                  ...word,
                  row: tryRowDown,
                  col: tryColDown,
                  direction: "down",
                  number: clueCounter++,
                });
                break outerLoop;
              }

              // Coba pasang Horizontal (Across)
              const tryRowAcross = r;
              const tryColAcross = c - charIdx;
              if (
                canPlace(
                  grid,
                  word.answer,
                  tryRowAcross,
                  tryColAcross,
                  "across",
                )
              ) {
                placeWord(
                  grid,
                  word.answer,
                  tryRowAcross,
                  tryColAcross,
                  "across",
                );
                placedWords.push({
                  ...word,
                  row: tryRowAcross,
                  col: tryColAcross,
                  direction: "across",
                  number: clueCounter++,
                });
                break outerLoop;
              }
            }
          }
        }
      }
    }
  }

  // 6. Crop Grid
  let minRow = GRID_SIZE,
    maxRow = 0,
    minCol = GRID_SIZE,
    maxCol = 0;
  let hasContent = false;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c]) {
        hasContent = true;
        if (r < minRow) minRow = r;
        if (r > maxRow) maxRow = r;
        if (c < minCol) minCol = c;
        if (c > maxCol) maxCol = c;
      }
    }
  }

  if (!hasContent) return { grid: [], placed: [] };

  const croppedGrid: (string | null)[][] = [];
  for (let r = minRow; r <= maxRow; r++) {
    const row = [];
    for (let c = minCol; c <= maxCol; c++) {
      row.push(grid[r][c]);
    }
    croppedGrid.push(row);
  }

  const finalPlacedWords = placedWords.map((pw) => ({
    ...pw,
    row: pw.row - minRow,
    col: pw.col - minCol,
  }));

  finalPlacedWords.sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });

  finalPlacedWords.forEach((pw, index) => {
    pw.number = index + 1;
  });

  return { grid: croppedGrid, placed: finalPlacedWords };
}

// PERBAIKAN: Ganti any[][] menjadi (string | null)[][]
function canPlace(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  direction: "across" | "down",
) {
  if (row < 0 || col < 0) return false;
  if (direction === "across") {
    if (col + word.length > GRID_SIZE) return false;
    if (col < 0) return false;
  } else {
    if (row + word.length > GRID_SIZE) return false;
    if (row < 0) return false;
  }

  for (let i = 0; i < word.length; i++) {
    const r = direction === "across" ? row : row + i;
    const c = direction === "across" ? col + i : col;
    const currentCell = grid[r][c];

    if (currentCell !== null && currentCell !== word[i]) {
      return false;
    }

    if (currentCell === null) {
      if (hasNeighbor(grid, r, c, direction)) return false;
    }
  }

  const beforeR = direction === "across" ? row : row - 1;
  const beforeC = direction === "across" ? col - 1 : col;
  if (
    beforeR >= 0 &&
    beforeC >= 0 &&
    beforeR < GRID_SIZE &&
    beforeC < GRID_SIZE &&
    grid[beforeR][beforeC] !== null
  )
    return false;

  const afterR = direction === "across" ? row : row + word.length;
  const afterC = direction === "across" ? col + word.length : col;
  if (
    afterR >= 0 &&
    afterC >= 0 &&
    afterR < GRID_SIZE &&
    afterC < GRID_SIZE &&
    grid[afterR][afterC] !== null
  )
    return false;

  return true;
}

// PERBAIKAN: Ganti any[][] menjadi (string | null)[][]
function hasNeighbor(
  grid: (string | null)[][],
  r: number,
  c: number,
  currentDir: "across" | "down",
) {
  if (currentDir === "across") {
    if (r > 0 && grid[r - 1][c] !== null) return true;
    if (r < GRID_SIZE - 1 && grid[r + 1][c] !== null) return true;
  } else {
    if (c > 0 && grid[r][c - 1] !== null) return true;
    if (c < GRID_SIZE - 1 && grid[r][c + 1] !== null) return true;
  }
  return false;
}

// PERBAIKAN: Ganti any[][] menjadi (string | null)[][]
function placeWord(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  direction: "across" | "down",
) {
  for (let i = 0; i < word.length; i++) {
    if (direction === "across") grid[row][col + i] = word[i];
    else grid[row + i][col] = word[i];
  }
}
