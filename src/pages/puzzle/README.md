# 🧩 Puzzle Game Module

A fully-featured puzzle game implementation with React, TypeScript, and TailwindCSS.

## 📁 Folder Structure

```
src/pages/puzzle/
├── index.tsx                    # Puzzle list page (with difficulty filter)
├── [id]/
│   └── index.tsx               # Gameplay page with all states
├── components/
│   ├── PuzzleCard.tsx          # Card for puzzle list display
│   ├── PuzzleBoard.tsx         # Main puzzle gameplay board
│   ├── PuzzlePiece.tsx         # Individual puzzle piece component
│   ├── DifficultySelector.tsx  # Easy/Medium/Hard selector
│   ├── ExitButton.tsx          # ⚠️ WAJIB - Exit to home with POST request
│   ├── PauseButton.tsx         # ⚠️ WAJIB - Pause game (time-based)
│   ├── PauseOverlay.tsx        # Overlay when game is paused
│   ├── GameTimer.tsx           # Countdown timer display
│   ├── MoveCounter.tsx         # Move counter display
│   └── GameResult.tsx          # Score & results after completion
├── hooks/
│   ├── usePuzzleGame.ts        # Main game logic hook
│   ├── usePuzzleList.ts        # Hook for fetching puzzle list
│   └── useTimer.ts             # Timer countdown hook
├── services/
│   └── puzzleApi.ts            # API service layer
└── types/
    └── puzzle.types.ts         # TypeScript interfaces
```

## 🎮 Game Flow

```
[Lobby] ──(Select Difficulty)──> [Playing] ──(Complete)──> [Finished]
   │                                  │
   │                                  ├──(Pause)──> [Paused]
   │                                  │                │
   │                                  <──(Resume)──────┘
   │                                  │
   └──────────<──(Exit)───────────────┘
```

## ⏱️ Timer Configuration

| Difficulty | Grid | Time Limit |
|------------|------|------------|
| Easy | 3×3 | 5 min (300 sec) |
| Medium | 4×4 | 10 min (600 sec) |
| Hard | 5×5 | 15 min (900 sec) |

## 🎯 Scoring Formula

```
score = max(1000 - timeTaken - (moveCount * 2), 100)
```

## 🌐 API Endpoints

Base URL: `http://localhost:4000/api/game/game-type/puzzle`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all puzzles |
| GET | `/?difficulty=easy` | Filter by difficulty |
| GET | `/:game_id` | Get puzzle detail |
| POST | `/:game_id/start` | Start game session |
| POST | `/finish` | Submit score |
| GET | `/:game_id/leaderboard` | Get leaderboard |

## 🚀 Routes

- `/puzzle` - Puzzle list page
- `/puzzle/:id` - Gameplay page

## ⚠️ Mandatory Components

1. **ExitButton** - Sends POST request to `/finish` when exiting
2. **PauseButton** - Required for time-based games
3. **PauseOverlay** - Shows when game is paused

## ✅ Features Implemented

- [x] Puzzle list with difficulty filter
- [x] Click-to-swap gameplay mechanism
- [x] Responsive puzzle board
- [x] Timer countdown with visual urgency
- [x] Move counter
- [x] Preview image toggle
- [x] Pause/Resume functionality
- [x] Exit button with API call
- [x] Score calculation and display
- [x] Star rating system
- [x] Play again option
- [x] Responsive design (mobile & desktop)
- [x] Beautiful dark theme UI

## 🎨 Design Features

- Modern glassmorphism effects
- Gradient color schemes
- Smooth animations and transitions
- Visual feedback for interactions
- Urgency indicators for low time
- Premium card designs
