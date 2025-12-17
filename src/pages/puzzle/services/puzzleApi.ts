import api from "@/api/axios";
import type {
  IPuzzleGame,
  IPuzzleStartResponse,
  IPuzzleFinishRequest,
  IPuzzleFinishResponse,
  ILeaderboardEntry,
  Difficulty,
} from "../types/puzzle.types";

const PUZZLE_BASE_URL = "/api/game/game-type/puzzle";

export const puzzleApi = {
  // Get list puzzle, optional filter by difficulty
  getList: async (difficulty?: Difficulty): Promise<IPuzzleGame[]> => {
    const params = difficulty ? `?difficulty=${difficulty}` : "";
    const response = await api.get(`${PUZZLE_BASE_URL}${params}`);
    return response.data.data;
  },

  // Get puzzle detail by ID
  getById: async (gameId: string): Promise<IPuzzleGame> => {
    const response = await api.get(`${PUZZLE_BASE_URL}/${gameId}`);
    return response.data.data;
  },

  // Start puzzle session
  startGame: async (
    gameId: string,
    difficulty: Difficulty,
  ): Promise<IPuzzleStartResponse> => {
    const response = await api.post(`${PUZZLE_BASE_URL}/${gameId}/start`, {
      difficulty,
    });
    return response.data.data;
  },

  // Finish puzzle & submit score
  finishGame: async (
    data: IPuzzleFinishRequest,
  ): Promise<IPuzzleFinishResponse> => {
    const response = await api.post(`${PUZZLE_BASE_URL}/finish`, data);
    return response.data.data;
  },

  // Get leaderboard
  getLeaderboard: async (gameId: string): Promise<ILeaderboardEntry[]> => {
    const response = await api.get(`${PUZZLE_BASE_URL}/${gameId}/leaderboard`);
    return response.data.data;
  },
};
