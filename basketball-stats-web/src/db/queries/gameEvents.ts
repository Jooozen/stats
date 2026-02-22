import { db } from "../database";
import type { GameEvent } from "@/types/database";
import { generateId } from "@/utils/helpers";

export async function createGameEvent(
  data: Omit<GameEvent, "id" | "createdAt">
): Promise<string> {
  const id = generateId();
  await db.gameEvents.add({ ...data, id, createdAt: new Date() });
  return id;
}

export async function deleteGameEvent(id: string): Promise<void> {
  await db.gameEvents.delete(id);
}

export async function getGameEventsByGame(gameId: string): Promise<GameEvent[]> {
  return db.gameEvents
    .where("gameId")
    .equals(gameId)
    .sortBy("createdAt");
}

export async function getLastGameEvent(
  gameId: string
): Promise<GameEvent | undefined> {
  const events = await db.gameEvents
    .where("gameId")
    .equals(gameId)
    .reverse()
    .sortBy("createdAt");
  return events[0];
}
