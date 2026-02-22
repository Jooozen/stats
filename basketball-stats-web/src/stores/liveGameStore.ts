import { create } from "zustand";
import type { ActionType } from "@/types/database";

interface LiveGameState {
  gameId: string | null;
  currentQuarter: number;
  gameTime: number; // 経過秒数
  isRunning: boolean;
  selectedTeamId: string | null;
  selectedPlayerId: string | null;

  // Actions
  setGameId: (id: string | null) => void;
  setCurrentQuarter: (quarter: number) => void;
  setGameTime: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  setSelectedTeamId: (id: string | null) => void;
  setSelectedPlayerId: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  gameId: null,
  currentQuarter: 1,
  gameTime: 0,
  isRunning: false,
  selectedTeamId: null,
  selectedPlayerId: null,
};

export const useLiveGameStore = create<LiveGameState>((set) => ({
  ...initialState,
  setGameId: (id) => set({ gameId: id }),
  setCurrentQuarter: (quarter) => set({ currentQuarter: quarter }),
  setGameTime: (time) => set({ gameTime: time }),
  setIsRunning: (running) => set({ isRunning: running }),
  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setSelectedPlayerId: (id) => set({ selectedPlayerId: id }),
  reset: () => set(initialState),
}));
