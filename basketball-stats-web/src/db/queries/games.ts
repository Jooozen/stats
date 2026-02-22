import { db } from "../database";
import type { Game } from "@/types/database";
import { generateId } from "@/utils/helpers";

export async function createGame(
  data: Omit<Game, "id" | "homeScore" | "awayScore" | "createdAt" | "updatedAt">
): Promise<string> {
  const id = generateId();
  const now = new Date();
  await db.games.add({
    ...data,
    id,
    homeScore: 0,
    awayScore: 0,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function updateGame(
  id: string,
  data: Partial<Omit<Game, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  await db.games.update(id, { ...data, updatedAt: new Date() });
}

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

export async function getGame(id: string): Promise<Game | undefined> {
  return db.games.get(id);
}

export async function getAllGames(): Promise<Game[]> {
  return db.games.orderBy("date").reverse().toArray();
}
