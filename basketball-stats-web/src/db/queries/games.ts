import { db } from "../database";
import type { Game, GameStatus } from "@/types/database";
import { generateId, nowISO } from "@/utils/helpers";

/** 試合を作成 */
export async function createGame(
  data: Omit<Game, "id" | "homeScore" | "awayScore" | "createdAt" | "updatedAt">
): Promise<Game> {
  const now = nowISO();
  const game: Game = {
    ...data,
    id: generateId(),
    homeScore: 0,
    awayScore: 0,
    createdAt: now,
    updatedAt: now,
  };
  await db.games.add(game);
  return game;
}

/** 試合IDで取得 */
export async function getGameById(
  id: string
): Promise<Game | undefined> {
  return db.games.get(id);
}

/** ステータスで試合一覧を取得 */
export async function getGamesByStatus(
  status: GameStatus
): Promise<Game[]> {
  return db.games.where("status").equals(status).toArray();
}

/** 全試合一覧を取得（新しい順） */
export async function getAllGames(): Promise<Game[]> {
  return db.games.orderBy("gameDate").reverse().toArray();
}

/** 試合を更新 */
export async function updateGame(
  id: string,
  data: Partial<Omit<Game, "id" | "createdAt">>
): Promise<void> {
  await db.games.update(id, { ...data, updatedAt: nowISO() });
}

/** 試合を削除（関連データも全て削除） */
export async function deleteGame(id: string): Promise<void> {
  await db.transaction(
    "rw",
    [db.games, db.gameEvents, db.gameLineups, db.playerGameStats],
    async () => {
      await db.gameEvents.where("gameId").equals(id).delete();
      await db.gameLineups.where("gameId").equals(id).delete();
      await db.playerGameStats.where("gameId").equals(id).delete();
      await db.games.delete(id);
    }
  );
}
