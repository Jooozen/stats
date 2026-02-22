import { db } from "../database";
import type { PlayerGameStats } from "@/types/database";
import { generateId } from "@/utils/helpers";

export async function upsertPlayerGameStats(
  data: Omit<PlayerGameStats, "id">
): Promise<void> {
  const existing = await db.playerGameStats
    .where("gameId")
    .equals(data.gameId)
    .filter((s) => s.playerId === data.playerId)
    .first();

  if (existing) {
    await db.playerGameStats.update(existing.id, data);
  } else {
    await db.playerGameStats.add({ ...data, id: generateId() });
  }
}

export async function getPlayerGameStats(
  gameId: string
): Promise<PlayerGameStats[]> {
  return db.playerGameStats.where("gameId").equals(gameId).toArray();
}

export async function getPlayerAllGameStats(
  playerId: string
): Promise<PlayerGameStats[]> {
  return db.playerGameStats.where("playerId").equals(playerId).toArray();
}
