import { create } from "zustand";

interface GameStoreState {
  selectedGameId: string | null;
  setSelectedGameId: (id: string | null) => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  selectedGameId: null,
  setSelectedGameId: (id) => set({ selectedGameId: id }),
}));
