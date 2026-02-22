import { create } from "zustand";

interface LiveGameState {
  gameId: string | null;
  currentQuarter: number;
  gameClock: string; // "MM:SS"
  isRunning: boolean;
  selectedTeamId: string | null;
  selectedPlayerId: string | null;

  // Actions
  setGameId: (id: string | null) => void;
  setCurrentQuarter: (quarter: number) => void;
  setGameClock: (clock: string) => void;
  setIsRunning: (running: boolean) => void;
  setSelectedTeamId: (id: string | null) => void;
  setSelectedPlayerId: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  gameId: null,
  currentQuarter: 1,
  gameClock: "10:00",
  isRunning: false,
  selectedTeamId: null,
  selectedPlayerId: null,
};

export const useLiveGameStore = create<LiveGameState>((set) => ({
  ...initialState,
  setGameId: (id) => set({ gameId: id }),
  setCurrentQuarter: (quarter) => set({ currentQuarter: quarter }),
  setGameClock: (clock) => set({ gameClock: clock }),
  setIsRunning: (running) => set({ isRunning: running }),
  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setSelectedPlayerId: (id) => set({ selectedPlayerId: id }),
  reset: () => set(initialState),
}));
