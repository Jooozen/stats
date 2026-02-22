import Dexie, { type Table } from "dexie";
import type {
  Team,
  Player,
  Game,
  GameEvent,
  GameLineup,
  PlayerGameStats,
} from "@/types/database";

class BasketballStatsDB extends Dexie {
  teams!: Table<Team>;
  players!: Table<Player>;
  games!: Table<Game>;
  gameEvents!: Table<GameEvent>;
  gameLineups!: Table<GameLineup>;
  playerGameStats!: Table<PlayerGameStats>;

  constructor() {
    super("BasketballStatsDB");

    this.version(1).stores({
      teams: "id, name, isOwnTeam, createdAt",
      players: "id, teamId, number, [teamId+number], isActive",
      games: "id, homeTeamId, awayTeamId, gameDate, gameType, status, createdAt",
      gameEvents:
        "id, gameId, teamId, playerId, actionType, quarter, [gameId+teamId], [gameId+quarter], createdAt",
      gameLineups: "id, gameId, teamId, playerId, quarter, [gameId+teamId]",
      playerGameStats:
        "id, gameId, teamId, playerId, [gameId+teamId], [gameId+playerId]",
    });
  }
}

export const db = new BasketballStatsDB();
