import Dexie, { type EntityTable } from "dexie";
import type {
  Team,
  Player,
  Game,
  GameEvent,
  GameLineup,
  PlayerGameStats,
} from "@/types/database";

export class BasketballDB extends Dexie {
  teams!: EntityTable<Team, "id">;
  players!: EntityTable<Player, "id">;
  games!: EntityTable<Game, "id">;
  gameEvents!: EntityTable<GameEvent, "id">;
  gameLineups!: EntityTable<GameLineup, "id">;
  playerGameStats!: EntityTable<PlayerGameStats, "id">;

  constructor() {
    super("BasketballStatsDB");

    this.version(1).stores({
      teams: "id, name, isMyTeam, createdAt",
      players: "id, teamId, number, isActive, createdAt",
      games: "id, homeTeamId, awayTeamId, date, status, createdAt",
      gameEvents: "id, gameId, teamId, playerId, actionType, quarter, gameTime, createdAt",
      gameLineups: "id, gameId, teamId, playerId, quarter",
      playerGameStats: "id, gameId, teamId, playerId",
    });
  }
}

export const db = new BasketballDB();
