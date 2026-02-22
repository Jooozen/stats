import { create } from "zustand";

interface TeamStoreState {
  selectedTeamId: string | null;
  setSelectedTeamId: (id: string | null) => void;
}

export const useTeamStore = create<TeamStoreState>((set) => ({
  selectedTeamId: null,
  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
}));
