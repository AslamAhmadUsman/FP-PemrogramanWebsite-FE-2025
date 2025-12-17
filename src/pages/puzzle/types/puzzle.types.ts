export interface IPuzzleGame {
  id: string;
  name: string;
  description: string;
  thumbnail_image: string;
  game_json: IPuzzleJson;
  total_played: number;
  created_at: string;
  is_published: boolean;
  difficulty: "easy" | "medium" | "hard";
  rows?: number;
  cols?: number;
}

export interface IPuzzleJson {
  title: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  thumbnail?: string;
  rows: number;
  cols: number;
  difficulty: "easy" | "medium" | "hard";
  timeLimitSec: number;
}

export interface IPuzzleStartResponse {
  sessionId: string;
  gameId: string;
  gameName: string;
  startedAt: string;
  gameJson: IPuzzleJson;
}

export interface IPuzzleFinishRequest {
  sessionId: string;
  gameId: string;
  moveCount?: number;
  timeTaken?: number; // dalam detik
}

export interface IPuzzleFinishResponse {
  message: string;
  sessionId: string;
  finishedAt: string;
  timeTaken: number;
  moveCount: number;
  score: number;
  game: {
    id: string;
    title: string;
    thumbnail: string;
  };
}

export interface ILeaderboardEntry {
  id: string;
  score: number;
  difficulty: string;
  time_taken: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    profile_picture: string;
  };
}

export type Difficulty = "easy" | "medium" | "hard";

export interface IPuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  imageX: number;
  imageY: number;
}

export type GameState = "lobby" | "playing" | "paused" | "finished";
