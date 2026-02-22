import { create } from "zustand";
import type {
  GameType,
  OpponentTrackingLevel,
} from "@/types/database";
import { createGame } from "@/db/queries/games";
import { createLineup } from "@/db/queries/gameLineups";

interface GameCreateState {
  // Wizard step
  currentStep: number;

  // Step data
  opponentTeamId: string | null;
  gameType: GameType;
  tournamentName: string;
  gameDate: string; // YYYY-MM-DD
  gameTime: string; // HH:MM (optional, "" if not set)
  quarterMinutes: number;
  totalQuarters: number;
  isHome: boolean;
  opponentTrackingLevel: OpponentTrackingLevel;
  homeStarters: string[]; // player IDs, max 5
  awayStarters: string[]; // player IDs, max 5

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setOpponentTeamId: (id: string | null) => void;
  setGameType: (type: GameType) => void;
  setTournamentName: (name: string) => void;
  setGameDate: (date: string) => void;
  setGameTime: (time: string) => void;
  setQuarterMinutes: (min: number) => void;
  setTotalQuarters: (q: number) => void;
  setIsHome: (val: boolean) => void;
  setOpponentTrackingLevel: (level: OpponentTrackingLevel) => void;
  toggleHomeStarter: (playerId: string) => void;
  toggleAwayStarter: (playerId: string) => void;
  createGameAndLineups: (ownTeamId: string) => Promise<string>;
  reset: () => void;
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const initialState = {
  currentStep: 0,
  opponentTeamId: null as string | null,
  gameType: "official" as GameType,
  tournamentName: "",
  gameDate: todayString(),
  gameTime: "",
  quarterMinutes: 10,
  totalQuarters: 4,
  isHome: true,
  opponentTrackingLevel: "full" as OpponentTrackingLevel,
  homeStarters: [] as string[],
  awayStarters: [] as string[],
};

export const useGameCreateStore = create<GameCreateState>((set, get) => ({
  ...initialState,

  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  goToStep: (step) => set({ currentStep: step }),

  setOpponentTeamId: (id) => set({ opponentTeamId: id }),
  setGameType: (type) => set({ gameType: type }),
  setTournamentName: (name) => set({ tournamentName: name }),
  setGameDate: (date) => set({ gameDate: date }),
  setGameTime: (time) => set({ gameTime: time }),
  setQuarterMinutes: (min) => set({ quarterMinutes: min }),
  setTotalQuarters: (q) => set({ totalQuarters: q }),
  setIsHome: (val) => set({ isHome: val }),
  setOpponentTrackingLevel: (level) =>
    set({ opponentTrackingLevel: level }),

  toggleHomeStarter: (playerId) =>
    set((s) => {
      if (s.homeStarters.includes(playerId)) {
        return { homeStarters: s.homeStarters.filter((id) => id !== playerId) };
      }
      if (s.homeStarters.length >= 5) return s;
      return { homeStarters: [...s.homeStarters, playerId] };
    }),

  toggleAwayStarter: (playerId) =>
    set((s) => {
      if (s.awayStarters.includes(playerId)) {
        return { awayStarters: s.awayStarters.filter((id) => id !== playerId) };
      }
      if (s.awayStarters.length >= 5) return s;
      return { awayStarters: [...s.awayStarters, playerId] };
    }),

  createGameAndLineups: async (ownTeamId: string) => {
    const s = get();
    const opponentId = s.opponentTeamId!;
    const homeTeamId = s.isHome ? ownTeamId : opponentId;
    const awayTeamId = s.isHome ? opponentId : ownTeamId;

    // Build ISO date
    let gameDate = new Date(s.gameDate).toISOString();
    if (s.gameTime) {
      const [h, m] = s.gameTime.split(":");
      const d = new Date(s.gameDate);
      d.setHours(parseInt(h), parseInt(m), 0, 0);
      gameDate = d.toISOString();
    }

    const checkInTime = `${String(s.quarterMinutes).padStart(2, "0")}:00`;

    const game = await createGame({
      homeTeamId,
      awayTeamId,
      gameDate,
      gameType: s.gameType,
      tournamentName: s.tournamentName,
      quarterMinutes: s.quarterMinutes,
      totalQuarters: s.totalQuarters,
      status: "live",
      opponentTrackingLevel: s.opponentTrackingLevel,
      notes: "",
    });

    // Create starter lineups for home starters
    const homeStarterIds = s.isHome ? s.homeStarters : s.awayStarters;
    const awayStarterIds = s.isHome ? s.awayStarters : s.homeStarters;

    for (const playerId of homeStarterIds) {
      await createLineup({
        gameId: game.id,
        teamId: homeTeamId,
        playerId,
        quarter: 1,
        checkInTime,
        checkOutTime: null,
        isStarter: true,
      });
    }

    for (const playerId of awayStarterIds) {
      await createLineup({
        gameId: game.id,
        teamId: awayTeamId,
        playerId,
        quarter: 1,
        checkInTime,
        checkOutTime: null,
        isStarter: true,
      });
    }

    return game.id;
  },

  reset: () => set({ ...initialState, gameDate: todayString() }),
}));
